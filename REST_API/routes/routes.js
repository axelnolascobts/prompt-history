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

    let name = request.body.name;
    let email = request.body.email;
    let courses = request.body.courses;
    
    let newStudent = createNewStudent(name, email, courses);

    response.status(newStudent.status).json(newStudent);

});

ROUTER.put('/:id', (request, response) => {

    let id = request.params.id;
    let name = request.body.name;
    let email = request.body.email;
    let courses = request.body.courses;

    let updatedStudent = completeStudentUpdate(id, name, email, courses);

    response.status(updatedStudent.status).json(updatedStudent);

});

ROUTER.patch('/:id', (request, response) => {

    let id = request.params.id;
    let name = request.body.name;
    let email = request.body.email;
    let courses = request.body.courses;

    let updatedStudent = partialStudentUpdate(id, name, email, courses);

    response.status(updatedStudent.status).json(updatedStudent);

});

ROUTER.delete('/:id', (request, response) => {

    let id = request.params.id;
    let resultOfOperation = deleteStudent(id);

    response.status(resultOfOperation.status).json(resultOfOperation);

});

module.exports = ROUTER;