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

    const res = await request(app).get('/students')
    
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(fakeStudents);

    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /students/:id', () => {
  it('should respond with status 200 and return the data', async () => {
    const expectedStudent = {
      id: '86e8141a-07c4-42d2-bd71-0b7fb58d9976',
      name: 'Milto1',
      email: 'milton@gmail2.com',
      courses: ['matematicas1']
    };

    fs.readFileSync.mockReturnValue(JSON.stringify([expectedStudent]));

    const res = await request(app).get(`/students/${expectedStudent.id}`)

    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(expectedStudent);
  });

  it('should respond with status 404', async () => {

    const res = await request(app).get('/students/1');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Student not found');
  });
 });


describe('POST /students', () => {
  beforeEach(() => {
    
    fs.readFileSync.mockReturnValue('[]');
    fs.writeFileSync.mockClear();
  });

  it('should create a new student', async () => {
    const newStudent = {
      name: "Milton",
      email: "milton@gmail.com",
      courses: ["Math", "Science"]
    };

    const res = await request(app)
      .post('/students')
      .send(newStudent);

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      name: newStudent.name,
      email: newStudent.email,
      courses: newStudent.courses
    });

    expect(fs.writeFileSync).toHaveBeenCalled();
  });

    it('should respond with status 404', async () => {
    const InvalidStudent = {
      name: "Milton",
      email: "",
      courses: ["Math", "Science"]
    };

    const res = await request(app)
      .post('/students')
      .send(InvalidStudent);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid input');
  });
});

describe('DELETE /students/:id', () => {
   it('should respond with status 200 and delete the data', async () => {
    const expectedStudent = {
      id: '86e8141a-07c4-42d2-bd71-0b7fb58d9976',
      name: 'Milto1',
      email: 'milton@gmail2.com',
      courses: ['matematicas1']
    };

    fs.readFileSync.mockReturnValue(JSON.stringify([expectedStudent]));
    const res = await request(app).delete(`/students/${expectedStudent.id}`)

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Student deleted');
  });
});

describe('PUT /students/:id', () => {
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

  it('should update the student with new valid data', async () => {
    const updatedData = {
      name: 'Milton Updated',
      email: 'miltonupdated@gmail.com',
      courses: ['Science']
    };

    const res = await request(app)
      .put(`/students/${existingStudent.id}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.email).toBe(updatedData.email);
    expect(res.body.courses).toEqual(updatedData.courses);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should reject if data is invalid (empty name)', async () => {
    const res = await request(app)
      .put(`/students/${existingStudent.id}`)
      .send({
        name: '',
        email: 'valid@example.com',
        courses: ['Math']
      });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Invalid input');
        expect(res.body.errors).toBeDefined();

  });

  it('should reject if name has invalid characters', async () => {
    const res = await request(app)
      .put(`/students/${existingStudent.id}`)
      .send({
        name: '@@@',
        email: 'valid@example.com',
        courses: ['Math']
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Name contains invalid characters/);
  });

  it('should return 404 if student is not found', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));

    const res = await request(app)
      .put('/students/unknown-id')
      .send({
        name: 'New',
        email: 'new@email.com',
        courses: ['Math']
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Student not found');
  });

  it('should reject if courses are not valid strings', async () => {
    const res = await request(app)
      .put(`/students/${existingStudent.id}`)
      .send({
        name: 'Valid Name',
        email: 'valid@email.com',
        courses: ['']
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('All courses must be non-empty strings');
  });
});

describe('PATCH /students/:id', () => {
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

  it('should update only the name of the student', async () => {
    const res = await request(app)
      .patch(`/students/${existingStudent.id}`)
      .send({ name: 'Milton Patched' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Milton Patched');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should reject invalid name characters', async () => {
    const res = await request(app)
      .patch(`/students/${existingStudent.id}`)
      .send({ name: '###' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Name contains invalid characters/);
  });

  it('should reject empty email', async () => {
    const res = await request(app)
      .patch(`/students/${existingStudent.id}`)
      .send({ email: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email cannot be empty');
  });

  it('should reject duplicated email', async () => {
    const otherStudent = {
      id: '456',
      name: 'Another',
      email: 'duplicate@gmail.com',
      courses: ['Science']
    };

    fs.readFileSync.mockReturnValue(JSON.stringify([existingStudent, otherStudent]));

    const res = await request(app)
      .patch(`/students/${existingStudent.id}`)
      .send({ email: 'duplicate@gmail.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('This email is already registered');
  });

  it('should return 404 if student not found', async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));

    const res = await request(app)
      .patch('/students/nonexistent-id')
      .send({ name: 'No One' });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Student not found');
  });

  it('should reject invalid courses format', async () => {
    const res = await request(app)
      .patch(`/students/${existingStudent.id}`)
      .send({ courses: 'not-an-array' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Courses must be an array of strings');
  });

  it('should reject empty strings in courses array', async () => {
    const res = await request(app)
      .patch(`/students/${existingStudent.id}`)
      .send({ courses: [''] });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('All courses must be non-empty strings');
  });
});
