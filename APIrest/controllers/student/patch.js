const {
  ReadData,
  WriteData,
  readCourses,
  writeCourses,
  hasDuplicateCourses,
  checkCoursesExist,
  emailRegex,
} = require("./utils");

const nameRegex = /^[\p{L} ]+$/u;

exports.patchStudent = (req, res) => {
  const { id, email } = req.query;
  if (!id && !email) {
    return res.status(400).json({
      status: 400,
      message: "cannot edit with name",
      data: null,
    });
  }
  try {
    const students = ReadData();
    let coursesData = readCourses();

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
      return res.status(404).json({
        status: 404,
        message: "Student not found",
        data: null,
      });
    }

    const student = students[studentIndex];
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Request body cannot be empty",
        data: null,
      });
    }

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        status: 400,
        message: "Request body is required and must be a JSON object",
        data: null,
      });
    }

    const { name, email: newEmail, courses } = req.body;

    // Validación de campos permitidos
    const allowedFields = ["name", "email", "courses"];
    const invalidFields = Object.keys(data).filter(
      (key) => !allowedFields.includes(key)
    );
    if (invalidFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Request contains invalid field(s).",
        data: null,
      });
    }

    // Validar y actualizar nombre
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
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
      student.name = name.trim();
    }

    // Validar y actualizar email
    if (newEmail !== undefined) {
      if (
        typeof newEmail !== "string" ||
        newEmail.trim() === "" ||
        !emailRegex.test(newEmail.trim())
      ) {
        return res.status(400).json({
          status: 400,
          message: "Invalid email format",
          data: null,
        });
      }
      // No permitir duplicados de email
      if (
        students.some(
          (s, i) =>
            s.email.toLowerCase() === newEmail.trim().toLowerCase() &&
            i !== studentIndex
        )
      ) {
        return res.status(409).json({
          status: 409,
          message: "Student with this email already exists",
          data: null,
        });
      }
      // Si cambia el email, actualizarlo en los cursos
      coursesData.forEach((course) => {
        course.students = course.students.map((e) =>
          e === student.email ? newEmail.trim().toLowerCase() : e
        );
      });
      student.email = newEmail.trim().toLowerCase();
    }

    // Validar y actualizar cursos
    if (data.courses !== undefined) {
      if (
        !Array.isArray(data.courses) ||
        data.courses.length === 0 ||
        data.courses.some((c) => typeof c !== "string" || c.trim() === "")
      ) {
        return res.status(400).json({
          status: 400,
          message: "Invalid courses format",
          data: null,
        });
      }
      if (hasDuplicateCourses(data.courses)) {
        return res.status(400).json({
          status: 400,
          message: "Duplicate courses are not allowed",
          data: null,
        });
      }
      const notExist = checkCoursesExist(data.courses, coursesData);
      if (notExist && notExist.length > 0) {
        return res.status(400).json({
          status: 400,
          message: `These courses do not exist: ${notExist.join(", ")}`,
          data: null,
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
      student.courses = data.courses.map((c) => c.trim());
      writeCourses(coursesData);
    }

    // Guardar cambios en estudiantes
    WriteData(students);

    return res.status(200).json({
      status: 200,
      message: "Student updated successfully",
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
};
