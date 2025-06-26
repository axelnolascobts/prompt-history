const request = require('supertest');
const app = require('../app');
const fs = require('fs');

jest.mock('fs');

describe('GET /students', () => {
  it('should respond with status 200 and return an array', async () => {
    const fakeStudents = [
      { id: '1', name: 'Milton', email: 'milton@gmail.com', courses: ['Math'] }
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(fakeStudents));
    const res = await request(app).get('/students');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual(fakeStudents);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should filter by id', async () => {
    const fakeStudents = [
      { id: '1', name: 'Milton', email: 'milton@gmail.com', courses: ['Math'] }
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(fakeStudents));
    const res = await request(app).get('/students').query({ id: '1' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].id).toBe('1');
  });

  it('should filter by name', async () => {
    const fakeStudents = [
      { id: '1', name: 'Milton', email: 'milton@gmail.com', courses: ['Math'] },
      { id: '2', name: 'Ana', email: 'ana@gmail.com', courses: ['Science'] }
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(fakeStudents));
    const res = await request(app).get('/students').query({ name: 'mil' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].name).toBe('Milton');
  });

  it('should filter by email', async () => {
    const fakeStudents = [
      { id: '1', name: 'Milton', email: 'milton@gmail.com', courses: ['Math'] }
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(fakeStudents));
    const res = await request(app).get('/students').query({ email: 'milton@gmail.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].email).toBe('milton@gmail.com');
  });

  it('should filter by course', async () => {
    const fakeStudents = [
      { id: '1', name: 'Milton', email: 'milton@gmail.com', courses: ['Math'] },
      { id: '2', name: 'Ana', email: 'ana@gmail.com', courses: ['Science', 'Math'] }
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(fakeStudents));
    const res = await request(app).get('/students').query({ course: 'Math' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('should return 404 if no student matches', async () => {
    fs.readFileSync.mockReturnValue('[]');
    const res = await request(app).get('/students').query({ name: 'nobody' });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});

describe('POST /students', () => {
  beforeEach(() => {
    fs.readFileSync.mockReturnValue('[]');
    fs.writeFileSync.mockClear();
  });

  it('should create a new student with valid data', async () => {
    const newStudent = {
      name: "Milton",
      email: "milton@gmail.com",
      courses: ["Math", "Science"]
    };
    const res = await request(app).post('/students').send(newStudent);
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toMatchObject(newStudent);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should reject empty request body', async () => {
    const res = await request(app).post('/students').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Request body cannot be empty');
  });

  it('should reject duplicate email', async () => {
    const existingStudent = { id: '1', name: "Exists", email: "milton@gmail.com", courses: ["Math"] };
    fs.readFileSync.mockReturnValue(JSON.stringify([existingStudent]));
    const newStudent = {
      name: "Milton",
      email: "milton@gmail.com",
      courses: ["Science"]
    };
    const res = await request(app).post('/students').send(newStudent);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'The email already exists');
  });

  it('should reject invalid course duplicates', async () => {
    const newStudent = {
      name: "Milton",
      email: "milton@gmail.com",
      courses: ["Math", "math"]
    };
    const res = await request(app).post('/students').send(newStudent);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Courses must not contain duplicates');
  });

  it('should reject invalid email format', async () => {
    const newStudent = {
      name: "Milton",
      email: "invalid-email",
      courses: ["Math"]
    };
    const res = await request(app).post('/students').send(newStudent);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid input');
  });

  it('should reject empty or invalid course strings', async () => {
    const newStudent = {
      name: "Milton",
      email: "milton@gmail.com",
      courses: ["", "Science"]
    };
    const res = await request(app).post('/students').send(newStudent);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('All courses must be non-empty strings');
  });
});

describe('PUT /students', () => {
  const existingStudent = {
    id: '123',
    name: 'Milton',
    email: 'milton@gmail.com',
    courses: ['Math']
  };

  beforeEach(() => {
    fs.readFileSync.mockReturnValue(JSON.stringify([existingStudent]));
    fs.writeFileSync.mockClear();
  });

  it('should update the student with valid data', async () => {
    const updatedData = {
      name: 'Milton Updated',
      email: 'miltonupdated@gmail.com',
      courses: ['Science']
    };
    const res = await request(app).put('/students').query({ id: '123' }).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe(updatedData.name);
    expect(res.body.data.email).toBe(updatedData.email);
    expect(res.body.data.courses).toEqual(updatedData.courses);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should reject empty body', async () => {
    const res = await request(app).put('/students').query({ id: '123' }).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Request body cannot be empty');
  });

  it('should reject invalid name characters', async () => {
    const res = await request(app).put('/students').query({ id: '123' }).send({
      name: '@@@',
      email: 'valid@example.com',
      courses: ['Math']
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Name contains invalid characters/);
  });

  it('should reject duplicate email with another student', async () => {
    const otherStudent = {
      id: '999',
      name: 'Other',
      email: 'dup@gmail.com',
      courses: ['Science']
    };
    fs.readFileSync.mockReturnValue(JSON.stringify([existingStudent, otherStudent]));

    const res = await request(app).put('/students').query({ id: '123' }).send({
      name: 'New Name',
      email: 'dup@gmail.com',
      courses: ['Math']
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('The email already exists');
  });

  it('should return 404 if student not found', async () => {
    fs.readFileSync.mockReturnValue('[]');
    const res = await request(app).put('/students').query({ id: 'notfound' }).send({
      name: 'New Name',
      email: 'new@mail.com',
      courses: ['Math']
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Student not found');
  });

  it('should reject courses with duplicates', async () => {
    const res = await request(app).put('/students').query({ id: '123' }).send({
      name: 'Valid Name',
      email: 'valid@email.com',
      courses: ['Math', 'math']
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Courses must not contain duplicates');
  });
});

describe('PATCH /students', () => {
  const existingStudent = {
    id: '123',
    name: 'Milton',
    email: 'milton@gmail.com',
    courses: ['Math']
  };

  beforeEach(() => {
    fs.readFileSync.mockReturnValue(JSON.stringify([existingStudent]));
    fs.writeFileSync.mockClear();
  });

  it('should update only name', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ name: 'Patched Name' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Patched Name');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should update email and courses together', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({
      email: 'newemail@mail.com',
      courses: ['Science']
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe('newemail@mail.com');
    expect(res.body.data.courses).toEqual(['Science']);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should reject invalid name', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ name: '###' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Name contains invalid characters/);
  });

  it('should reject empty email', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ email: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email cannot be empty');
  });

  it('should reject duplicate email', async () => {
    const otherStudent = {
      id: '456',
      name: 'Another',
      email: 'duplicate@mail.com',
      courses: ['Science']
    };
    fs.readFileSync.mockReturnValue(JSON.stringify([existingStudent, otherStudent]));
    const res = await request(app).patch('/students').query({ id: '123' }).send({ email: 'duplicate@mail.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('This email is already registered');
  });

  it('should reject non-array courses', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ courses: 'not-an-array' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Courses must be an array of strings');
  });

  it('should reject courses with empty string', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ courses: [''] });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('All courses must be non-empty strings');
  });

  it('should return 404 if student not found', async () => {
    fs.readFileSync.mockReturnValue('[]');
    const res = await request(app).patch('/students').query({ id: 'notfound' }).send({ name: 'No One' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Student not found');
  });
});

describe('DELETE /students', () => {
  it('should delete a student if exists', async () => {
    const student = {
      id: 'delete-123',
      name: 'ToDelete',
      email: 'delete@mail.com',
      courses: ['Math']
    };
    fs.readFileSync.mockReturnValue(JSON.stringify([student]));
    fs.writeFileSync.mockClear();
    const res = await request(app).delete('/students').query({ id: 'delete-123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Student deleted');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should return 404 if student not found', async () => {
    fs.readFileSync.mockReturnValue('[]');
    const res = await request(app).delete('/students').query({ id: 'notfound' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Student not found');
  });
});

// Opcional: pruebas para /students/by-course y /students/course si tienes esos endpoints
describe('GET /students/by-course', () => {
  it('should get students by course', async () => {
    const students = [
      { id: '1', name: 'Milton', email: 'm1@mail.com', courses: ['Math'] },
      { id: '2', name: 'Ana', email: 'a@mail.com', courses: ['Math', 'Science'] }
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(students));
    const res = await request(app).get('/students/by-course').query({ course: 'Math' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
  });
});

describe('DELETE /students/course', () => {
  it('should delete a course from all students', async () => {
    const students = [
      { id: '1', name: 'Milton', email: 'm1@mail.com', courses: ['Math', 'Science'] },
      { id: '2', name: 'Ana', email: 'a@mail.com', courses: ['Math'] }
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(students));
    fs.writeFileSync.mockClear();
    const res = await request(app).delete('/students/course').query({ course: 'Math' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBe('Math');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});
