const { ReadData } = require("./utils");

exports.getStudents = (req, res) => {
  
  const students = ReadData();
  const { id, name, email, course } = req.query;

  // Validación especial para email vacío (debe devolver array vacío)
  if (email !== undefined && email.trim() === "") {
    return res.status(200).json({
      status: 200,
      message: "Students retrieved successfully",
      data: [],
    });
  }

  if (id !== undefined && id.trim() === "") {
    return res.status(200).json({
      status: 200,
      message: "Students retrieved successfully",
      data: [],
    });
  }

  if (name !== undefined && name.trim() === "") {
    return res.status(200).json({
      status: 200,
      message: "Students retrieved successfully",
      data: [],
    });
  }

  let filtered = [...students];

  if (id) {
    filtered = filtered.filter((s) => s.id === id);
  }
  if (name) {
    filtered = filtered.filter((s) =>
      s.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (email) {
    filtered = filtered.filter(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );
  }
  if (course) {
    filtered = filtered.filter((s) =>
      s.courses
        .map((c) => c.trim().toLowerCase())
        .includes(course.trim().toLowerCase())
    );
  }

  if (email) {
    if (filtered.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No students found with the given query",
        data: null,
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Student retrieved successfully",
      data: filtered[0],
    });
  }

  if (filtered.length === 0) {
    return res.status(404).json({
      status: 404,
      message: "No students found with the given query",
      data: [],
    });
  }

  return res.status(200).json({
    status: 200,
    message: "Students retrieved successfully",
    data: filtered,
  });
};
