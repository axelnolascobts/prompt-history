jest.mock('fs');
const fs = require('fs');

const REQUEST = require('supertest');
const APP = require('../app.js');

describe("Some Endpoints from students REST API", () => {

    beforeEach(() => {

        fs.readFileSync.mockReturnValue(JSON.stringify({
            students: [
                {
                    "id": "78b2c235-21ce-4fc5-b53d-482a061e6a90",
                    "name": "holaaa",
                    "email": "a@hola.com",
                    "courses": []
                },
                {
                    "id": "fb5f899d-54a5-4ac6-8cc1-378e66afbd5d",
                    "name": "Benjamin",
                    "email": "benhja@hola.com",
                    "courses": ["biología"]
                },
                {
                    "id": "8e90aad9-1ebd-4308-8f73-62a89f58f142",
                    "name": "Dante",
                    "email": "dadada@hola.com",
                    "courses": ["historia", "matemáticas"]
                },
                {
                    "id": "2f9d2ea7-d403-4af7-9d90-41896646d368",
                    "name": "HOLO",
                    "email": "DANTE@hola.com",
                    "courses": ["historia", "matemáticas", "fisica", "materia"]
                }
            ],
            "courses": [
                {
                "course": "historia",
                "students": [
                    {
                    "id": "11fb92fb-3314-4306-811f-e92bc0e915ee",
                    "studentName": "Isaac Gallo"
                    }
                ]
                },
                {
                "course": "biologia",
                "students": [
                    {
                    "id": "11fb92fb-3314-4306-811f-e92bc0e915ee",
                    "studentName": "Isaac Gallo"
                    }
                ]
                },
                {
                "course": "arte",
                "students": [
                    {
                    "id": "11fb92fb-3314-4306-811f-e92bc0e915ee",
                    "studentName": "Isaac Gallo"
                    }
                ]
                }
            ]
        },
    ));

        fs.writeFileSync.mockImplementation(() => {});

    });

    afterEach(() => {

        jest.clearAllMocks();
    });

    test("GET /estudents should return an error message", async () => {

        const RESPONSE = await REQUEST(APP).get('/estudents');

        expect(RESPONSE.statusCode).toBe(404);
        expect(RESPONSE.body).toEqual(
            {
                "status": 404,
                "message": "Route not found"
            }
        )

    });

    test("GET /students should return students data list", async () => {

        const RESPONSE = await REQUEST(APP).get('/students');

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("GET /students/search?email=benhja@hola.com should return a student data", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/search?email=benhja@hola.com');

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("GET /students/search?id=fb5f899d-54a5-4ac6-8cc1-378e66afbd5d should return a student data", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/search?id=fb5f899d-54a5-4ac6-8cc1-378e66afbd5d');

        expect(RESPONSE.statusCode).toBe(200);
    }); 

    test("GET /students/search?name=Benjamin should return a student data", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/search?name=Benjamin');

        expect(RESPONSE.statusCode).toBe(200);
    }); 

    test("GET /students/:id should return a student data", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/fb5f899d-54a5-4ac6-8cc1-378e66afbd5d');

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("GET /students/:id/courses should return a student courses", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/fb5f899d-54a5-4ac6-8cc1-378e66afbd5d/courses');

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("GET /students/:id should return an error", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/fb5f899d-54a5-4ac6-8cc1-378e66aXbR5d');

        expect(RESPONSE.statusCode).toBe(404);
        expect(RESPONSE.body).toEqual(
            {
                "status": 404,
                "message": "Student not found or not exist"
            }
        );
    });

    test("POST /students should return a new student", async () => {

        const RESPONSE = await REQUEST(APP).post('/students')
        .send(
            {
                "name": "Pancho",
                "email": "pancho@hola.com",
                "courses": [
                    "biología"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(201);
    });

    test("POST /students should return error message", async () => {

        const RESPONSE = await REQUEST(APP).post('/students')
        .send(
            {
                "name": "",
                "email": "correo@error.com",
                "courses": [
                    "biología"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PUT /students/:searchParam should return edited student", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "name": "benjamin editado",
                "email": "correo@correo.com",
                "courses": [
                    "materiaxd"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("PUT /students/:id/courses should return edited courses list", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/fb5f899d-54a5-4ac6-8cc1-378e66afbd5d/courses')
        .send(
            {
                "courses": [
                    "materiaxd"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("PATCH /students/:searchParam should return edited student", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "name": "benjamin editado",
                "email": "correo@correo.com",
                "courses": [
                    "materiaxd"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("PATCH /students/:id/courses should return edited courses list", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/fb5f899d-54a5-4ac6-8cc1-378e66afbd5d/courses')
        .send(
            {
                "courses": [
                    "materiaxd", "materia2"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("PATCH /students/:searchParam should return an error from repited courses", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "name": "benjamin editado",
                "email": "correo@correo.com",
                "courses": [
                    "materiaxd",
                    "materiaxd"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /students/:searchParam should return an error for undefined params", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {

            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /students/:searchParam should return an error for invalid input format", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "name": "Constantino",
                "email": "aaa"
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PUT /students/:searchParam should return an error for not found student", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/78b2c235-21ce-4fc5-b53d-482a061e6aui')
        .send(
            {
                "name": "Constantino",
                "email": "aaa@hola.com",
                "courses": ["materia"]
            }
        );

        expect(RESPONSE.statusCode).toBe(404);
    });

    test("PUT /students/:searchParam should return an error for repeated courses", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "name": "Constantino",
                "email": "aaa@hola.com",
                "courses": ["materia","materia"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PUT /students/:searchParam should return an error for ocuped email", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "name": "Max",
                "email": "dadada@hola.com",
                "courses": ["materia"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("GET /students/:searchParam should return a list of students with same name", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/Benjamin');

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("GET /students/:searchParam should return a student with his/her email", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/benhja@hola.com');

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("GET /students/:searchParam should return an error for use an incorrect email", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/benhjAxda@hola.com');

        expect(RESPONSE.statusCode).toBe(404);
    });

    test("GET /students/:searchParam should return an error for use an incorrect ID", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/fb5f899d-54a5-4ac6-8cc1-378e66aftd5d');

        expect(RESPONSE.statusCode).toBe(404);
    });

    test("PUT /students/:searchParam should return an edited student", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/2f9d2ea7-d403-4af7-9d90-41896646d368')
        .send(
            {
                "name": "benja editado",
                "email": "cambiadocorreoa@hola.com",
                "courses": ["materia","otramateria","otramateria2","hola"]
            }
        );

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("PUT /students/:searchParam should return an error from repeated courses", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/fb5f899d-54a5-4ac6-8cc1-378e66afbd5d')
        .send(
            {
                "name": "AAAAA",
                "email": "gayutra@hola.com",
                "courses": [ "biología", "biología" ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("POST /students should return new student", async () => {

        const RESPONSE = await REQUEST(APP).post('/students')
        .send(
            {
                "name": "col",
                "email": "coayduaa@cureo.com",
                "courses": ["biología"]

            }
        );

        expect(RESPONSE.statusCode).toBe(201);
    });

    test("PATCH /students/:searchParam should return not found student", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/8e90aad9-1ebd-4308-8f73-62a89fadf142')
        .send(
            {
                "name": "col",
                "email": "coayduaa@cureo.com",
                "courses": ["biología"]

            }
        );

        expect(RESPONSE.statusCode).toBe(404);

    });

    test("PATCH /students/:searchParam should return for try to use an used email", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/8e90aad9-1ebd-4308-8f73-62a89f58f142')
        .send(
            {
                "name": "col",
                "email": "a@hola.com",
                "courses": "biología"

            }
        );

        expect(RESPONSE.statusCode).toBe(400);

    });

    test("PATCH /students/:searchParam should return error for use name by search param", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/Dante')
        .send(
            {
                "name": "Dante",
                "email": "dadada@hola.com",
                "courses": [
                    "historia",
                    "matemáticas"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);

    });

    test("PATCH /students/:searchParam should return error for send a empty name", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/Dante')
        .send(
            {
                "name": "   ",
                "email": "dadada@hola.com",
                "courses": [
                    "historia",
                    "matemáticas"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);

    });

    test("PUT /students/:searchParam should return error for send a empty name", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/Dante')
        .send(
            {
                "name": "   ",
                "email": "dadada@hola.com",
                "courses": [
                    "historia",
                    "matemáticas"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);

    });

    test("PUT /students/:searchParam should return error for send an incorrect input format", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/Dante')
        .send(
            {
                "name": "Dante",
                "email": "correomalo",
                "courses": [
                    "historia",
                    "matemáticas"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);

    });

    test("POST /students/:searchParam should return error for repeated courses", async () => {

        const RESPONSE = await REQUEST(APP).post('/students/')
        .send(
            {
                "name": "Dante",
                "email": "correoejemplo@correo.com",
                "courses": [
                    "historia",
                    "historia"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);

    });

    test("POST /students/:searchParam should return error for try to usea an ocuped email", async () => {

        const RESPONSE = await REQUEST(APP).post('/students/')
        .send(
            {
                "name": "Dante",
                "email": "benhja@hola.com",
                "courses": [
                    "historia",
                    "materia"
                ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);

    });

    test("POST /students/:searchParam should return error for use incorrect input format", async () => {

        const RESPONSE = await REQUEST(APP).post('/students/')
        .send(
            {
                "name": 8,
                "email": "correomalo",
                "courses": [ 23 ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("GET /students/:searchParam should return an error for undefined param", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/search?=benhja@hola.com');

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PUT /students/:searchParam should return an error for use name to edit student", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/search?name=benjamin');

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /students/:searchParam should return an error for repeated courses", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "courses": [ "curso", "curso" ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PUT /students/:id/courses should return an error for repeated courses", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90/courses')
        .send(
            {
                "courses": [ "curso", "curso" ]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PUT /students/:id/courses should return an error for student not found", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/78b2c235-21ce-4fc5-b53d-482a061e6d90/courses')
        .send(
            {
                "courses": [ "curso", "curso" ]
            }
        );

        expect(RESPONSE.statusCode).toBe(404);
    });

    test("PUT /students/:id/courses should return an error for invalid format", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90/courses')
        .send(
            {
                "courses": 33
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /students/:id/courses should return an error for repeated courses", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90/courses')
        .send(
            {
                "courses": ["course","course"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /students/:id/courses should return an error for student not fount", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/78b2c235-21ce-4fc5-b53d-482a061e6x90/courses')
        .send(
            {
                "courses": ["course","course"]
            }
        );

        expect(RESPONSE.statusCode).toBe(404);
    });

    test("PATCH /students/:id/courses should return an error for invalid format", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90/courses')
        .send(
            {
                "courses": "course"
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /students/:id should return an error for repeated email", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "email": "dadada@hola.com"
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /students/:id should return an error for repeated email", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "name": "    "
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /students/:id should return an error for repeated email", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "courses": ["uno", "uno"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });
    
    test("GET /students/:id/courses should return an error for student not found", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/78b2c235-21ce-4fc5-b53d-482a061e6x90/courses');

        expect(RESPONSE.statusCode).toBe(404);
    });

    test("GET /courses/ should return every courses", async () => {

        const RESPONSE = await REQUEST(APP).get('/courses/');

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("GET /courses/:name should return one courses", async () => {

        const RESPONSE = await REQUEST(APP).get('/courses/arte');

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("GET /courses/:name should return an error for not found course", async () => {

        const RESPONSE = await REQUEST(APP).get('/courses/geografia');

        expect(RESPONSE.statusCode).toBe(404);
    });

    test("POST /courses/ should return new course", async () => {

        const RESPONSE = await REQUEST(APP).post('/courses/')
        .send(
            {
            "course": "geografia",
            "students": ["78b2c235-21ce-4fc5-b53d-482a061e6a90","fb5f899d-54a5-4ac6-8cc1-378e66afbd5d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(201);
    });

    test("POST /courses/ should return error for repeated students", async () => {

        const RESPONSE = await REQUEST(APP).post('/courses/')
        .send(
            {
            "course": "geografia",
            "students": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd5d","fb5f899d-54a5-4ac6-8cc1-378e66afbd5d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("POST /courses/ should return error for not found students", async () => {

        const RESPONSE = await REQUEST(APP).post('/courses/')
        .send(
            {
            "course": "geografia",
            "students": ["hola"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("POST /courses/ should return error for invalid input format", async () => {

        const RESPONSE = await REQUEST(APP).post('/courses/')
        .send(
            {
            "name": "geografia",
            "a": ["hola"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("POST /courses/ should return error for repeted course name", async () => {

        const RESPONSE = await REQUEST(APP).post('/courses/')
        .send(
            {
            "course": "arte",
            "students": ["hola"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("POST /courses/ should return error for empty course name", async () => {

        const RESPONSE = await REQUEST(APP).post('/courses/')
        .send(
            {
            "course": "   ",
            "students": ["hola"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("POST /courses/ should return new course", async () => {

        const RESPONSE = await REQUEST(APP).post('/courses/')
        .send(
            {
            "course": "materia",
            "students": []
            }
        );

        expect(RESPONSE.statusCode).toBe(201);
    });

    test("POST /courses/ should return an error for not found student in course", async () => {

        const RESPONSE = await REQUEST(APP).post('/courses/')
        .send(
            {
            "course": "geografia",
            "students": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd8d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /courses/:name should return edited course", async () => {

        const RESPONSE = await REQUEST(APP).patch('/courses/arte')
        .send(
            {
            "course": "arte",
            "students": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd5d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("PATCH /courses/:name should return an error for invalid input format", async () => {

        const RESPONSE = await REQUEST(APP).patch('/courses/arte')
        .send(
            {
            "name": "arte",
            "estudns": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd5d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /courses/:name should return an error for course not found", async () => {

        const RESPONSE = await REQUEST(APP).patch('/courses/locologia')
        .send(
            {
            "course": "locologia",
            "students": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd8d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(404);
    });

    test("PATCH /courses/:name should return an error for course not found", async () => {

        const RESPONSE = await REQUEST(APP).patch('/courses/arte')
        .send(
            {
            "course": "ecologia",
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /courses/:name should return an error for course not found", async () => {

        const RESPONSE = await REQUEST(APP).patch('/courses/arte')
        .send(
            {
            "course": "arte",
            "students": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd8d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PATCH /courses/:name should return an error for course not found", async () => {

        const RESPONSE = await REQUEST(APP).patch('/courses/arte')
        .send(
            {
            "students": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd5d","fb5f899d-54a5-4ac6-8cc1-378e66afbd5d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PUT /courses/:name should return an edited course", async () => {

        const RESPONSE = await REQUEST(APP).put('/courses/arte')
        .send(
            {
            "course": "arte",
            "students": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd5d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(200);
    });

    test("PUT /courses/:name should return an error for invalid input format", async () => {

        const RESPONSE = await REQUEST(APP).put('/courses/arte')
        .send(
            {
            "coursess": "arte",
            "studentsaa": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd5d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PUT /courses/:name should return an error for not found course", async () => {

        const RESPONSE = await REQUEST(APP).put('/courses/astrologia')
        .send(
            {
            "course": "arte",
            "students": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd5d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(404);
    });

    test("PUT /courses/:name should return an error for try change course name", async () => {

        const RESPONSE = await REQUEST(APP).put('/courses/arte')
        .send(
            {
            "course": "artesss",
            "students": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd5d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PUT /courses/:name should return an error for repeated students", async () => {

        const RESPONSE = await REQUEST(APP).put('/courses/arte')
        .send(
            {
            "course": "arte",
            "students": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd5d","fb5f899d-54a5-4ac6-8cc1-378e66afbd5d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PUT /courses/:name should return an error for not found students", async () => {

        const RESPONSE = await REQUEST(APP).put('/courses/arte')
        .send(
            {
            "course": "arte",
            "students": ["fb5f899d-54a5-4ac6-8cc1-378e66afbd8d"]
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("DELETE /courses/:name should return an ok for deleted course", async () => {

        const RESPONSE = await REQUEST(APP).delete('/courses/arte');

        expect(RESPONSE.statusCode).toBe(204);
    });

    test("DELETE /courses/:name should return an error for not found course", async () => {

        const RESPONSE = await REQUEST(APP).delete('/courses/enchiladas3');

        expect(RESPONSE.statusCode).toBe(404);
    });

    test("DELETE /students/:searchParam should return an error for use name", async () => {

        const RESPONSE = await REQUEST(APP).delete('/students/holaa');

        expect(RESPONSE.statusCode).toBe(404);

    });

    test("DELETE /students/:id/courses should return an error for student not found", async () => {

        const RESPONSE = await REQUEST(APP).delete('/students/8e90aad9-1ebd-4308-8f73-62a89f58fds2/courses');

        expect(RESPONSE.statusCode).toBe(404);

    });

    test("DELETE /students/:searchParam should delete specific student", async () => {

        const RESPONSE = await REQUEST(APP).delete('/students/8e90aad9-1ebd-4308-8f73-62a89f58f142');

        expect(RESPONSE.statusCode).toBe(204);

    });

    test("DELETE /students/:searchParam should return not found studentnt for incorrect id", async () => {

        const RESPONSE = await REQUEST(APP).delete('/students/8e90aad9-1ebd-4308-8f73-62a89fadf142');

        expect(RESPONSE.statusCode).toBe(404);

    });

    test("DELETE /students/:searchParam should delete specific student", async () => {

        const RESPONSE = await REQUEST(APP).delete('/students/correo@correo.com');

        expect(RESPONSE.statusCode).toBe(404);

    });

    test("DELETE /students/:id/courses should return a deleted response", async () => {

        const RESPONSE = await REQUEST(APP).delete('/students/fb5f899d-54a5-4ac6-8cc1-378e66afbd5d/courses')

        expect(RESPONSE.statusCode).toBe(200);
    });
    
});