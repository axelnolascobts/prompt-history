const { ReadData, WriteData, readCourses, writeCourses } = require("./utils");

exports.deleteStudent = (req, res) => {
  let students = ReadData();
  let courses = readCourses();
  const { id, email } = req.query;

  if (!id && !email) {
    return res.status(400).json({
      status: 400,
      message: "'id' or 'email' is required",
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