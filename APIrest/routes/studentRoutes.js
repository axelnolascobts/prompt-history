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


router.put("/email/:email", studentController.updateStudentByEmail);
router.patch("/email/:email", studentController.patchStudentByEmail);
router.delete("/email/:email", studentController.deleteStudentByEmail);


router.put("/name/:name", studentController.forbidOperationByName);
router.patch("/name/:name", studentController.forbidOperationByName);
router.delete("/name/:name", studentController.forbidOperationByName);

module.exports = router;