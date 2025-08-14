const express = require('express');
const ROUTER = express.Router();
const { getAllStudents, getStudentBySearchParam, createNewStudent, deleteStudent, completeStudentUpdate, partialStudentUpdate, getStudentCourses, patchCourses, deleteCourses, putCourses } = require('./controllers/controllers.js');

ROUTER.get('/', (request, response) => {

    let studentsData = getAllStudents();

    response.status(200).json(studentsData);
});

ROUTER.get('/search', (request, response) => {

    const { id, email, name } = request.query;

    let searchParam = id || email || name;
    
    let student = getStudentBySearchParam(searchParam);

    response.status(student.status).json(student);
});

ROUTER.get('/:id', (request, response) => {

    let id = request.params.id;

    let student = getStudentBySearchParam(id);

    response.status(student.status).json(student);
});

ROUTER.get('/:id/courses', (request, response) => {

    let id = request.params.id;

    let student = getStudentCourses(id)

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

    let id = request.params.id;
    let body = request.body;

    let updatedStudent = completeStudentUpdate(id, body);

    response.status(updatedStudent.status).json(updatedStudent);
});

ROUTER.patch('/:id', (request, response) => {

    let id = request.params.id;
    let body = request.body;

    let updatedStudent = partialStudentUpdate(id, body);

    response.status(updatedStudent.status).json(updatedStudent);
});

ROUTER.put('/:id/courses', (request, response) => {

    let id = request.params.id;
    let body = request.body;

    let result = putCourses(id, body);

    response.status(result.status).json(result);
});

ROUTER.patch('/:id/courses', (request, response) => {

    let id = request.params.id;
    let body = request.body;

    let result = patchCourses(id, body);

    response.status(result.status).json(result);
});

ROUTER.delete('/:id', (request, response) => {

    let id = request.params.id;

    let resultOfOperation = deleteStudent(id);

    response.status(resultOfOperation.status).json(resultOfOperation);
});

ROUTER.delete('/:id/courses', (request, response) => {

    let id = request.params.id;

    let resultOfOperation = deleteCourses(id);

    response.status(resultOfOperation.status).json(resultOfOperation);
});

module.exports = ROUTER;