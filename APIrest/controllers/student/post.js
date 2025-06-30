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
        message: "Request body cannot be empty",
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

    // Validar datos usando validateStudent
    const validation = validateStudent({ name, email, courses }, students, coursesData);
    if (!validation.valid) {
      return res.status(400).json({
        status: 400,
        message: validation.message,
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
