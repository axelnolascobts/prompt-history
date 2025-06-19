const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AJV = require("ajv");
const AJVFORMATS = require("ajv-formats");

const DATA_ROUTE = "/home/user/Documentos/prompt-history/REST_API/data/db.json";

const AJV_VALIDATOR = new AJV({ allErrors: true });
AJVFORMATS(AJV_VALIDATOR);

const NEW_STUDENT_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
    courses: { anyOf: [
        { type: "string" },
        { type: "array", items: { "type": "string" } }
      ] }
  },
  required: ["name", "email"],
  additionalProperties: false
};

const UPDATE_EVERY_STUDENT_DATA_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
    courses: { anyOf: [
        { type: "string" },
        { type: "array", items: { "type": "string" } }
      ] }
  },
  required: ["name", "email", "courses"],
  additionalProperties: false
};

const UPDATE_PARTIAL_STUDENT_DATA_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
    courses: { anyOf: [
        { type: "string" },
        { type: "array", items: { "type": "string" } }
      ] }
  },
  additionalProperties: false
};

const VALIDATE_NEW_STUDENT = AJV_VALIDATOR.compile(NEW_STUDENT_SCHEMA);
const VALIDATE_UPDATE_EVERY_STUDENT = AJV_VALIDATOR.compile(UPDATE_EVERY_STUDENT_DATA_SCHEMA);
const VALIDATE_UPDATE_PARTIAL_STUDENT = AJV_VALIDATOR.compile(UPDATE_PARTIAL_STUDENT_DATA_SCHEMA);

function readData() {

    let data;

    try {

        data = fs.readFileSync(DATA_ROUTE, 'utf8');
    } catch (error) {

        fs.writeFileSync(DATA_ROUTE, '[]');
        return [];

    }

    let students = JSON.parse(data);

    return students;

}

function writeData(data) {

    try {

        fs.writeFileSync(DATA_ROUTE, JSON.stringify(data, null, 2));
    } catch (err) {

        return {status: 500, message: "Failed to save student" };
    }

};

function getStudentById(id) {

    let studentsData = readData();
    let student = studentsData.find(studentData => studentData.id === id);

    if (student) {

        return {status: 200, data: student};
    } else {

        return {status: 404, message: "Student not found or not exist"};
    }
}

function createNewStudent(body) {

    const VALIDATE_SCHEMA = VALIDATE_NEW_STUDENT(body);

    if (!VALIDATE_SCHEMA) {

        return {status: 400, message: "Invalid input format"};
        
    }

    /*if (name === undefined || email === undefined) {

        return {status: 400, message: "There is no content to update the data"};
    }*/

    let studentsData = readData();
    let studentMail = studentsData.find(studentData => studentData.email.toLowerCase() === body.email.toLowerCase());
    
    /*let validData = validateNameAndEmail(name, email);

    if (!validData) {

        return {status: 400, message: "Invalid data type, name and email must be text strings."};
    }*/

    if (studentMail){

        return {status: 400, message: "The email is ocuped, plis use another email to create a new student"};

    } else {

        if (/*email.trim() === "" ||*/ body.name.trim() === "") {

            return {status: 400, message: "Name is required and obligatory data, plis fill it"};

        } else {

            let id = uuidv4();
            let coursesAuxiliar = body.courses ? body.courses : [];
            let coursesList = reviewCourses(coursesAuxiliar);
            let uniqueCourses = nonDuplicateCourses(coursesList);

            if (!uniqueCourses) {

                return {status: 400, message: "Check the courses, there cannot be repeated courses"};

            }

            let newStudent = {
                id,
                name: body.name,
                email: body.email,
                courses: coursesList
            };

            studentsData.push(newStudent);

            try {

                writeData(studentsData);
                return {status: 201, data: newStudent};

            } catch (error) {

                return {status: 500, message: "Failed to save student"};
            }

        }
    } 
}

function completeStudentUpdate(id, body) {

    const VALIDATE_SCHEMA = VALIDATE_UPDATE_EVERY_STUDENT(body);

    if (!VALIDATE_SCHEMA) {

        return {status: 400, message: "Invalid input format"};
        
    }

    /*if (name === undefined || email === undefined) {

        return {status: 400, message: "There is no content to update the data"};
    }

    let validData = validateNameAndEmail(name, email);

    if (!validData) {

        return {status: 400, message: "Invalid data type, name and email must be text strings."};
    }*/

    if ( body.name.trim() === "" /*|| email.trim() === "" */) {

        return {status: 400, message: "Name cannot be empty field"};

    } else {

        let studentsData = readData();
        let student = studentsData.find(studentData => studentData.id === id);
        let studentIndex = studentsData.findIndex(studentData => studentData.id === id);

        if (student) {

            if (student.name === body.name || student.email === body.email) {

                return {status: 400, message: "The entire user cannot be updated because some data did not change. Please change all user data"};

            } else {

                let coursesAuxiliar = body.courses ? body.courses : [];
                let coursesList = reviewCourses(coursesAuxiliar);
                let uniqueCourses = nonDuplicateCourses(coursesList);

                if (!uniqueCourses) {

                    return {status: 400, message: "Check the courses, there cannot be repeated courses"};

                }

                let compareCourses = comparateCourses(student.courses, coursesList);

                if (!compareCourses ) {

                    return {status: 400, message: "The entire user cannot be updated because some data did not change. Please change all user data"};

                }

                let updatedStudent = {

                    id,
                    name: body.name,
                    email: body.email,
                    courses: coursesList
                };

                studentsData[studentIndex] = updatedStudent;

                writeData(studentsData);

                return {status: 200, data: updatedStudent};
            }
        } else {

            return {status: 404, message: "Student not found or not exist"};
        }
    }
}

function partialStudentUpdate(id, body) {

    const VALIDATE_SCHEMA = VALIDATE_UPDATE_PARTIAL_STUDENT(body);

    if (!VALIDATE_SCHEMA) {

        return {status: 400, message: "Invalid input format"};
        
    }

    if (body.name === undefined && body.email === undefined && body.courses === undefined) {

        return {status: 400, message: "The entire user cannot be updated because some data did not change. Please change something"};
    } else {

        /*let validData = validateNameAndEmail(name, email);

        if (!validData) {

            return {status: 400, message: "Invalid data type, name and email must be text strings."};
        }*/

        if ( body.name.trim() === "" /*|| body.email.trim() === ""*/ ) {

            return {status: 400, message: "Name cannot be empty field"};

        } else {

            let studentsData = readData();
            let student = studentsData.find(studentData => studentData.id === id);
            let studentIndex = studentsData.findIndex(studentData => studentData.id === id);

            if (student) {

                let coursesAuxiliar = body.courses ? body.courses : [];
                let coursesList = reviewCourses(coursesAuxiliar);
                let uniqueCourses = nonDuplicateCourses(coursesList);

                if (!uniqueCourses) {

                    return {status: 400, message: "Check the courses, there cannot be repeated courses"};

                }

                let compareCourses = comparateCourses(student.courses, coursesList);

                if (student.name === body.name && student.email === body.email && !compareCourses) {

                    return {status: 400, message: "The entire user cannot be updated because some data did not change. Please change something"};

                } else {

                    let updatedStudent = {

                        id,
                        name: body.name ? body.name : student.name,
                        email: body.email ? body.email : student.email,
                        courses: coursesList
                    };

                    studentsData[studentIndex] = updatedStudent;

                    writeData(studentsData);

                    return {status:200, data: updatedStudent};
                }
            } else {

                return {status: 404, message: "Student not found or not exist"};
            }
        }
    }
}

function deleteStudent(id) {

    let studentsData = readData();
    let studentIndex = studentsData.findIndex(studentData => studentData.id === id);

    if (studentIndex === -1) {

        return {status: 404, message: "Student not found or not exist"};
    } else {

        studentsData.splice(studentIndex, 1);

        writeData(studentsData);

        return {status: 204, message: "Student was deleted"};
    }
}

function reviewCourses(courses) {

    if (!Array.isArray(courses)) {

        if (typeof courses === 'string') {
            let coursesArray = [];

            if (courses.includes(",")) {

                coursesArray = courses.split(",");
                coursesArray.sort();

            } else {

                coursesArray.push(courses);

            }

            return coursesArray;
        }

    } else {

        courses.sort();
        return courses;
    }
}

function nonDuplicateCourses(courses) {

    if (courses.length > 1) {

        for (i = 0; i <= courses.length - 2; i++) {

            for (j = i + 1; j <= courses.length -1; j++) {

                if (courses[i].trim() === courses[j].trim()) {

                    return false;
                }

            }

        }
    }

    return true;
}

function comparateCourses(courses1, courses2) {

    if (courses1.length === courses2.length) {

        let countSameCourses = 0;

        for (let i = 0; i <= courses1.length -1; i++) {

            if (courses1[i] === courses2[i]){

                countSameCourses++;
            }
        }

        if (countSameCourses === courses1.length) {

            return false;
            
        }
    }

    return true;
}

/*function validateNameAndEmail(name, email) {

    if(typeof name === 'string' && typeof email === 'string') {

        return true;
    } else {

        return false;
    }

}*/

module.exports = { readData, getStudentById, createNewStudent, deleteStudent, completeStudentUpdate, partialStudentUpdate };