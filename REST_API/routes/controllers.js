const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const DATA_ROUTE = "/home/user/Documentos/prompt-history/REST_API/data/db.json" 

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

function createNewStudent(name, email, courses) {

    if (name === undefined || email === undefined) {

        return {status: 400, message: "There is no content to update the data"};
    }

    let studentsData = readData();
    let studentMail = studentsData.find(studentData => studentData.email.toLowerCase() === email.toLowerCase());
    
    let validData = validateNameAndEmail(name, email);

    if (!validData) {

        return {status: 400, message: "Invalid data type, name and email must be text strings."};
    }

    if (studentMail){

        return {status: 400, message: "The email is ocuped, plis use another email to create a new student"};

    } else {

        if (email.trim() === "" || name.trim() === "") {

            return {status: 400, message: "Name and email are required and obligatory data, plis fill it"};

        } else {

            let id = uuidv4();
            let coursesAuxiliar = courses ? courses : [];
            let coursesList = reviewCourses(coursesAuxiliar);
            let uniqueCourses = nonDuplicateCourses(coursesList);

            if (!uniqueCourses) {

                return {status: 400, message: "Check the courses, there cannot be repeated courses"};

            }

            let newStudent = {
                id,
                name,
                email,
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

function completeStudentUpdate(id, name, email, courses) {

    if (name === undefined || email === undefined) {

        return {status: 400, message: "There is no content to update the data"};
    }

    let validData = validateNameAndEmail(name, email);

    if (!validData) {

        return {status: 400, message: "Invalid data type, name and email must be text strings."};
    }

    if ( name.trim() === "" || email.trim() === "" ) {

        return {status: 400, message: "Name or email cannot be empty fields"};

    } else {

        let studentsData = readData();
        let student = studentsData.find(studentData => studentData.id === id);
        let studentIndex = studentsData.findIndex(studentData => studentData.id === id);

        if (student) {

            if (student.name === name || student.email === email) {

                return {status: 400, message: "The entire user cannot be updated because some data did not change. Please change all user data"};

            } else {

                let coursesAuxiliar = courses ? courses : [];
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
                    name,
                    email,
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

function partialStudentUpdate(id, name, email, courses) {

    if (name === undefined && email === undefined && courses === undefined) {

        return {status: 400, message: "The entire user cannot be updated because some data did not change. Please change something"};
    } else {

        let validData = validateNameAndEmail(name, email);

        if (!validData) {

            return {status: 400, message: "Invalid data type, name and email must be text strings."};
        }

        if ( name.trim() === "" || email.trim() === "" ) {

            return {status: 400, message: "Name or email cannot be empty fields"};

        } else {

            let studentsData = readData();
            let student = studentsData.find(studentData => studentData.id === id);
            let studentIndex = studentsData.findIndex(studentData => studentData.id === id);

            if (student) {

                let coursesAuxiliar = courses ? courses : [];
                let coursesList = reviewCourses(coursesAuxiliar);
                let uniqueCourses = nonDuplicateCourses(coursesList);

                if (!uniqueCourses) {

                    return {status: 400, message: "Check the courses, there cannot be repeated courses"};

                }

                let compareCourses = comparateCourses(student.courses, coursesList);

                if (student.name === name && student.email === email && !compareCourses) {

                    return {status: 400, message: "The entire user cannot be updated because some data did not change. Please change something"};

                } else {

                    let updatedStudent = {

                        id,
                        name: name ? name : student.name,
                        email: email ? email : student.email,
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

        return {status: 200, message: "Student was deleted"};
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

function validateNameAndEmail(name, email) {

    if(typeof name === 'string' && typeof email === 'string') {

        return true;
    } else {

        return false;
    }

}

module.exports = { readData, getStudentById, createNewStudent, deleteStudent, completeStudentUpdate, partialStudentUpdate };