const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true });

addFormats(ajv);

const DBPATH = path.join(__dirname, "../data/db.json");
const COURSEPATH = path.join(__dirname, "../data/courses.json");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// JSON Schema para validar estudiantes
const studentSchema = {
  type: "object",
  required: ["name", "email", "courses"],
  properties: {
    name: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
    courses: {
      type: "array",
      items: { type: "string" },
      minItems: 1
    },
  },
  additionalProperties: false,
};

const validateStudent = ajv.compile(studentSchema);

const hasDuplicateCourses = (arr) => {
  const normalized = arr.map(c => c.trim().toLowerCase());
  return new Set(normalized).size !== normalized.length;
};

// Leer datos de estudiantes
function ReadData() {
  const data = fs.readFileSync(DBPATH, "utf8");
  return JSON.parse(data);
}

// Guardar datos de estudiantes
function WriteData(data) {
  fs.writeFileSync(DBPATH, JSON.stringify(data, null, 2));
}

// Leer lista global de cursos
function readCourses() {
  if (!fs.existsSync(COURSEPATH)) {
    fs.writeFileSync(COURSEPATH, JSON.stringify([]));
  }
  const data = fs.readFileSync(COURSEPATH, "utf8");
  return JSON.parse(data);
}

// Guardar lista global de cursos
function writeCourses(courses) {
  fs.writeFileSync(COURSEPATH, JSON.stringify(courses, null, 2));
}

// Función auxiliar para validar si cursos existen en courses.json
function checkCoursesExist(coursesArray, coursesData) {
  const normalizedInput = coursesArray.map(c => c.trim().toLowerCase());
  for (const c of normalizedInput) {
    if (!coursesData.some(course => course.name.toLowerCase() === c)) {
      return c; // retorna el primer curso inválido
    }
  }
  return null;
}

// GET estudiantes (filtros por query params: id, name, email, course)
exports.getStudents = (req, res) => {
  const students = ReadData();
  const { id, name, email, course } = req.query;

  let filtered = students;

  if (id) {
    filtered = filtered.filter(s => s.id === id);
  }
  if (name) {
    filtered = filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (email) {
    filtered = filtered.filter(s => s.email.toLowerCase() === email.toLowerCase());
  }
  if (course) {
    filtered = filtered.filter(s =>
      s.courses.map(c => c.trim().toLowerCase()).includes(course.trim().toLowerCase())
    );
  }

  if (filtered.length === 0) {
    return res.status(404).json({
      status: 404,
      message: "No students found with the given query",
      data: []
    });
  }

  res.status(200).json({
    status: 200,
    message: "Students retrieved successfully",
    data: filtered
  });
};

// POST crear estudiante con validación y sincronización con courses.json
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

// PUT actualizar estudiante por id o email (query param) con sincronización cursos
exports.updateStudent = (req, res) => {
  const students = ReadData();
  const courses = readCourses();
  const { id, email } = req.query;

  if (!id && !email) {
    return res.status(400).json({
      status: 400,
      message: "Query param 'id' or 'email' is required",
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

// PATCH actualizar parcialmente por id o email (query param) con sincronización en courses.json
exports.patchStudent = (req, res) => {
  const students = ReadData();
  let coursesData = readCourses();
  const { id, email } = req.query;

  if (!id && !email) {
    return res.status(400).json({
      status: 400,
      message: "Query param 'id' or 'email' is required",
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
    // Para cada curso, buscar y reemplazar email viejo por nuevo
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
        // Quitar email del array students si existe
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

  // Guardar los cambios en ambos archivos
  students[studentIndex] = student;
  WriteData(students);
  writeCourses(coursesData);

  res.status(200).json({
    status: 200,
    message: "Student updated successfully with course synchronization",
    data: student
  });
};

// DELETE estudiante por id o email (query param) con sincronización cursos
exports.deleteStudent = (req, res) => {
  let students = ReadData();
  let courses = readCourses();
  const { id, email } = req.query;

  if (!id && !email) {
    return res.status(400).json({
      status: 400,
      message: "Query param 'id' or 'email' is required",
      data: null
    });
  }

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

  // Quitar email del estudiante de todos los cursos donde esté inscrito
  courses.forEach(courseEntry => {
    if (courseEntry.students && Array.isArray(courseEntry.students)) {
      courseEntry.students = courseEntry.students.filter(e => e !== student.email);
    }
  });

  // Eliminar estudiante
  students.splice(studentIndex, 1);

  WriteData(students);
  writeCourses(courses);

  res.status(200).json({
    status: 200,
    message: "Student deleted successfully and courses updated",
    data: student
  });
};
