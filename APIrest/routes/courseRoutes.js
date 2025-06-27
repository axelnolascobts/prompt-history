const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// Crear un nuevo curso
router.post("/", courseController.createCourse);

// Obtener todos los cursos (resumen)
router.get("/", courseController.getAllCourses);

// Obtener información de un curso específico
router.get("/search", courseController.getCourse);

// Obtener estudiantes de un curso específico
router.get("/students", courseController.getCourseStudents);

// Eliminar un curso
router.delete("/", courseController.deleteCourse);

module.exports = router;