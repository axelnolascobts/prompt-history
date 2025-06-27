const express = require('express');
const ROUTER = express.Router();
const { getAllCourses, getOneCourse } = require('./controllers/courses-controllers/controllers-get.js');
const { createNewCourse } = require('./controllers/courses-controllers/controllers-post.js');
const { updateCourse } = require('./controllers/courses-controllers/controllers-put.js');
const { partialUpdateCourse } = require('./controllers/courses-controllers/controllers-patch.js');
const { deleteCourse } = require('./controllers/courses-controllers/controllers-delete.js');


ROUTER.get('/', (request, response) => {

    let coursesData = getAllCourses();

    response.status(200).json(coursesData);
});

ROUTER.get('/:name', (request, response) => {

    let courseName = request.params.name;
    let courseData = getOneCourse(courseName);

    response.status(courseData.status).json(courseData);
});

ROUTER.post('/', (request, response) => {

    let body = request.body;
    let newCourse = createNewCourse(body);

    response.status(newCourse.status).json(newCourse);

});

ROUTER.put('/:name', (request, response) => {

    let name = request.params.name;
    let body = request.body;

    let editCourse = updateCourse(name, body);

    response.status(editCourse.status).json(editCourse);

});

ROUTER.patch('/:name', (request, response) => {

    let name = request.params.name;
    let body = request.body;

    let editCourse = partialUpdateCourse(name, body);

    response.status(editCourse.status).json(editCourse);

});

ROUTER.delete('/:name', (request,response) => {

    let name = request.params.name;
    let result = deleteCourse(name);

    response.status(result.status).json(result);

});

module.exports = ROUTER;