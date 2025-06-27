const {
  ReadData, WriteData, readCourses, writeCourses,
  checkCoursesExist, hasDuplicateCourses, emailRegex
} = require("./utils");

exports.patchStudent = (req, res) => {
  const students = ReadData();
  let coursesData = readCourses();
  const { id, email } = req.query;

  if (!id && !email) {
    return res.status(400).json({
      status: 400,
      message: "'id' or 'email' is required",
      data: null
    });
  }

  // Encontrar estudiante actual
  let studentIndex = -1;
  if (id) {
    studentIndex = students.findIndex(s => s.id === id);
  } else if (email) {
    studentIndex = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
  }

  if (studentIndex === -1) {
    return res.status(404).json({
      status: 404,
      message: "Student not found",
      data: null
    });
  }

  const student = students[studentIndex];
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Request body cannot be empty",
      data: null
    });
  }

  let { name, email: newEmail, courses } = data;

  // Validaciones para nombre
  if (name !== undefined) {
    name = name.trim();
    if (name === "") {
      return res.status(400).json({
        status: 400,
        message: "Name cannot be empty",
        data: null
      });
    }
    if (!/^[\p{L} .'-]+$/u.test(name)) {
      return res.status(400).json({
        status: 400,
        message: "Name contains invalid characters",
        data: null
      });
    }
    student.name = name;
  }

  // Validaciones para email
  if (newEmail !== undefined) {
    newEmail = newEmail.trim().toLowerCase();
    if (newEmail === "") {
      return res.status(400).json({
        status: 400,
        message: "Email cannot be empty",
        data: null
      });
    }
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email format",
        data: null
      });
    }
    if (students.some((s, i) => s.email.toLowerCase() === newEmail && i !== studentIndex)) {
      return res.status(400).json({
        status: 400,
        message: "This user is already registered",
        data: null
      });
    }
  }

  // Validaciones para cursos
  if (courses !== undefined) {
    if (!Array.isArray(courses)) {
      return res.status(400).json({
        status: 400,
        message: "Courses must be an array of strings",
        data: null
      });
    }
    if (!courses.every(c => typeof c === "string" && c.trim() !== "")) {
      return res.status(400).json({
        status: 400,
        message: "All courses must be non-empty strings",
        data: null
      });
    }
    if (!courses.every(c => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
      return res.status(400).json({
        status: 400,
        message: "Courses contain invalid characters",
        data: null
      });
    }
    if (hasDuplicateCourses(courses)) {
      return res.status(400).json({
        status: 400,
        message: "Courses must not contain duplicates",
        data: null
      });
    }

    // Verificar que todos los cursos existan en courses.json
    const invalidCourse = checkCoursesExist(courses, coursesData);
    if (invalidCourse !== null) {
      return res.status(400).json({
        status: 400,
        message: `This course does not exist`,
        data: null
      });
    }
  }

  // 1. Si cambió el email, actualizarlo en courses.json
  if (newEmail !== undefined && newEmail !== student.email) {
    coursesData.forEach(courseEntry => {
      if (courseEntry.students && Array.isArray(courseEntry.students)) {
        const idx = courseEntry.students.indexOf(student.email);
        if (idx !== -1) {
          courseEntry.students[idx] = newEmail;
        }
      }
    });
    student.email = newEmail;
  }

  // 2. Si cambiaron cursos, actualizar la inscripción en courses.json
  if (courses !== undefined) {
    const oldCourses = student.courses.map(c => c.trim().toLowerCase());
    const newCourses = courses.map(c => c.trim().toLowerCase());

    // Quitar estudiante de cursos que ya no tiene
    for (const courseEntry of coursesData) {
      const courseName = courseEntry.name.toLowerCase();
      if (oldCourses.includes(courseName) && !newCourses.includes(courseName)) {
        courseEntry.students = courseEntry.students.filter(e => e !== student.email);
      }
    }

    // Añadir estudiante a cursos nuevos donde no estaba
    for (const nc of newCourses) {
      const courseEntry = coursesData.find(c => c.name.toLowerCase() === nc);
      if (courseEntry) {
        if (!courseEntry.students.includes(student.email)) {
          courseEntry.students.push(student.email);
        }
      }
    }

    student.courses = newCourses;
  }

  students[studentIndex] = student;
  WriteData(students);
  writeCourses(coursesData);

  res.status(200).json({
    status: 200,
    message: "Student updated successfully with course synchronization",
    data: student
  });
};