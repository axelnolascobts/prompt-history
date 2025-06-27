const express = require('express');
const ROUTER = express.Router();
const { getAllStudents, getStudentBySearchParam, createNewStudent, deleteStudent, completeStudentUpdate, partialStudentUpdate, getStudentCourses, patchCourses } = require('./controllers/controllers.js');
const { request } = require('../app.js');

ROUTER.get('/', (request, response) => {

    let studentsData = getAllStudents();

    response.status(200).json(studentsData);

});

ROUTER.get('/:id/courses', (request, response) => {

    let id = request.params.id;

    let student = getStudentCourses(id)

    response.status(student.status).json(student);

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

ROUTER.patch('/:id/courses', (request, response) => {

    let id = request.params.id;
    let body = request.body;

    let result = patchCourses(id, body);

    response.status(result.status).json(result);

});

ROUTER.delete('/:searchParam', (request, response) => {

    let searchParam = request.params.searchParam;
    let resultOfOperation = deleteStudent(searchParam);

    response.status(resultOfOperation.status).json(resultOfOperation);

});

module.exports = ROUTER;