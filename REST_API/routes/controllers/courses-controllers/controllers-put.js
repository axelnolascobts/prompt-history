const AJV = require("ajv");
const AJVFORMATS = require("ajv-formats");
const { readData } = require('./controllers-get.js');
const { VALIDATE_COURSE, writeData, nonDuplicateStudents, validateStudents } = require('./controllers-post.js');

const DATA_ROUTE = "/home/user/Documentos/prompt-history/REST_API/data/db.json";

const AJV_VALIDATOR = new AJV({ allErrors: true });
AJVFORMATS(AJV_VALIDATOR);

function updateCourse(courseName, body) {

    const VALIDATE_SCHEMA = VALIDATE_COURSE(body);

    if (!VALIDATE_SCHEMA) {

        return {status: 400, message: "Invalid input format"};
        
    }

    let coursesData = readData();

    let course = coursesData.find(courseData => courseData.course.toLowerCase().trim() === courseName.toLowerCase().trim());

    if ( !course ) {

        return {status: 404, message: "Course not found"};

    } else if ( course.course !== body.course ) {

        return {status: 400, message: "Cannot change course name"};
    } else if ( !nonDuplicateStudents(body.students) ) {

        return {status: 400, message: "You cannot have duplicate students in the same class"};
    }

    let studentsList = validateStudents(courseName, body.students);

    if ( !studentsList ) {

        return {status: 400, message: "Some of the students were not found"};
    }

    let courseIndex = coursesData.findIndex(courseData => courseData.course.toLowerCase().trim() === courseName.toLowerCase().trim());

    coursesData[courseIndex].students = studentsList;

    writeData(coursesData);

    return { status: 200, data: course }
}

module.exports = { updateCourse };

