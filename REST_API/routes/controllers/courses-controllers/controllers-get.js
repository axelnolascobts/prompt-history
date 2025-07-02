const fs = require('fs');

const DATA_ROUTE = "/home/user/Documentos/prompt-history/REST_API/data/db.json";

function readData() {

    let data;

    try {

        data = fs.readFileSync(DATA_ROUTE, 'utf8');
    } catch (error) {

        fs.writeFileSync(DATA_ROUTE, '[]');
        return [];

    }

    let allData = JSON.parse(data);
    let courses = allData.courses;

    return courses;

}

function getAllCourses() {

    let courses = readData();

    return {status: 200, data: courses};

}

function getOneCourse(name) {

    let course = searchCourses(name);

    if (course) {

        return {status: 200, data: course};
    } else {

        return {status: 404, message: "Course not found or not exist"};
    }
}

function searchCourses(name) {

    let coursesData = readData();

    let course = coursesData.find(courseData => courseData.course.trim().toLowerCase() === name.trim().toLowerCase());

    return course;
}

module.exports = { getAllCourses, getOneCourse, readData };