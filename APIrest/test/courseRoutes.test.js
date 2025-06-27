jest.mock('fs');
const fs = require('fs');
const request = require('supertest');
const app = require('../app');

const mockCourses = [{ name: 'math', students: [] }, { name: 'science', students: [] }];
const mockStudents = [
  { id: '1', name: 'Milton', email: 'm1@mail.com', courses: ['math', 'science'] },
  { id: '2', name: 'Ana', email: 'a@mail.com', courses: ['math'] }
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /courses', () => {
  it('should create a course', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockCourses));
    const res = await request(app).post('/courses').send({ course: 'History' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(201);
    expect(res.body.message).toBe('Course created successfully');
    expect(res.body.data.course).toBe('history');
  });

  it('should reject empty course', async () => {
    const res = await request(app).post('/courses').send({ course: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe('Course name is required');
  });

  it('should reject duplicate course', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockCourses));
    const res = await request(app).post('/courses').send({ course: 'Math' });
    expect(res.statusCode).toBe(409);
    expect(res.body.status).toBe(409);
    expect(res.body.message).toBe('Course already exists');
  });
});

describe('GET /courses?course=...', () => {
  it('should get students for a course', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync
      .mockReturnValueOnce(JSON.stringify(mockCourses))
      .mockReturnValueOnce(JSON.stringify(mockStudents)); 
    
    const res = await request(app).get('/courses').query({ course: 'math' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.message).toBe("Students retrieved for course 'math'");
    expect(res.body.data.length).toBe(2);
  });

  it('should return 400 if course param missing', async () => {
    const res = await request(app).get('/courses');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe('Course param is required');
  });

  it('should return 404 if course not found', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify([{ name: 'science', students: [] }]));
    const res = await request(app).get('/courses').query({ course: 'math' });
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(404);
    expect(res.body.message).toBe("Course 'math' does not exist");
  });
});

describe('DELETE /courses?course=...', () => {
  it('should delete a course from system and all students', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync
      .mockReturnValueOnce(JSON.stringify(mockCourses))
      .mockReturnValueOnce(JSON.stringify(mockStudents)); 
    
    const res = await request(app).delete('/courses').query({ course: 'math' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.message).toBe("Course 'math' deleted from system and all students");
    expect(res.body.data).toBe('math');
  });

  it('should return 404 if course not found', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify([{ name: 'science', students: [] }]));
    const res = await request(app).delete('/courses').query({ course: 'math' });
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(404);
    expect(res.body.message).toBe("Course 'math' not found");
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