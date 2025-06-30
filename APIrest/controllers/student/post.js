const {
  ReadData,
  WriteData,
  readCourses,
  writeCourses,
  checkCoursesExist,
  hasDuplicateCourses,
  validateStudent,
  emailRegex,
  uuidv4,
} = require("./utils");

exports.createStudent = (req, res) => {
  // Rechaza si hay query params
  if (Object.keys(req.query).length > 0) {
    return res.status(400).json({
      status: 400,
      message: "POST /students does not accept query parameters",
    });
  }

  const students = ReadData();
  const coursesData = readCourses();
  const { name, email, courses } = req.body;

  // Validar body completo con AJV
  if (!validateStudent(req.body)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid body: check required fields and field names",
      errors: validateStudent.errors,
    });
  }

  // No permitir duplicados
  if (
    students.some((s) => s.email.toLowerCase() === email.trim().toLowerCase())
  ) {
    return res.status(409).json({ status: 409, message: "Student with this email already exists" });
  }

  // Validar cursos duplicados
  if (hasDuplicateCourses(courses)) {
    return res.status(400).json({
      status: 400,
      message: "Duplicate courses are not allowed",
    });
  }

  // Validar existencia de cursos
  const notExist = checkCoursesExist(courses, coursesData);
  if (notExist && notExist.length > 0) {
    return res.status(400).json({
      status: 400,
      message: `These courses do not exist: ${notExist.join(", ")}`,
    });
  }

  // Validar formato de cursos
  if (!Array.isArray(courses) || courses.some(c => typeof c !== 'string' || c.trim() === '')) {
    return res.status(400).json({ status: 400, message: "Invalid courses format" });
  }

  // Validar nombre
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: "Course name is required" });
  }
  if (!/^[\p{L}\d .'-]+$/u.test(name)) {
    return res.status(400).json({ message: "Course name contains invalid characters" });
  }

  // Crear estudiante
  const newStudent = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    courses: courses,
  };
  students.push(newStudent);
  WriteData(students);

  // Agregar email del estudiante a cada curso correspondiente
  for (const courseName of courses) {
    const course = coursesData.find((c) => c.name === courseName);
    if (course && !course.students.includes(newStudent.email)) {
      course.students.push(newStudent.email);
    }
  }
  writeCourses(coursesData);

  return res.status(201).json({
    status: 201,
    message: "Student created successfully",
    data: newStudent,
  });
};
