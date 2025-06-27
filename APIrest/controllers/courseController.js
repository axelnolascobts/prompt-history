const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const ajv = new Ajv();

// Configuración de paths
const DATA_DIR = path.join(__dirname, '../data');
const COURSE_PATH = path.join(DATA_DIR, 'courses.json');
const STUDENT_DB_PATH = path.join(DATA_DIR, 'db.json');

// Esquemas de validación (se mantienen igual)
const courseSchemas = {
  create: {
    type: 'object',
    properties: {
      course: { 
        type: 'string',
        pattern: '^[\\p{L}\\d .\'-]+$',
        minLength: 2
      }
    },
    required: ['course'],
    additionalProperties: false
  },
  get: {
    type: 'object',
    properties: {
      name: { 
        type: 'string',
        minLength: 1
      }
    },
    required: ['name'],
    additionalProperties: false
  }
};

// Compilar esquemas
const validateCreateCourse = ajv.compile(courseSchemas.create);
const validateGetCourse = ajv.compile(courseSchemas.get);

// Asegurar que exista el directorio data
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Funciones de utilidad mejoradas
const readData = (filePath, defaultData) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading ${filePath}: ${error.message}`);
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Error writing to ${filePath}: ${error.message}`);
  }
};

// Controlador deleteCourse mejorado
const deleteCourse = (req, res) => {
  if (!validateGetCourse(req.query)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid parameters',
      errors: validateGetCourse.errors
    });
  }

  try {
    const { name } = req.query;
    const normalizedName = name.trim().toLowerCase();
    
    // 1. Leer y actualizar courses.json
    const courses = readData(COURSE_PATH, []);
    const courseIndex = courses.findIndex(c => c.name.toLowerCase() === normalizedName);

    if (courseIndex === -1) {
      return res.status(404).json({
        status: 404,
        message: 'Course not found in courses.json'
      });
    }

    // Eliminar el curso
    const deletedCourse = courses.splice(courseIndex, 1)[0];
    writeData(COURSE_PATH, courses);

    // 2. Actualizar estudiantes en db.json
    const studentsData = readData(STUDENT_DB_PATH, []);
    let studentsUpdated = 0;

    // Verificar que studentsData es un array (según tu estructura)
    if (!Array.isArray(studentsData)) {
      throw new Error('Invalid student data structure in db.json');
    }

    // Eliminar el curso de cada estudiante
    const updatedStudents = studentsData.map(student => {
      if (student.courses && Array.isArray(student.courses)) {
        const originalLength = student.courses.length;
        student.courses = student.courses.filter(c => c.toLowerCase() !== normalizedName);
        if (student.courses.length !== originalLength) {
          studentsUpdated++;
        }
      }
      return student;
    });

    writeData(STUDENT_DB_PATH, updatedStudents);

    return res.status(200).json({
      status: 200,
      message: 'Course deleted successfully',
      data: {
        course: deletedCourse.name,
        studentsAffected: studentsUpdated
      }
    });

  } catch (error) {
    console.error('Delete course error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Error deleting course',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Exportar todos los controladores (manteniendo los originales)
module.exports = {
  createCourse: (req, res) => {
    // ... (mantener implementación original)
  },

  getAllCourses: (req, res) => {
    // ... (mantener implementación original)
  },

  getCourse: (req, res) => {
    // ... (mantener implementación original)
  },

  getCourseStudents: (req, res) => {
    // ... (mantener implementación original)
  },

  deleteCourse // Usar la nueva implementación mejorada
};