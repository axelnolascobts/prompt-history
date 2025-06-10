const express = require('express');
const ROUTER = express.Router();
const { readData, getStudentById, createNewStudent, deleteStudent, completeStudentUpdate } = require('.controllers.js');

ROUTER.get('/', (request, response) => {

    let studentsData = readData();

    response.json(studentsData);

});

ROUTER.get('/:id', (request, response) => {

    let id = request.params.id;
    let student = getStudentById(id);

    response.json(student);

});

ROUTER.post('/', (request, response) => {

    let name = request.body.name;
    let email = request.body.emal;
    let courses = request.body.courses;
    let newStudent = createNewStudent(name, email, courses);

    response.json(newStudent);

});

ROUTER.put('/:id', (request, response) => {

    let id = request.params.id;
    let name = request.body.name;
    let email = request.body.emal;
    let courses = request.body.courses;

    let updatedStudent = completeStudentUpdate(id, name, email, courses);

    response.json(updatedStudent);

});

ROUTER.delete('/:id', (request, response) => {

    let id = request.params.id;
    let resultOfOperation = deleteStudent(id);

    response.json(resultOfOperation);

});