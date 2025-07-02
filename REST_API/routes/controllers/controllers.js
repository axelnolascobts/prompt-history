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
        //{ type: "string" },
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
        //{ type: "string" },
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
        //{ type: "string" },
        { type: "array", items: { "type": "string" } }
      ] }
  },
  additionalProperties: false
};

const COURSES_SCHEMA = {
    type: "object",
    properties: {
        courses: { type: "array", items: { "type": "string" } }

    },
    additionalProperties: false
};

const DELETE_COURSES_SCHEMA = {
    type: "object",
    properties: {
        courses: { type: "array", items: { "type": "string" } }

    },
    required: ["courses"],
    additionalProperties: false
};


const VALIDATE_PUT_COURSES = AJV_VALIDATOR.compile(DELETE_COURSES_SCHEMA);
const VALIDATE_COURSES = AJV_VALIDATOR.compile(COURSES_SCHEMA);
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

    let allData = JSON.parse(data);
    let students = allData.students;

    return students;

}

function writeData(students) {

    try {

        let allData = fs.readFileSync(DATA_ROUTE, 'utf8');
        let data = JSON.parse(allData);

        data.students = students;

        fs.writeFileSync(DATA_ROUTE, JSON.stringify(data, null, 2));
    } catch (err) {

        return {status: 500, message: "Failed to save student" };
    }

};

function getAllStudents() {

    let students = readData();

    return {status: 200, data: students};

}

function getStudentBySearchParam(searchParam) {

    if (!searchParam) {

        return {status: 400, message: "Query param undefined"};

    }

    let searchResult = searchStudents(searchParam); 
    let student = searchResult.student;

    if (Array.isArray(student)) {

        return {status: 200, data: student};
    }

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

        return {status: 400, message: "This student already exists, use other data"};

    } else {

        if (/*email.trim() === "" ||*/ body.name.trim() === "") {

            return {status: 400, message: "Name is required and obligatory data, please fill it"};

        } else {

            let id = uuidv4();
            let coursesAuxiliar = body.courses ? body.courses : [];
            let coursesList = reviewCourses(coursesAuxiliar);
            let uniqueCourses = nonDuplicateCourses(coursesList);

            if (!uniqueCourses) {

                return {status: 400, message: "Check the courses, there cannot be repeated courses or in this case empty courses"};

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

function completeStudentUpdate(searchParam, body) {

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
        //let student = studentsData.find(studentData => studentData.id === id);
        //let studentIndex = studentsData.findIndex(studentData => studentData.id === id);

        let searchResult = searchStudents(searchParam);
        let student = searchResult.student;
        let studentIndex = searchResult.studentIndex;
        

        if (student) {

            // if (Array.isArray(student)) {

            //     return {status: 400, message: "To edit a student, search by ID or email, please"};

            // }

            if ( !body ) {

                //return {status: 400, message: "The entire user cannot be updated because some data did not change. Please change user data"};

            } else {

                let studentMail = studentsData.find(studentData => studentData.email.toLowerCase() === body.email.toLowerCase());

                if (studentMail && studentMail.email !== student.email) {

                    return {status: 400, message: "This student already exists, use other data"};

                }

                let coursesAuxiliar = body.courses ? body.courses : [];
                let coursesList = reviewCourses(coursesAuxiliar);
                let uniqueCourses = nonDuplicateCourses(coursesList);

                if (!uniqueCourses) {

                    return {status: 400, message: "Check the courses, there cannot be repeated or empty courses"};

                }

                // let compareCourses = comparateCourses(student.courses, coursesList);

                // if (!compareCourses ) {

                //     return {status: 400, message: "The entire user cannot be updated because some data did not change. Please change user data"};

                // }

                let updatedStudent = {

                    id: student.id,
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

function partialStudentUpdate(searchParam, body) {

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

        if ( !body ) {

            //return {status: 400, message: "Not content"};

        } else {
            
            let studentsData = readData();
            // let student = studentsData.find(studentData => studentData.id === id);
            // let studentIndex = studentsData.findIndex(studentData => studentData.id === id);

            let searchResult = searchStudents(searchParam);
            let student = searchResult.student;
            let studentIndex = searchResult.studentIndex;

            if (student) {

                if (Array.isArray(student)) {

                    return {status: 400, message: "To edit a student, search by ID or email, please"};

                }

                let coursesAuxiliar = body.courses ? body.courses : student.courses;
                let coursesList = reviewCourses(coursesAuxiliar);
                let uniqueCourses = nonDuplicateCourses(coursesList);

                if (!uniqueCourses) {

                    return {status: 400, message: "Check the courses, there cannot be repeated or empty courses"};

                }

                //let compareCourses = comparateCourses(student.courses, coursesList);

                if (!uniqueCourses/*student.name === body.name && student.email === body.email && !compareCourses*/) {

                    //return {status: 400, message: "The entire user cannot be updated because some data did not change. Please change something"};

                } else {

                    let updatedStudent = {

                        id: student.id,
                        name: body.name ? body.name : student.name,
                        email: body.email ? body.email : student.email,
                        courses: coursesList
                    };

                    if ( updatedStudent.name.trim() === "" /*|| body.email.trim() === ""*/ ) {
                    
                        return {status: 400, message: "Name cannot be empty field"};

                    }

                    let studentMail = studentsData.find(studentData => studentData.email.toLowerCase() === updatedStudent.email.toLowerCase());

                    if (studentMail && studentMail.email !== student.email) {

                        return {status: 400, message: "This student already exists, use other data"};

                    }

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

function deleteStudent(searchParam) {

    let studentsData = readData();
    //let studentIndex = studentsData.findIndex(studentData => studentData.id === id);

    let searchResult = searchStudents(searchParam);
    let studentIndex = searchResult.studentIndex;

    if (studentIndex === undefined) {

        return {status: 404, message: "Student not found or not exist"};
    } else {

        if (Array.isArray(searchResult.student)) {

            return {status: 400, message: "To delete a student, search by ID or email, please"};

        }

        studentsData.splice(studentIndex, 1);

        writeData(studentsData);

        return {status: 204, message: "Student was deleted"};
    }
}

function reviewCourses(courses) {

    let coursesArray = [];

    // if (!Array.isArray(courses)) {

    //     if (typeof courses === 'string') {

    //         if (courses.includes(",")) {

    //             let auxiliarArray = courses.split(",");
    //             auxiliarArray.sort();

    //             for (let course of auxiliarArray) {

    //                 coursesArray.push(course.trim());
    //             }

    //         } else {

    //             coursesArray.push(courses.trim());

    //         }
    //     }

    //} else {

        for (let course of courses) {

            coursesArray.push(course.trim());
        }

        coursesArray.sort();
    //}

    return coursesArray;
}

function nonDuplicateCourses(courses) {

    if (courses.length > 1) {

        for (i = 0; i <= courses.length - 2; i++) {

            for (j = i + 1; j <= courses.length -1; j++) {

                if (courses[i].trim().toLowerCase() === courses[j].trim().toLowerCase() || courses[i].trim().toLowerCase() === "") {

                    return false;
                }

            }

        }
    }

    return true;
}

// function comparateCourses(courses1, courses2) {

//     if (courses1.length === courses2.length) {

//         let countSameCourses = 0;

//         for (let i = 0; i <= courses1.length -1; i++) {

//             if (courses1[i] === courses2[i]){

//                 countSameCourses++;
//             }
//         }

//         if (countSameCourses === courses1.length) {

//             return false;
            
//         }
//     }

//     return true;
// }

function searchStudents(searchParam) {
    
    const UUID_PATTERN =  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let uuidMatch = searchParam.match(UUID_PATTERN);
    let emailMAtch = searchParam.match(EMAIL_PATTERN);

    let studentsData = readData();

    if (uuidMatch) {

        let student = studentsData.find(studentData => studentData.id === searchParam);
        let studentIndex = studentsData.findIndex(studentData => studentData.id === searchParam);

        if (student) {

            return { student, studentIndex }
        }

        return false;
        
    } else if (emailMAtch) {

        let student = studentsData.find(studentData => studentData.email === searchParam);
        let studentIndex = studentsData.findIndex(studentData => studentData.email === searchParam);

         if (student) {

            return { student, studentIndex }
        }

        return false;

    } else if (!uuidMatch && !emailMAtch) {    

        let student = studentsData.filter(studentData => studentData.name.trim().toLowerCase() === searchParam.trim().toLowerCase());

        if (student.length === 0) {

            return false;

        }

        studentIndex = 0;
        return { student, studentIndex };

    }

}

function getStudentCourses(id) {

    let searchResult = searchStudents(id);

    if (!searchResult) {
        
        return {status: 404, message: "Student not found or not exist"};
    }

    return {status: 200, data: searchResult.student.courses};

}

function patchCourses(id, body) {

    const VALIDATE_SCHEMA = VALIDATE_COURSES(body);

    if (!VALIDATE_SCHEMA) {

        return { status: 400, message: "invalid input format" };   
    }

    let searchResult = searchStudents(id);

    if (!searchResult) {

        return { status: 404, message: "Student not foun or not exist" };  
    }

    let courses = body.courses ? body.courses : [];

    if (!nonDuplicateCourses(courses)) {

        return { status: 400, message: "Check the courses, there cannot be repeated or empty courses" }
    }

    let studentsData = readData();

    let studentIndex = searchResult.studentIndex
    //let courses = searchResult.student.courses;

    studentsData[studentIndex].courses = courses;

    writeData(studentsData);

    return { status: 200, data: studentsData[studentIndex] };
}

function putCourses(id, body) {

    const VALIDATE_SCHEMA = VALIDATE_PUT_COURSES(body);

    if (!VALIDATE_SCHEMA) {

        return { status: 400, message: "invalid input format" };   
    }

    let searchResult = searchStudents(id);    

    if (!searchResult) {

        return { status: 404, message: "Student not foun or not exist" };  
    }

    if (!nonDuplicateCourses(body.courses)) {

        return { status: 400, message: "Check the courses, there cannot be repeated or empty courses" }
    }

    let studentsData = readData();

    let studentIndex = searchResult.studentIndex;

    studentsData[studentIndex].courses = body.courses;

    writeData(studentsData);

    return { status: 200, data: studentsData[studentIndex] };
}

function deleteCourses(id) {

    let searchResult = searchStudents(id);

    if (!searchResult) {

        return { status: 404, message: "Student not foun or not exist" };  
    }

    let studentsData = readData();

    let studentIndex = searchResult.studentIndex

    studentsData[studentIndex].courses = [];

    writeData(studentsData);

    return { status: 200, data: studentsData[studentIndex] };
}

module.exports = { getAllStudents, getStudentBySearchParam, createNewStudent, deleteStudent, completeStudentUpdate, partialStudentUpdate, getStudentCourses, patchCourses, deleteCourses, putCourses };