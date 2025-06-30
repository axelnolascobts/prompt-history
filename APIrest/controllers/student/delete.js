const { ReadData, WriteData } = require("./utils");

exports.deleteStudent = (req, res) => {
  const students = ReadData();
  const { id } = req.query;

  if (!id || typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({ message: "Student id is required" });
  }

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
};
