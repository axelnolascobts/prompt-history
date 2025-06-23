const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.get("/", studentController.getAllStudents);

router.get("/name/:name", studentController.getStudentByName);

router.get("/email/:email", studentController.getStudentByEmail);

router.get("/:id", studentController.getStudentsById);

router.post("/", studentController.createStudent);

router.put("/:id", studentController.updateStudent);

router.patch("/:id", studentController.patchStudent);

router.delete("/:id", studentController.deleteStudent);


module.exports = router;