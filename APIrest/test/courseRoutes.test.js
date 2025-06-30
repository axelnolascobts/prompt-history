jest.mock('fs');
const fs = require('fs');
const request = require('supertest');
const app = require('../app');
const { validateStudent } = require("../controllers/student/utils");

const mockCourses = [
  { name: 'Math', students: ['milton@gmail.com', 'ana@gmail.com'] },
  { name: 'Science', students: ['ana@gmail.com'] }
];

const mockStudents = [
  { id: "123", name: "Milton", email: "milton@gmail.com", courses: ["Math"] },
  { id: "456", name: "Ana", email: "ana@gmail.com", courses: ["Math", "Science"] }
];

describe('POST /courses', () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockCourses));
  });

  it('should create a course', async () => {
    const res = await request(app).post('/courses').send({ name: 'History' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(201);
    expect(res.body.message).toBe('Course created successfully');
    expect(res.body.data.name).toBe('History');
  });

  it('should reject duplicate course', async () => {
    const res = await request(app).post('/courses').send({ name: 'Math' });
    expect(res.statusCode).toBe(409);
    expect(res.body.status).toBe(409);
    expect(res.body.message).toBe('Course already exists');
  });

  it('should reject empty name', async () => {
    const res = await request(app).post('/courses').send({ name: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Course name is required');
  });

  it('should reject invalid name', async () => {
    const res = await request(app).post('/courses').send({ name: 'Math@123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Course name contains invalid characters');
  });
});

describe('GET /courses', () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockCourses));
  });

  it('should get all courses', async () => {
    const res = await request(app).get('/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get a course by name', async () => {
    const res = await request(app).get('/courses/Math');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Math');
  });

  it('should return 404 if course not found', async () => {
    const res = await request(app).get('/courses/Unknown');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Course 'Unknown' not found");
  });
});

describe('DELETE /courses', () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync
      .mockReturnValueOnce(JSON.stringify(mockCourses))
      .mockReturnValueOnce(JSON.stringify(mockStudents));
  });

  it('should delete a course from system and all students', async () => {
    const res = await request(app).delete('/courses').query({ name: 'Math' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.data.name).toBe('Math');
  });

  it('should return 404 if course not found', async () => {
    const res = await request(app).delete('/courses').query({ name: 'Unknown' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Course 'Unknown' not found");
  });
});

describe('API Basic Routes', () => {
  // Prueba para la ruta raíz
  describe('GET /', () => {
    it('should return "The api is running"', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('The api is running');
    });
  });

  // Prueba para rutas no encontradas
  describe('Non-existent routes', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 404,
        message: "Route not found",
        data: []
      });
    });

    it('should return 404 for different HTTP methods on non-existent routes', async () => {
      const methods = ['post', 'put', 'patch', 'delete'];
      
      for (const method of methods) {
        const response = await request(app)[method]('/non-existent-route');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          status: 404,
          message: "Route not found",
          data: []
        });
      }
    });
  });
});

describe('Student Validation', () => {
  it('should validate student data', () => {
    expect(validateStudent({
      name: "Milton",
      email: "milton@mail.com",
      courses: ["Math"]
    })).toBe(true);
  });

  it('should invalidate student with empty name', () => {
    expect(validateStudent({
      name: "",
      email: "milton@mail.com",
      courses: ["Math"]
    })).toBe(false);
  });

  it('should invalidate student with invalid email', () => {
    expect(validateStudent({
      name: "Milton",
      email: "miltonmail.com",
      courses: ["Math"]
    })).toBe(false);
  });

  it('should invalidate student with empty courses', () => {
    expect(validateStudent({
      name: "Milton",
      email: "milton@mail.com",
      courses: []
    })).toBe(false);
  });
});