const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Todas las búsquedas y filtros por query params
router.get("/", studentController.getStudents);

// Crear estudiante
router.post("/", studentController.createStudent);

// Actualizar estudiante por id o email (query param)
router.put("/", studentController.updateStudent);
router.patch("/", studentController.patchStudent);

// Eliminar estudiante por id o email (query param)
router.delete("/", studentController.deleteStudent);

// Obtener estudiantes de un curso
router.get("/by-course", studentController.getStudentsByCourse);

// Eliminar un curso de todos los estudiantes
router.delete("/course", studentController.deleteCourseFromAllStudents);

module.exports = router;