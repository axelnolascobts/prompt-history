const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const DATA_ROUTE = "/home/user/Documentos/prompt-history/Books_API/data/db.json" 

function readData() {

    let students = [];

    fs.readFile(DATA_ROUTE, 'utf8', function(error, data) {

        if (error) {

            fs.appendFile(DATA_ROUTE, '[]', function(error) {

                if (error) {

                    console.log("error");
                }
            });
        }

        students = JSON.parse(data);

        return students;

    });
}

function writeData(data) {

    fs.writeFile(DATA_ROUTE, JSON.stringify(data, null, 2), (err) => {
    
        if (err) {
            return ({ message: "Failed to save student" });
        }
    
    });

};

function getStudentById(id) {

    let studentsData = readData();
    let student = studentsData.find(studentData => studentData.id === id);

    if (student) {

        return JSON.parse(student);
    } else {

        return ({ message: "Student not found or not exist"})
    }
}

function createNewStudent(name, email, courses) {

    let studentsData = readData();
    let studentMail = studentsData.find(studentData => studentData.email === email);

    if (studentMail){

        return JSON.parse( {message: "The email is ocuped, plis use another email to create a new student"} );

    } else {

        if (email.trim() === "" || name.trim() === "") {

            return JSON.parse( {message: "name and email are required and obligatory data, plis fill it"} );

        } else {

            let id = uuidv4();

            const newStudent = {
                id,
                name,
                email,
                courses
            };

            studentsData.push(newStudent);

            fs.writeFile(DATA_ROUTE, JSON.stringify({ studentsData }, null, 2), (error) => {
                
                if (error) {

                    return ({ message: "Failed to save student" });
                }
                
                return json(newStudent);

            });
        }
    } 
}

function completeStudentUpdate(id, name, email, courses) {

    if ( name.trim() === "" || email.trim() === "" ) {

        return ({message: "Name or email cannot be empty fields"});

    } else {

        let studentsData = readData();
        let student = studentsData.find(studentData => studentData.id === id);
        let studentIndex = studentsData.findIndex(studentData => studentData.id === id);

        if (student) {

            if (student.name === name || student.email === email || student.courses === courses) {

                return ({message: "The entire user cannot be updated because some data did not change. Please change all user data"});

            } else {

                let updatedStudent = {

                    id,
                    name,
                    email,
                    courses
                };

                studentsData[studentIndex] = updatedStudent;

                writeData(studentsData);

                return JSON.parse(updatedStudent);
            }
        }
    }
}

function deleteStudent(id) {

    let studentsData = readData();
    let studentIndex = studentsData.findIndex(studentData => studentData.id === id);

    if (studentIndex === -1) {

        return ({message: "Student not found or not exist"});
    } else {

        studentsData.splice(studentIndex, 1);

        writeData(studentsData);

        return ({message: "Student was deleted"});
    }
}

module.exports = { readData, getStudentById, createNewStudent, deleteStudent, completeStudentUpdate };