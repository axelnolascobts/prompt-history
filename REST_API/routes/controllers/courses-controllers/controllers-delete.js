const { readData } = require('./controllers-get.js');
const { writeData } = require('./controllers-post.js');

function deleteCourse(courseName) {

    let coursesData = readData();

    let courseIndex = coursesData.findIndex(courseData => courseData.course.toLowerCase().trim() === courseName.toLowerCase().trim());

    if (courseIndex === -1) {

        return {status: 404, message: "Student not found or not exist"};
    } else {

        coursesData.splice(courseIndex, 1);

        writeData(coursesData);

        return {status: 204, message: "Course was deleted"};
    } 

}

module.exports = { deleteCourse };