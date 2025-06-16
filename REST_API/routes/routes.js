const express = require('express');
const ROUTER = express.Router();
const { readData, getStudentById, createNewStudent, deleteStudent, completeStudentUpdate, partialStudentUpdate } = require('./controllers');

ROUTER.get('/', (request, response) => {

    let studentsData = readData();

    response.status(200).json(studentsData);

});

ROUTER.get('/:id', (request, response) => {

    let id = request.params.id;
    let student = getStudentById(id);

    response.status(student.status).json(student);

});

ROUTER.post('/', (request, response) => {

    /*let name = request.body.name;
    let email = request.body.email;
    let courses = request.body.courses;*/
    let body = request.body;
    
    let newStudent = createNewStudent(body);

    response.status(newStudent.status).json(newStudent);

});

ROUTER.put('/:id', (request, response) => {

    /*let id = request.params.id;
    let name = request.body.name;
    let email = request.body.email;
    let courses = request.body.courses;*/
    let body = request.body;

    let updatedStudent = completeStudentUpdate(id, body);

    response.status(updatedStudent.status).json(updatedStudent);

});

ROUTER.patch('/:id', (request, response) => {

    let id = request.params.id;
    /*let name = request.body.name;
    let email = request.body.email;
    let courses = request.body.courses;*/
    let body = request.body;

    let updatedStudent = partialStudentUpdate(id, body);

    response.status(updatedStudent.status).json(updatedStudent);

});

ROUTER.delete('/:id', (request, response) => {

    let id = request.params.id;
    let resultOfOperation = deleteStudent(id);

    response.status(resultOfOperation.status).json(resultOfOperation);

});

module.exports = ROUTER;