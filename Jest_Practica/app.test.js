const REQUEST = require('supertest');
const APP = require('./app.js');

describe("TEAMS API test", () => {

    test("GET /teams should return every teams list", async () => {

        const RESPONSE = await REQUEST(APP).get('/teams');

        expect(RESPONSE.statusCode).toBe(200);
        expect(RESPONSE.body).toEqual(
            [
                {
                    "teamName": "Lakers",
                    "cityTeam": "Los Angeles",
                    "playerNames": [
                    "LeBron",
                    "LeBron Jr.",
                    "Reaves",
                    "Schoorer",
                    "Doncic"
                    ]
                },
                {
                    "teamName": "Warriors",
                    "cityTeam": "San Francisco",
                    "playerNames": [
                    "Curry",
                    "Green",
                    "Butler",
                    "Tooney",
                    "Kuminga"
                    ]
                }
            ]
        );
    });

    test("GET /teams/Lakers should return lakers data", async () => {

        const RESPONSE = await REQUEST(APP).get('/teams/Lakers');

        expect(RESPONSE.statusCode).toBe(200);
        expect(RESPONSE.body).toEqual(
            {
                "team": {
                    "teamName": "Lakers",
                    "cityTeam": "Los Angeles",
                    "playerNames": [
                        "LeBron",
                        "LeBron Jr.",
                        "Reaves",
                        "Schoorer",
                        "Doncic"
                    ]
                }
            }
        );
    });

    test("POST /teams should return the new team created", async () => {

        const RESPONSE = await REQUEST(APP).post('/teams')
        .send({
            "teamName": "Celtics",
            "cityTeam": "Boston",
            "playerNames": ["Tatum", "Brown", "White", "Holiday", "Horford"]
        });

        expect(RESPONSE.statusCode).toBe(200);
        expect(RESPONSE.body).toEqual(
            {
                "newTeam": {
                    "teamName": "Celtics",
                    "cityTeam": "Boston",
                    "playerNames": [
                        "Tatum",
                        "Brown",
                        "White",
                        "Holiday",
                        "Horford"
                    ]
                }
            }
        );
    });

    test("PUT /teams/Lakers should return the edited team", async () => {

        const RESPONSE = await REQUEST(APP).put('/teams/Lakers')
        .send({
            "teamName": "Bulls",
            "cityTeam": "Chicago",
            "playerNames": ["Tatum", "Brown", "White", "Holiday", "Horford"]
        });

        expect(RESPONSE.statusCode).toBe(200);
        expect(RESPONSE.body).toEqual(
            {
                "updateTeamData": {
                    "teamName": "Bulls",
                    "cityTeam": "Chicago",
                    "playerNames": [
                        "Tatum",
                        "Brown",
                        "White",
                        "Holiday",
                        "Horford"
                    ]
                }
            }
        );
    });

    test("PATCH /teams/Celtics should return a team with some data edited", async () => {

        const RESPONSE = await REQUEST(APP).patch('/teams/Celtics')
        .send({
            "teamName": "Pelicans",
            "cityTeam": "Boston",
            "playerNames": [
                "Tatum",
                "Brown",
                "White",
                "Holiday",
                "Horford"
            ]
        });

        expect(RESPONSE.statusCode).toBe(200);
        expect(RESPONSE.body).toEqual(
            {
                "editTeam": {
                    "teamName": "Pelicans",
                    "cityTeam": "Boston",
                    "playerNames": [
                        "Tatum",
                        "Brown",
                        "White",
                        "Holiday",
                        "Horford"
                    ]
                }
            }
        );

    });

    test("DELETE /teams/Pelicans should delete team with name Pelicans", async () => {

        const RESPONSE = await REQUEST(APP).delete('/teams/Pelicans');

        expect(RESPONSE.statusCode).toBe(200);

    })
});