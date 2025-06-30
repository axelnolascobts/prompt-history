const {
  ReadData,
  WriteData,
  readCourses,
  writeCourses,
  checkCoursesExist,
  hasDuplicateCourses,
  validateStudent,
  emailRegex,
} = require("./utils");

const nameRegex = /^[\p{L} ]+$/u;

exports.updateStudent = (req, res) => {
  try {
    const students = ReadData();
    const coursesData = readCourses();
    const { id, email } = req.query;

    if (!id && !email) {
      return res.status(400).json({
        status: 400,
        message: "'id' or 'email' is required",
        data: null,
      });
    }

    let index = -1;
    if (id) index = students.findIndex((s) => s.id === id);
    else if (email)
      index = students.findIndex(
        (s) => s.email.toLowerCase() === email.toLowerCase()
      );

    if (index === -1) {
      return res
        .status(404)
        .json({ status: 404, message: "Student not found", data: null });
    }

    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Request body cannot be empty",
        data: null,
      });
    }

    const { name, email: bodyEmail, courses } = req.body;

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
    if (!bodyEmail || typeof bodyEmail !== "string" || bodyEmail.trim() === "") {
      return res.status(400).json({
        status: 400,
        message: "Email is required",
        data: null,
      });
    }
    if (!emailRegex.test(bodyEmail.trim())) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email format",
        data: null,
      });
    }

    // Validar courses
    if (
      !Array.isArray(courses) ||
      courses.length === 0 ||
      courses.some((c) => typeof c !== "string" || c.trim() === "")
    ) {
      return res.status(400).json({
        status: 400,
        message: "Courses must be a non-empty array of non-empty strings",
        data: null,
      });
    }

    // Ahora sí, validación general
    if (!validateStudent(req.body)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid body: check required fields and field names",
        data: null,
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = bodyEmail.trim().toLowerCase();
    const coursesInput = courses;

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
      !coursesInput.every((c) => typeof c === "string" && c.trim() !== "")
    ) {
      return res.status(400).json({
        status: 400,
        message: "Invalid courses format",
        data: null,
      });
    }

    if (!coursesInput.every((c) => /^[\p{L}\d .'-]+$/u.test(c.trim()))) {
      return res.status(400).json({
        status: 400,
        message: "Courses contain invalid characters",
        data: null,
      });
    }

    // Validar cursos duplicados
    if (hasDuplicateCourses(coursesInput)) {
      return res.status(400).json({
        status: 400,
        message: "Duplicate courses are not allowed",
        data: null,
      });
    }

    // Validar existencia de cursos
    const notExist = checkCoursesExist(coursesInput, coursesData);
    if (notExist && notExist.length > 0) {
      return res.status(400).json({
        status: 400,
        message: `These courses do not exist: ${notExist.join(", ")}`,
        data: null,
      });
    }

    // Validar email duplicado con otro estudiante
    const emailUsedByAnother = students.some(
      (s, i) => s.email.toLowerCase() === trimmedEmail && i !== index
    );
    if (emailUsedByAnother) {
      return res.status(409).json({
        status: 409,
        message: "Student with this email already exists",
        data: null,
      });
    }

    // Guardar email y cursos antiguos para sincronizar
    const oldEmail = students[index].email;
    const oldCourses = students[index].courses;

    // Actualizar estudiante
    const updatedStudent = {
      id: students[index].id,
      name: trimmedName,
      email: trimmedEmail,
      courses: coursesInput.map((c) => c.trim()),
    };
    students[index] = updatedStudent;

    WriteData(students);

    // Quitar email del estudiante de cursos antiguos no incluidos ahora
    oldCourses.forEach((cName) => {
      if (!updatedStudent.courses.includes(cName)) {
        const course = coursesData.find(
          (c) => c.name.toLowerCase() === cName.toLowerCase()
        );
        if (course) {
          course.students = course.students.filter((e) => e !== oldEmail);
        }
      }
    });

    // Añadir email del estudiante a cursos nuevos o existentes
    updatedStudent.courses.forEach((cName) => {
      const course = coursesData.find(
        (c) => c.name.toLowerCase() === cName.toLowerCase()
      );
      if (course && !course.students.includes(trimmedEmail)) {
        course.students.push(trimmedEmail);
      }
    });

    // Si cambió email, actualizarlo en todos los cursos donde estaba antes
    if (oldEmail !== trimmedEmail) {
      coursesData.forEach((course) => {
        course.students = course.students.map((e) =>
          e === oldEmail ? trimmedEmail : e
        );
      });
    }

    writeCourses(coursesData);

    res.status(200).json({
      status: 200,
      message: "Student edited successfully and courses updated",
      data: updatedStudent,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: err.message,
    });
  }
};
