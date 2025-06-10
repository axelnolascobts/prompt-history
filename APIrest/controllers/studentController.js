const { isUtf8 } = require('buffer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4} = require('uuid');

const DBPATH = path.join(__dirname, '../db.json');

//leer datos
function ReadData() {
    const data = fs.readFileSync(DBPATH, 'utf8');
    return JSON.parse(data);
}

//guardar datos
function WriteData(data) {
    fs.writeFileSync(DBPATH, JSON.stringify(data, null, 2));
}

// GET students
exports.getAllStudents = (req, res) => {
    const students = ReadData();
    res.json(students)
};

//GET ID
exports.getStudentsById = (req, res) => {
    const students = ReadData();
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return;
    res.status(404).json({ message: 'student not found'});
    res.json(student);
}

//POST 
exports.createStudent = (req, res) => {
    const students = ReadData();
    const {name, email, courses} = req.body;

    if (!name || !email) {
        return(
        res.status(400).json({message: 'name and email are required'}))
    };
    if (students.some(s => s.email === email)) {
        return(
        res.status(400).json({message: 'the email already exists'}))
    };

    const newStudent = {
        id: uuidv4(),
        name, 
        email, 
        courses: courses || []
    };

    students.push(newStudent);
    WriteData(students);
    res.status(201).json(newStudent);
};

