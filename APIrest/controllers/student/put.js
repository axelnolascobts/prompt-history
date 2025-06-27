const {
  ReadData, WriteData, readCourses, writeCourses,
  checkCoursesExist, hasDuplicateCourses, validateStudent, emailRegex
} = require("./utils");

exports.updateStudent = (req, res) => {
  const students = ReadData();
  const courses = readCourses();
  const { id, email } = req.query;

  if (!id && !email) {
    return res.status(400).json({
      status: 400,
      message: "'id' or 'email' is required",
      data: null,
    });
  }

  let index = -1;
  if (id) index = students.findIndex(s => s.id === id);
  else if (email) index = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ status: 404, message: "Student not found", data: null });
  }

  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Request body cannot be empty",
      data: null,
    });
  }

  if (!validateStudent(data)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid input",
      data: validateStudent.errors,
    });
  }

  const trimmedName = data.name.trim();
  const trimmedEmail = data.email.trim().toLowerCase();
  const coursesInput = data.courses;

  if (!/^[\p{L} .'-]+$/u.test(trimmedName)) {
    return res.status(400).json({
      status: 400,
      message: "Name contains invalid characters",
      data: null,
    });
  }

  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid email format",
      data: null,
    });
  }

  if (
    !Array.isArray(coursesInput) ||
    coursesInput.length === 0 ||
    !coursesInput.every(c => typeof c === "string" && c.trim() !== "")
  ) {
    return res.status(400).json({
      status: 400,
      message: "Courses must be a non-empty array of non-empty strings",
      data: null,
    });
  }

  if (!coursesInput.every(c => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
    return res.status(400).json({
      status: 400,
      message: "Courses contain invalid characters",
      data: null,
    });
  }

  if (hasDuplicateCourses(coursesInput)) {
    return res.status(400).json({
      status: 400,
      message: "Courses must not contain duplicates",
      data: null,
    });
  }

  // Validar que los cursos existan en courses.json
  const normalizedCourses = coursesInput.map(c => c.trim().toLowerCase());
  const invalidCourses = normalizedCourses.filter(
    c => !courses.some(course => course.name.toLowerCase() === c)
  );
  if (invalidCourses.length > 0) {
    return res.status(400).json({
      status: 400,
      message: `This course does not exist`,
      data: null,
    });
  }

  // Validar email duplicado con otro estudiante
  const emailUsedByAnother = students.some(
    (s, i) => s.email.toLowerCase() === trimmedEmail && i !== index
  );
  if (emailUsedByAnother) {
    return res.status(400).json({
      status: 400,
      message: "The email already exists",
      data: null,
    });
  }

  // Guardar email y cursos antiguos para sincronizar
  const oldEmail = students[index].email;
  const oldCourses = students[index].courses;

  // Actualizar estudiante
  students[index] = {
    id: students[index].id,
    name: trimmedName,
    email: trimmedEmail,
    courses: normalizedCourses,
  };

  WriteData(students);

  // Quitar email del estudiante de cursos antiguos no incluidos ahora
  oldCourses.forEach(cName => {
    if (!normalizedCourses.includes(cName)) {
      const course = courses.find(c => c.name.toLowerCase() === cName);
      if (course) {
        course.students = course.students.filter(e => e !== oldEmail);
      }
    }
  });

  // Añadir email del estudiante a cursos nuevos o existentes
  normalizedCourses.forEach(cName => {
    const course = courses.find(c => c.name.toLowerCase() === cName);
    if (course && !course.students.includes(trimmedEmail)) {
      course.students.push(trimmedEmail);
    }
  });

  // Si cambió email, actualizarlo en todos los cursos donde estaba antes
  if (oldEmail !== trimmedEmail) {
    courses.forEach(course => {
      course.students = course.students.map(e => (e === oldEmail ? trimmedEmail : e));
    });
  }

  writeCourses(courses);

  res.status(200).json({
    status: 200,
    message: "Student edited successfully and courses updated",
    data: students[index],
  });
};