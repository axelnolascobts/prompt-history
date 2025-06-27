const request = require('supertest');
const app = require('../app');
const fs = require('fs');

jest.mock('fs');

const fakeCourses = [
  { name: 'Math', students: [] },
  { name: 'Science', students: [] }
];

const fakeStudents = [
  { id: '1', name: 'Milton', email: 'milton@gmail.com', courses: ['Math'] }
];

beforeEach(() => {
  jest.clearAllMocks();
  fs.readFileSync.mockImplementation((filePath) => {
    if (filePath.includes('courses.json')) {
      return JSON.stringify(fakeCourses);
    }
    return JSON.stringify(fakeStudents);
  });
  fs.writeFileSync.mockClear();
});

describe('GET /students', () => {
  it('should respond with status 200 and return an array', async () => {
    const res = await request(app).get('/students');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual(fakeStudents);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should filter by id', async () => {
    const res = await request(app).get('/students').query({ id: '1' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].id).toBe('1');
  });

  it('should filter by name', async () => {
    const res = await request(app).get('/students').query({ name: 'Milton' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].name).toBe('Milton');
  });

  it('should filter by email', async () => {
    const res = await request(app).get('/students').query({ email: 'milton@gmail.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].email).toBe('milton@gmail.com');
  });

  it('should filter by course', async () => {
    const res = await request(app).get('/students').query({ course: 'Math' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].courses).toContain('Math');
  });

  it('should return 404 if no student matches', async () => {
    fs.readFileSync.mockReturnValueOnce(JSON.stringify([]));
    const res = await request(app).get('/students').query({ id: '999' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('No students found with the given query');
  });
});

describe('POST /students', () => {
  beforeEach(() => {
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('courses.json')) {
        return JSON.stringify(fakeCourses);
      }
      return JSON.stringify([]);
    });
    fs.writeFileSync.mockClear();
  });

  it('should create a new student with valid data', async () => {
    const newStudent = {
      name: "Milton",
      email: "milton2@gmail.com",
      courses: ["Math"]
    };
    const res = await request(app).post('/students').send(newStudent);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Student created successfully and courses updated');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should reject empty request body', async () => {
    const res = await request(app).post('/students').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Request body cannot be empty');
  });

  it('should reject duplicate email', async () => {
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('courses.json')) {
        return JSON.stringify(fakeCourses);
      }
      return JSON.stringify([
        { id: '1', name: 'Milton', email: 'milton@gmail.com', courses: ['Math'] }
      ]);
    });
    const newStudent = {
      name: "Milton",
      email: "milton@gmail.com",
      courses: ["Math"]
    };
    const res = await request(app).post('/students').send(newStudent);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('The email already exists');
  });

  it('should reject invalid course duplicates', async () => {
    const newStudent = {
      name: "Milton",
      email: "milton3@gmail.com",
      courses: ["Math", "Math"]
    };
    const res = await request(app).post('/students').send(newStudent);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Courses must not contain duplicates');
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
      email: "milton4@gmail.com",
      courses: [""]
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
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('courses.json')) {
        return JSON.stringify(fakeCourses);
      }
      return JSON.stringify([existingStudent]);
    });
    fs.writeFileSync.mockClear();
  });

  it('should update the student with valid data', async () => {
    const updated = { name: 'Milton Updated', email: 'milton@gmail.com', courses: ['Math'] };
    const res = await request(app).put('/students').query({ id: '123' }).send(updated);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Student edited successfully and courses updated');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should reject empty body', async () => {
    const res = await request(app).put('/students').query({ id: '123' }).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Request body cannot be empty');
  });

  it('should reject invalid name characters', async () => {
    const updated = { name: 'Milton123', email: 'milton@gmail.com', courses: ['Math'] };
    const res = await request(app).put('/students').query({ id: '123' }).send(updated);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Name contains invalid characters');
  });

  it('should reject duplicate email with another student', async () => {
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('courses.json')) {
        return JSON.stringify(fakeCourses);
      }
      return JSON.stringify([
        existingStudent,
        { id: '456', name: 'Other', email: 'other@mail.com', courses: ['Science'] }
      ]);
    });
    const updated = { name: 'Milton', email: 'other@mail.com', courses: ['Math'] };
    const res = await request(app).put('/students').query({ id: '123' }).send(updated);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('The email already exists');
  });

  it('should return 404 if student not found', async () => {
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('courses.json')) {
        return JSON.stringify(fakeCourses);
      }
      return JSON.stringify([]);
    });
    const updated = { name: 'Milton', email: 'milton@gmail.com', courses: ['Math'] };
    const res = await request(app).put('/students').query({ id: '999' }).send(updated);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Student not found');
  });

  it('should reject courses with duplicates', async () => {
    const updated = { name: 'Milton', email: 'milton@gmail.com', courses: ['Math', 'Math'] };
    const res = await request(app).put('/students').query({ id: '123' }).send(updated);
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
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('courses.json')) {
        return JSON.stringify(fakeCourses);
      }
      return JSON.stringify([existingStudent, { id: '456', name: 'Other', email: 'other@mail.com', courses: ['Science'] }]);
    });
    fs.writeFileSync.mockClear();
  });

  it('should update only name', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ name: 'Milton Patched' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Student updated successfully with course synchronization');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should update email and courses together', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ email: 'milton2@gmail.com', courses: ['Science'] });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Student updated successfully with course synchronization');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should reject invalid name', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ name: 'Milton123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Name contains invalid characters');
  });

  it('should reject empty email', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ email: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email cannot be empty');
  });

  it('should reject duplicate email', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ email: 'other@mail.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('This user is already registered');
  });

  it('should reject non-array courses', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ courses: 'Math' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Courses must be an array of strings');
  });

  it('should reject courses with empty string', async () => {
    const res = await request(app).patch('/students').query({ id: '123' }).send({ courses: [''] });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('All courses must be non-empty strings');
  });

  it('should return 404 if student not found', async () => {
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('courses.json')) {
        return JSON.stringify(fakeCourses);
      }
      return JSON.stringify([]);
    });
    const res = await request(app).patch('/students').query({ id: '999' }).send({ name: 'Nobody' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Student not found');
  });
});

describe('DELETE /students', () => {
  it('should delete a student if exists', async () => {
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('courses.json')) {
        return JSON.stringify([{ name: 'Math', students: ['milton@gmail.com'] }]);
      }
      return JSON.stringify([{ id: '123', name: 'Milton', email: 'milton@gmail.com', courses: ['Math'] }]);
    });
    fs.writeFileSync.mockClear();
    const res = await request(app).delete('/students').query({ id: '123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Student deleted successfully and courses updated');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should return 404 if student not found', async () => {
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('courses.json')) {
        return JSON.stringify(fakeCourses);
      }
      return JSON.stringify([]);
    });
    const res = await request(app).delete('/students').query({ id: '999' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Student not found');
  });
});

