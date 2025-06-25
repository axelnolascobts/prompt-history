const REQUEST = require('supertest');
const APP = require('../app.js');

jest.mock('fs');
const fs = require('fs');

describe("Some Endpoints from students REST API", () => {

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
        expect(RESPONSE.body).toEqual(
            [
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
                    "courses": [
                    "biología"
                    ]
                },
                {
                    "id": "8e90aad9-1ebd-4308-8f73-62a89f58f142",
                    "name": "Dante",
                    "email": "dadada@hola.com",
                    "courses": [
                    "historia",
                    "matemáticas"
                    ]
                },
                {
                    "id": "2f9d2ea7-d403-4af7-9d90-41896646d368",
                    "name": "HOLO",
                    "email": "DANTE@hola.com",
                    "courses": [
                    "historia",
                    "matemáticas",
                    "fisica",
                    "materia"
                    ]
                }
            ]
        );
    });

    test("GET /students/:id should return a student data", async () => {

        const RESPONSE = await REQUEST(APP).get('/students/fb5f899d-54a5-4ac6-8cc1-378e66afbd5d');

        expect(RESPONSE.statusCode).toBe(200);
        expect(RESPONSE.body).toEqual(
            {
                "status": 200,
                "data": {
                    "id": "fb5f899d-54a5-4ac6-8cc1-378e66afbd5d",
                    "name": "Benjamin",
                    "email": "benhja@hola.com",
                    "courses": [
                        "biología"
                    ]
                }
            }
        );
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

    beforeEach(() => {

        fs.readFileSync.mockReturnValue(JSON.stringify(
            [
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
                    "courses": [
                    "biología"
                    ]
                },
                {
                    "id": "8e90aad9-1ebd-4308-8f73-62a89f58f142",
                    "name": "Dante",
                    "email": "dadada@hola.com",
                    "courses": [
                    "historia",
                    "matemáticas"
                    ]
                },
                {
                    "id": "2f9d2ea7-d403-4af7-9d90-41896646d368",
                    "name": "HOLO",
                    "email": "DANTE@hola.com",
                    "courses": [
                    "historia",
                    "matemáticas",
                    "fisica",
                    "materia"
                    ]
                }
            ]
        ));

        fs.writeFileSync.mockImplementation(() => {});

    });

    afterEach(() => {

        jest.clearAllMocks();
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
        // expect(RESPONSE.body).toEqual(
        //     {
        //         "status": 201,
        //         "data": {
        //             "id": "4fd81bc4-6389-42a0-bc63-eaae6ff1afa5",
        //             "name": "Pancho",
        //             "email": "pancho@hola.com",
        //             "courses": [
        //                 "biología"
        //             ]
        //         }
        //     }
        // );
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
        expect(RESPONSE.body).toEqual(
            {
                "status": 400,
                "message": "Name is required and obligatory data, plis fill it",
            }
        );
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

        const RESPONSE = await REQUEST(APP).put('/students/b5f899d-afbd5d')
        .send(
            {
                "name": "Constantino",
                "email": "aaa@hola.com",
                "courses": "materia"
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
                "courses": "materia,materia"
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
    });

    test("PUT /students/:searchParam should return an error for not change data", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "name": "holaaa",
                "email": "aaa@hola.com",
                "courses": "materia"
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
        expect(RESPONSE.body).toEqual(
            {"status": 400, "message": "The entire user cannot be updated because some data did not change. Please change all user data"}
        );
    });

    test("PUT /students/:searchParam should return an error for ocuped email", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/78b2c235-21ce-4fc5-b53d-482a061e6a90')
        .send(
            {
                "name": "Max",
                "email": "dadada@hola.com",
                "courses": "materia"
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
        expect(RESPONSE.body).toEqual(
            {"status": 400, "message": "The email is ocuped, plis use another email to create a new student"}
        );
    });

    test("PUT /students/:searchParam should return an error for use name by search param", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/Benjamin')
        .send(
            {
                "name": "Max",
                "email": "correoprueba@hola.com",
                "courses": "materia"
            }
        );

        expect(RESPONSE.statusCode).toBe(400);
        expect(RESPONSE.body).toEqual(
            {"status": 400, "message": "To edit a student, search by ID or email, please"}
        );
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
        expect(RESPONSE.body).toEqual(
            {
                "status": 200,
                "data": {
                    "id": "2f9d2ea7-d403-4af7-9d90-41896646d368",
                    "name": "benja editado",
                    "email": "cambiadocorreoa@hola.com",
                    "courses": [
                        "hola",
                        "materia",
                        "otramateria",
                        "otramateria2"
                    ]
                }
            }
        );
    });

    test("PUT /students/:searchParam should return an error from repeated courses", async () => {

        const RESPONSE = await REQUEST(APP).put('/students/fb5f899d-54a5-4ac6-8cc1-378e66afbd5d')
        .send(
            {
                "name": "AAAAA",
                "email": "gayutra@hola.com",
                "courses": [ "biología" ]
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
                "courses": "biología"

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
                "courses": "biología"

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

    test("PATCH /students/:searchParam should return error for not change data", async () => {

        const RESPONSE = await REQUEST(APP).patch('/students/8e90aad9-1ebd-4308-8f73-62a89f58f142')
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

    test("DELETE /students/:searchParam should return an error for use name", async () => {

        const RESPONSE = await REQUEST(APP).delete('/students/holaaa');

        expect(RESPONSE.statusCode).toBe(400);

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
    
});