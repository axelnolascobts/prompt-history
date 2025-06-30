const { ReadData, WriteData } = require("./utils");

exports.deleteStudent = (req, res) => {
  const { id, email } = req.query;
  if (!id && !email) {
    return res.status(400).json({
      status: 400,
      message: "'id' or 'email' is required",
      data: null,
    });
  }
  try {
    const students = ReadData();

    if (id) {
      const index = students.findIndex((s) => s.id === id);
      if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
      }

      const deleted = students.splice(index, 1)[0];
      WriteData(students);

      return res.status(200).json({
        status: 200,
        message: "Student deleted successfully and courses updated",
        data: deleted,
      });
    } else if (email) {
      const index = students.findIndex((s) => s.email === email);
      if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
      }

      const deleted = students.splice(index, 1)[0];
      WriteData(students);

      return res.status(200).json({
        status: 200,
        message: "Student deleted successfully and courses updated",
        data: deleted,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
};
