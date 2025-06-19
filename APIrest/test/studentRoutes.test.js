const request = require('supertest');
const app = require('../app');
const fs = require('fs');

jest.mock('fs');

describe('GET /students', () => {
  it('should respond with status 200 and return an array', async () => {
    const fakeStudents = [
      { id: '1', name: 'Milton', email: 'milton@example.com', courses: ['Math'] }
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
