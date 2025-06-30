const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// Obtener todos los cursos
router.get("/", courseController.getAllCourses);

// Crear un nuevo curso
router.post("/", courseController.createCourse);

// Eliminar un curso
router.delete("/", courseController.deleteCourse);

module.exports = router;
