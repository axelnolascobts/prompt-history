const {
  ReadData, WriteData, readCourses, writeCourses,
  checkCoursesExist, hasDuplicateCourses, validateStudent, emailRegex, uuidv4
} = require("./utils");

exports.createStudent = (req, res) => {
  const students = ReadData();
  const courses = readCourses();
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Request body cannot be empty",
      data: null
    });
  }

  if (!validateStudent(data)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid input",
      data: validateStudent.errors
    });
  }

  if (students.some((s) => s.email.toLowerCase() === data.email.trim().toLowerCase())) {
    return res.status(400).json({
      status: 400,
      message: "The email already exists",
      data: null
    });
  }

  const trimmedName = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const coursesInput = data.courses;

  if (trimmedName === "") {
    return res.status(400).json({
      status: 400,
      message: "Name cannot be empty",
      data: null
    });
  }

  if (!/^[\p{L} .'-]+$/u.test(trimmedName)) {
    return res.status(400).json({
      status: 400,
      message: "Name contains invalid characters",
      data: null
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid email format",
      data: null
    });
  }

  if (!Array.isArray(coursesInput) || coursesInput.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Courses must be a non-empty array",
      data: null
    });
  }

  if (!coursesInput.every(c => typeof c === "string" && c.trim() !== "")) {
    return res.status(400).json({
      status: 400,
      message: "All courses must be non-empty strings",
      data: null
    });
  }

  if (!coursesInput.every(c => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
    return res.status(400).json({
      status: 400,
      message: "Courses contain invalid characters",
      data: null
    });
  }

  if (hasDuplicateCourses(coursesInput)) {
    return res.status(400).json({
      status: 400,
      message: "Courses must not contain duplicates",
      data: null
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

  const newStudent = {
    id: uuidv4(),
    name: trimmedName,
    email,
    courses: normalizedCourses,
  };

  students.push(newStudent);
  WriteData(students);

  // Añadir email del estudiante a los cursos correspondientes en courses.json
  normalizedCourses.forEach(cName => {
    const course = courses.find(c => c.name.toLowerCase() === cName);
    if (course && !course.students.includes(email)) {
      course.students.push(email);
    }
  });
  writeCourses(courses);

  res.status(201).json({
    status: 201,
    message: "Student created successfully and courses updated",
    data: newStudent,
  });
};