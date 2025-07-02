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
    const res = await request(app).get('/courses').query({ name: 'Math' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Math');
  });

  it('should return 404 if course not found', async () => {
    const res = await request(app).get('/courses').query({ name: 'Unknown' });
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
    }, [], mockCourses)).toEqual({ valid: true });
  });

  it('should invalidate student with empty name', () => {
    expect(validateStudent({
      name: "",
      email: "milton@mail.com",
      courses: ["Math"]
    }, [], mockCourses)).toEqual({ valid: false, message: "name must NOT have fewer than 1 characters" });
  });

  it('should invalidate student with invalid email', () => {
    expect(validateStudent({
      name: "Milton",
      email: "miltonmail.com",
      courses: ["Math"]
    }, [], mockCourses)).toEqual({ valid: false, message: 'email must match format "email"' });
  });

  it('should invalidate student with empty courses', () => {
    expect(validateStudent({
      name: "Milton",
      email: "milton@mail.com",
      courses: []
    }, [], mockCourses)).toEqual({ valid: false, message: "courses must NOT have fewer than 1 items" });
  });
});

describe('Extra Course Edge Cases', () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReset();
    fs.writeFileSync.mockReset();
  });

  it('should reject POST /courses with missing name field', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const res = await request(app).post('/courses').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Course name is required');
  });

  it('should reject POST /courses with non-string name', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const res = await request(app).post('/courses').send({ name: 123 });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Course name is required');
  });

  it('should reject POST /courses with name only spaces', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const res = await request(app).post('/courses').send({ name: '   ' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Course name is required');
  });

  it('should reject DELETE /courses with missing name param', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const res = await request(app).delete('/courses');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Course name is required as query param/);
  });

  it('should reject DELETE /courses with invalid name', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const res = await request(app).delete('/courses').query({ name: 'Math@123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Course name contains invalid characters');
  });

  it('should reject POST /courses with invalid characters (unicode)', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const res = await request(app).post('/courses').send({ name: 'Curso💥' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Course name contains invalid characters');
  });
});

describe('POST /courses (array support & errors)', () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockCourses));
    fs.writeFileSync.mockReset();
  });

  it('should create multiple courses from array', async () => {
    const res = await request(app).post('/courses').send({ name: ['History', 'Geography'] });
    expect(res.statusCode).toBe(201);
    expect(res.body.created.length).toBe(2);
    expect(res.body.errors.length).toBe(0);
    expect(res.body.created.map(c => c.name)).toEqual(expect.arrayContaining(['History', 'Geography']));
  });

  it('should handle errors and successes in array', async () => {
    const res = await request(app).post('/courses').send({ name: ['Math', '', 'NewCourse'] });
    expect(res.statusCode).toBe(201);
    expect(res.body.created.length).toBe(1);
    expect(res.body.errors.length).toBe(2);
    expect(res.body.created[0].name).toBe('NewCourse');
    expect(res.body.errors.map(e => e.name)).toEqual(expect.arrayContaining(['Math', '']));
  });

  it('should reject POST /courses with query params', async () => {
    const res = await request(app).post('/courses?foo=bar').send({ name: 'Another' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Query parameters are not allowed/);
  });
});

describe('DELETE /courses (edge cases)', () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync
      .mockReturnValueOnce(JSON.stringify(mockCourses))
      .mockReturnValueOnce(JSON.stringify(mockStudents));
    fs.writeFileSync.mockReset();
  });

  it('should remove course from all students', async () => {
    const res = await request(app).delete('/courses').query({ name: 'Math' });
    expect(res.statusCode).toBe(200);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
  });

  it('should reject DELETE /courses with name only spaces', async () => {
    const res = await request(app).delete('/courses').query({ name: '   ' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Course name is required/);
  });

  it('should return 404 if course name is numeric and not found', async () => {
    const res = await request(app).delete('/courses').query({ name: 123 });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});

describe('GET /courses (edge cases)', () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReset();
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
  });

  it('should return 200 and empty array if no courses exist', async () => {
    const res = await request(app).get('/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it('should return 404 if searching for a course in empty list', async () => {
    fs.readFileSync.mockReset();
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const res = await request(app).get('/courses').query({ name: 'Math' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/);
  });
});