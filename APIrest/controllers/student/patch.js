const {
  ReadData,
  WriteData,
  readCourses,
  writeCourses,
  hasDuplicateCourses,
  checkCoursesExist,
  validateStudent,
  uuidv4,
} = require("./utils");

exports.patchStudent = (req, res) => {
  const students = ReadData();
  let coursesData = readCourses();
  const { id, email } = req.query;

  if (!id && !email) {
    return res
      .status(400)
      .json({ status: 400, message: "Student id or email required" });
  }

  // Encontrar estudiante actual
  let studentIndex = -1;
  if (id) {
    studentIndex = students.findIndex((s) => s.id === id);
  } else if (email) {
    studentIndex = students.findIndex(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );
  }

  if (studentIndex === -1) {
    return res.status(404).json({ status: 404, message: "Student not found" });
  }

  const student = students[studentIndex];
  const data = req.body;

  // Validación genérica de campos permitidos
  const allowedFields = ["name", "email", "courses"];
  const invalidFields = Object.keys(data).filter(
    (key) => !allowedFields.includes(key)
  );
  if (invalidFields.length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Request contains invalid field(s).",
    });
  }

  // Si se envía 'courses', valida con schema y utilidades
  if (data.courses !== undefined) {
    const partialSchema = {
      type: "object",
      properties: {
        courses: {
          type: "array",
          items: { type: "string" },
          minItems: 1,
        },
      },
      required: ["courses"],
      additionalProperties: false,
    };
    const valid = validateStudent(partialSchema, { courses: data.courses });
    if (!valid.valid) {
      return res.status(400).json({
        status: 400,
        message: "Invalid courses format",
        errors: valid.errors,
      });
    }

    // Validar cursos duplicados
    if (hasDuplicateCourses(data.courses)) {
      return res.status(400).json({
        status: 400,
        message: "Duplicate courses are not allowed",
      });
    }

    // Validar existencia de cursos
    const notExist = checkCoursesExist(data.courses, coursesData);
    if (notExist && notExist.length > 0) {
      return res.status(400).json({
        status: 400,
        message: `These courses do not exist: ${notExist.join(", ")}`,
      });
    }

    // Quitar al estudiante de todos los cursos
    for (const course of coursesData) {
      course.students = course.students.filter((e) => e !== student.email);
    }

    // Agregar al estudiante a los cursos nuevos
    for (const courseName of data.courses) {
      const course = coursesData.find((c) => c.name === courseName);
      if (course && !course.students.includes(student.email)) {
        course.students.push(student.email);
      }
    }

    // Actualizar la lista de cursos del estudiante
    student.courses = data.courses;
    writeCourses(coursesData);
  }

  // Actualizar otros campos si se envían (opcional)
  if (data.name) student.name = data.name.trim();
  if (data.email) student.email = data.email.trim().toLowerCase();

  // Guardar cambios en estudiantes
  WriteData(students);

  return res.status(200).json({
    status: 200,
    message: "Student updated successfully",
    data: updatedStudent,
  });
};
