const fs = require('fs');
const AJV = require("ajv");
const AJVFORMATS = require("ajv-formats");
const { readData } = require('./controllers-get.js');

const DATA_ROUTE = "/home/user/Documentos/prompt-history/REST_API/data/db.json";

const AJV_VALIDATOR = new AJV({ allErrors: true });
AJVFORMATS(AJV_VALIDATOR);

const NEW_COURSE_SCHEMA = {
  type: "object",
  properties: {
    course: { type: "string" },
    students: { type: "array", items: { "type": "string" } }
  },
  required: ["course", "students"],
  additionalProperties: false
};

const VALIDATE_COURSE = AJV_VALIDATOR.compile(NEW_COURSE_SCHEMA);

function readStudentsData() {

    let data;

    try {

        data = fs.readFileSync(DATA_ROUTE, 'utf8');
    } catch (error) {

        fs.writeFileSync(DATA_ROUTE, '[]');
        return [];

    }

    let allData = JSON.parse(data);
    let students = allData.students;

    return students;

}

function writeData(courses) {

    try {

        let allData = fs.readFileSync(DATA_ROUTE, 'utf8');
        let data = JSON.parse(allData);

        data.courses = courses;

        fs.writeFileSync(DATA_ROUTE, JSON.stringify(data, null, 2));
    } catch (err) {

        return {status: 500, message: "Failed to save course" };
    }
};

function writeStudentsData(students) {

    try {
    
        let allData = fs.readFileSync(DATA_ROUTE, 'utf8');
        let data = JSON.parse(allData);

        data.students = students;
    
        fs.writeFileSync(DATA_ROUTE, JSON.stringify(data, null, 2));
    } catch (err) {
    
        return {status: 500, message: "Failed to save student" };
    }
};


function createNewCourse(body) {

    const VALIDATE_SCHEMA = VALIDATE_COURSE(body);

    if (!VALIDATE_SCHEMA) {

        return {status: 400, message: "Invalid input format"};
        
    }

    let coursesData = readData();
    
    let course = coursesData.find(courseData => courseData.course.toLowerCase().trim() === body.course.toLowerCase().trim());

    if (course){

        return {status: 400, message: "This course already exists, use other name"};

    } else {

        if (body.course.trim() === "") {

            return {status: 400, message: "Name is required and obligatory data, please fill it"};

        } else {

            let nonDuplicate = nonDuplicateStudents(body.students);

            if (!nonDuplicate) {

                return {status: 400, message: "You cannot have duplicate students in the same class"};
            }

            let studentsList = validateStudents(body.course.trim().toLowerCase(), body.students);

            if (!studentsList) {

                return {status: 400, message: "Some of the students were not found"};

            }

            let newCourse = {
                course: body.course.trim().toLowerCase(),
                students: studentsList
            };

            coursesData.push(newCourse);

            try {

                writeData(coursesData);
                return {status: 201, data: newCourse};

            } catch (error) {

                return {status: 500, message: "Failed to save student"};
            }

        }
    } 
}

function validateStudents(courseName, studentsList) {
    const UUID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    let studentsData = readStudentsData();
    let finalStudentsList = [];

    if (studentsList.length === 0) {
        return finalStudentsList;
    }


    for (let student of studentsList) {

        let uuidMatch = student.match(UUID_PATTERN);

        if (!uuidMatch) {

            return false;

        } else {

            let studentData = studentsData.find(studentData => studentData.id === student);

            if (!studentData) {

                return false;
            }
        }
    }

    for (let student of studentsList) {

        let studentData = studentsData.find(studentData => studentData.id === student);
        let studentCourses = studentData.courses;

        if (!studentCourses.includes(courseName)) {
            studentCourses.push(courseName);
        }

        finalStudentsList.push({
            id: studentData.id,
            studentName: studentData.name
        });
    }

    writeStudentsData(studentsData);

    return finalStudentsList;
}


function nonDuplicateStudents(studentsList) {

    if (studentsList.length > 1) {

        for (i = 0; i <= studentsList.length - 2; i++) {

            for (j = i + 1; j <= studentsList.length -1; j++) {

                if (studentsList[i].trim().toLowerCase() === studentsList[j].trim().toLowerCase() || studentsList[i].trim().toLowerCase() === "") {

                    return false;
                }

            }

        }
    }

    return true;
}

module.exports = { createNewCourse, VALIDATE_COURSE, writeData, nonDuplicateStudents, validateStudents };