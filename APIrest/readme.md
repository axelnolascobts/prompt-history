# Student Management REST API #
This is a RESTful API built with Node.js and express.js
for managing student records. It supports CRUD operations,
uses a JSON file as a local database, and includes swagger
documentation for easy API testing

# Features #
-Get all students (GET)
-Get a student by ID (GET)
-Delete a student data by ID (DELETE)
-Update a student completly by ID (PUT)
-Partially update a student by ID (PATCH)
-Validate data
-swagger ui for documentation.

# Instalation #
1. Download the source code or clone the repository
2. navigate to the project directory
cd APIrest
3. install de dependencies:
-install Node.js from here: https://nodejs.org/en/download
-Initialize npm:
npm init -y
-install this dependencies in the cmd:
npm install express
npm install uuid
npm install swagger-ui-express
npm install -g nodemon

# Start the server #
To start the server run in the cmd and in the root of the directory:
nodemon app.js
or if you have this in your script of package.json
"dev": "nodemon app.js"
run with:
npm run dev
one the server is running in the cmd you will see this message:
Server is running at: http://localhost:3000

# Swagger docs #
Then you can go to youe browser and insert this link to see the documentation:
http://localhost:3000/api-docs/
You can see examples of how to do CRUD in the API and the endpoints it handles.

# Sample endpoints and expected responses #
ENDPOINT: http://localhost:3000/students/ GET
{
    "status: "200": 
    "description": "List of all students",
}
{
    "status: "404": 
    "description": "Students not found",
}

ENDPOINT http://localhost:3000/students/:id GET BY ID
{
    "status: "200": 
    "description": "student Data",
}
{
    "status: "404": 
    "description": "Student not found",
}

ENDPOINT: http://localhost:3000/students/ POST

{
    "status: "201": 
    "description": "Student created successfully",
}
{
    "status: "400": 
    "description": "Name and email are required",
}
{
    "status: "400": 
    "description": "The email already exists",
}
{
    "status: "400": 
    "description": "courses must be an array '[]'",
}

ENDPOINT: http://localhost:3000/students/:id PUT
{
    "status": "200":
    "description": Data inserted in the student
}
{
    "status: "404": 
    "description": "Student not found",
}
{
    "status: "400": 
    "description": "PUT request must be replace: name, email and courses",
}
{
    "status: "400": 
    "description": "The email already is used",
}
{
    "status: "400": 
    "description": "Name and email are required",
}
{
    "status: "400": 
    "description": "courses must be an array '[]'",
}
{
    "status: "400": 
    "description": "1 or more data is the same, please insert different data",
}

ENDPOINT: http://localhost:3000/students/:id PATCH
{
    "status": "200":
    "description": Data inserted in the student
}
{
    "status: "404": 
    "description": "Student not found",
}
{
    "status: "400": 
    "description": "name cannot be empty",
}
{
    "status: "400": 
    "description": "email cannot be empty",
}
{
    "status: "400": 
    "description": "This email is already registered",
}
{
    "status: "400": 
    "description": ""courses must be an array '[]'",
}

ENDPOINT: http://localhost:3000/students/:id DELETE

{
    "status": "200":
    "description": "Data inserted in the student"
}
{
    "status": "404":
    "description": "Student not found"
}
