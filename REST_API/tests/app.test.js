const REQUEST = require('supertest');
const APP = require('../app.js');

describe("Some Endpoints from students REST API", () => {

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

    // test("POST /students should return a new student", async () => {

    //     const RESPONSE = await REQUEST(APP).post('/students')
    //     .send(
    //         {
    //             "name": "Pancho",
    //             "email": "pancho@hola.com",
    //             "courses": [
    //                 "biología"
    //             ]
    //         }
    //     );

    //     expect(RESPONSE.statusCode).toBe(200);
    //     expect(RESPONSE.body).toEqual(
    //         {
    //             "status": 201,
    //             "data": {
    //                 "id": "fb5f899d-54a5-4ac6-8cc1-378e66afbd5d",
    //                 "name": "Pancho",
    //                 "email": "pancho@hola.com",
    //                 "courses": [
    //                     "biología"
    //                 ]
    //             }
    //         }
    //     );
    // });



    
});