const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// Obtener todos los cursos (resumen)
router.get("/", courseController.getAllCourses);

// Obtener información de un curso específico
router.get("/:name", courseController.getCourse);

// Crear un nuevo curso
router.post("/", courseController.createCourse);

// Agregar estudiante a un curso
router.post("/:name/student", courseController.addStudentToCourse);

// Eliminar estudiante de un curso
router.delete("/:name/student", courseController.removeStudentFromCourse);

// Eliminar un curso usando query param
router.delete("/", courseController.deleteCourse);

module.exports = router;
