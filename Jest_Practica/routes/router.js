const express = require('express');
const ROUTER = express.Router();
const { readData, getTeamByName, registerNewTeam, editAllTeamData, editSomeTeamData, deleteTeam } = require('./controllers.js');

ROUTER.get('/', (request, response) => {

    let teamsList = readData();
    
    response.json(teamsList);

});

ROUTER.get('/:name', (request, response) => {

    let name = request.params.name;
    let team = getTeamByName(name);

    response.json(team);

});

ROUTER.post('/', (request, response) => {

    let newTeam = registerNewTeam(request.body);

    response.json(newTeam);

});

ROUTER.put('/:name', (request, response) => {

    let teamName = request.params.name;

    let editedTeam = editAllTeamData(teamName, request.body);

    response.json(editedTeam);
});

ROUTER.patch('/:name', (request, response) => {

    let teamName = request.params.name;

    let editedTeam = editSomeTeamData(teamName, request.body);

    response.json(editedTeam);
});

ROUTER.delete('/:name', (request, response) => {

    let teamName = request.params.name;

    let result = deleteTeam(teamName);

    response.json(result);

});

module.exports = ROUTER;