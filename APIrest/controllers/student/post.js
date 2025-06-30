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

const nameRegex = /^[\p{L} ]+$/u;

exports.createStudent = (req, res) => {
  try {
    if (Object.keys(req.query).length > 0) {
      return res.status(400).json({
        status: 400,
        message: "POST /students does not accept query parameters",
      });
    }

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        status: 400,
        message: "Request body is required and must be a JSON object",
        data: null,
      });
    }

    const { name, email, courses } = req.body;

    const students = ReadData();
    const coursesData = readCourses();

    // Validar name
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        status: 400,
        message: "Name cannot be empty",
        data: null,
      });
    }
    if (!nameRegex.test(name.trim())) {
      return res.status(400).json({
        status: 400,
        message: "Name must contain only letters and spaces",
        data: null,
      });
    }

    // Validar email
    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({
        status: 400,
        message: "Email is required",
        data: null,
      });
    }
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email format",
        data: null,
      });
    }

    // No permitir duplicados de email
    if (
      students.some(
        (s) => s.email.toLowerCase() === email.trim().toLowerCase()
      )
    ) {
      return res.status(409).json({
        status: 409,
        message: "Student with this email already exists",
        data: null,
      });
    }

    // Validar formato de cursos
    if (
      !Array.isArray(courses) ||
      courses.length === 0 ||
      courses.some((c) => typeof c !== "string" || c.trim() === "")
    ) {
      return res.status(400).json({
        status: 400,
        message: "Invalid courses format",
        data: null,
      });
    }

    // Validar cursos duplicados
    if (hasDuplicateCourses(courses)) {
      return res.status(400).json({
        status: 400,
        message: "Duplicate courses are not allowed",
        data: null,
      });
    }

    // Validar existencia de cursos
    const notExist = checkCoursesExist(courses, coursesData);
    if (notExist && notExist.length > 0) {
      return res.status(400).json({
        status: 400,
        message: `These courses do not exist: ${notExist.join(", ")}`,
        data: null,
      });
    }

    // Crear estudiante
    const newStudent = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      courses: courses.map((c) => c.trim()),
    };
    students.push(newStudent);
    WriteData(students);

    // Agregar email del estudiante a cada curso correspondiente
    for (const courseName of newStudent.courses) {
      const course = coursesData.find((c) => c.name.trim().toLowerCase() === courseName.trim().toLowerCase());
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
  } catch (err) {
    console.error("POST /students error:", err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
};
