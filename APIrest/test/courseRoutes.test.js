jest.mock('fs'); // ¡Importante! Esto debe ir antes de cualquier otra importación

const fs = require('fs');
const request = require('supertest');
const app = require('../app');

describe('POST /courses', () => {
  it('should create a course', async () => {
    fs.readFileSync.mockReturnValue('[]');
    const res = await request(app).post('/courses').send({ course: 'Math' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(201);
    expect(res.body.data.course).toBe('Math');
  });

  it('should reject empty course', async () => {
    const res = await request(app).post('/courses').send({ course: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(400);
    expect(res.body.message).toMatch(/Course name is required/);
  });
});

describe('GET /courses?course=...', () => {
  it('should get students for a course', async () => {
    const students = [
      { id: '1', name: 'Milton', email: 'm1@mail.com', courses: ['Math'] },
      { id: '2', name: 'Ana', email: 'a@mail.com', courses: ['Math', 'Science'] }
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(students));
    const res = await request(app).get('/courses').query({ course: 'Math' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('should return 400 if course param missing', async () => {
    const res = await request(app).get('/courses');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(400);
    expect(res.body.message).toMatch(/Course query param is required/);
  });
});

describe('DELETE /courses?course=...', () => {
  it('should delete a course from all students', async () => {
    const students = [
      { id: '1', name: 'Milton', email: 'm1@mail.com', courses: ['Math', 'Science'] },
      { id: '2', name: 'Ana', email: 'a@mail.com', courses: ['Math'] }
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(students));
    fs.writeFileSync.mockClear();
    const res = await request(app).delete('/courses').query({ course: 'Math' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.data).toBe('Math');
    expect(res.body.message).toMatch(/Course deleted from all students/);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should return 404 if course not found', async () => {
    const students = [
      { id: '1', name: 'Milton', email: 'm1@mail.com', courses: ['Science'] }
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(students));
    const res = await request(app).delete('/courses').query({ course: 'Math' });
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe(404);
    expect(res.body.message).toMatch(/Course not found/);
  });
});
