const express = require('express');
const ROUTER = express.Router();
const { getAllStudents, getStudentBySearchParam, createNewStudent, deleteStudent, completeStudentUpdate, partialStudentUpdate } = require('./controllers');

ROUTER.get('/', (request, response) => {

    let studentsData = getAllStudents();

    response.status(200).json(studentsData);

});

ROUTER.get('/:searchParam', (request, response) => {

    let searchParam = request.params.searchParam;
    let student = getStudentBySearchParam(searchParam);

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

ROUTER.put('/:searchParam', (request, response) => {

    let searchParam = request.params.searchParam;
    /*let name = request.body.name;
    let email = request.body.email;
    let courses = request.body.courses;*/
    let body = request.body;

    let updatedStudent = completeStudentUpdate(searchParam, body);

    response.status(updatedStudent.status).json(updatedStudent);

});

ROUTER.patch('/:searchParam', (request, response) => {

    let searchParam = request.params.searchParam;
    /*let name = request.body.name;
    let email = request.body.email;
    let courses = request.body.courses;*/
    let body = request.body;

    let updatedStudent = partialStudentUpdate(searchParam, body);

    response.status(updatedStudent.status).json(updatedStudent);

});

ROUTER.delete('/:searchParam', (request, response) => {

    let searchParam = request.params.searchParam;
    let resultOfOperation = deleteStudent(searchParam);

    response.status(resultOfOperation.status).json(resultOfOperation);

});

module.exports = ROUTER;