# REST_API #

## API overview ##

A REST-based API designed to perform full CRUD operations with all its HTTP methods (GET, POST, PUT, PATCH, DELETE), simulating a student registry where data such as the student's name, email, and courses are stored.

## Instructions to Run the Server ##

1. First, download the REST_API repository from GitHub.

2. Next, install Node, Swagger-UI, Express, and UUID to ensure everything works correctly.

(Node can be downloaded through its installer available on the official website.)
To install the other dependencies, run the following commands in the console after installing Node:

    + npm install -g swagger-ui
    + npm install express
    + npm install uuid

Once the required packages are installed, you can run the server.

3. To run the server, simply navigate to the path where the REST_API repository downloaded from GitHub is located in the console, enter the repository, and then execute the command: node app.js.

If everything is correct, you should see the following message in the console: "Server listening in http://localhost:3000"

4. Done, the server is running on port 3000 of localhost. Now you can use the API with Postman or view it directly from your browser of choice.

## How to Acess Swagger Documentation ##

To access the Swagger documentation, we have 2 options:

1. The first option is to locate the swagger.json file inside the "api-docs" folder within the REST_API repository.

Once you find the file, open it with a text editor to review the Swagger file directly in JSON format.

2. The second option is to view it from your browser. For this, ensure that the server is running as we saw earlier. Then, access the link: http://localhost:3000/api-docs/ in your preferred browser, and you'll be able to view the Swagger documentation easily.

## Sample Endpoints and Expected Responses ##

+ To get ALL students:

Endpoint: GET http://localhost:3000/students/

Expected responses:
Code 200 - Return all the data of the registered students:

    "data": {
        "id": "c980a75a-9159-4950-8708-974d473e6c61",
        "name": "jaime",
        "email": "aoshshao",
        "courses": [
            "biologia"
        ]
    }

+ To get a user by their ID:

Endpoint: GET http://localhost:3000/students/id

Expected responses:
Code 200 - Return the requested student’s data:

    "data": {
        "id": "c980a75a-9159-4950-8708-974d473e6c61",
        "name": "jaime",
        "email": "aoshshao",
        "courses": [
            "biologia"
        ]
    }

Code 400 - Return an error if the user is not found:

    {
        "status": 404,
        "message": "Student not found or not exist"
    }

+ To create a new student:

Endpoint: POST http://localhost:3000/students/

Expected responses:
Code 201 - Return the successfully created student’s data:

{
    "status": 201,
    "data": {
        "id": "6370a8af-3766-470d-ada5-a22d75a847d5",
        "name": "paquito",
        "email": "noharétravesuras@gmail.com",
        "courses": [
            "fisica 3"
        ]
    }
}

Code 400 - No data to create a user (name or email fields are empty):

{
    "status": 400,
    "message": "There is no content to update the data"
}

Code 400 - The email being registered has already been used:

{
    "status": 400,
    "message": "The email is ocuped, plis use another email to create a new student"
}

Code 400 - The student has a duplicate course in the course list:

{
    "status": 400,
    "message": "Check the courses, there cannot be repeated courses"
}

Code 400 - Attempt to update the student's name or email with invalid data:

{
    "status": 400,
    "message": "Invalid data type, name and email must be text strings."
}


+ To update ALL data of a student:

Endpoint: PUT http://localhost:3000/students/id

Expected responses:
Code 200 - All the user's data was updated successfully:

{
    "status": 200,
    "data": {
        "id": "6370a8af-3766-470d-ada5-a22d75a847d5",
        "name": "mamá soy paquito",
        "email": "noharétravesuras77@gmail.com",
        "courses": [
            "matemáticas"
        ]
    }
}

Code 400 - Some user data remained the same:

{
    "status": 400,
    "message": "The entire user cannot be updated because some data did not change. Please change all user data"
}

Code 400 - Attempted to leave the name or email field empty:

{
    "status": 400,
    "message": "Name or email cannot be empty fields"
}

Code 400 - The student has a duplicate course in the course list:

{
    "status": 400,
    "message": "Check the courses, there cannot be repeated courses"
}

Code 400 - Attempted to update the name or email with invalid data:

{
    "status": 400,
    "message": "Invalid data type, name and email must be text strings."
}

Code 404 - The user was not found or does not exist:

{
    "status": 404,
    "message": "Student not found or not exist"
}

+ To update ONE OR MORE pieces of a student’s data:

Endpoint: PATCH http://localhost:3000/students/id

Expected responses:
Code 200 - At least one piece of user data was updated successfully:

{
    "status": 200,
    "data": {
        "id": "6370a8af-3766-470d-ada5-a22d75a847d5",
        "name": "mamá soy paquito",
        "email": "noharétravesuras77@gmail.com",
        "courses": [
            "matemáticas",
            "español"   
        ]
    }
}

Code 400 - All student data remained the same:

{
    "status": 400,
    "message": "The entire user cannot be updated because some data did not change. Please change all user data"
}

Code 400 - Attempted to leave the name or email field empty:

{
    "status": 400,
    "message": "Name or email cannot be empty fields"
}

Code 400 - The student has a duplicate course in the course list:

{
    "status": 400,
    "message": "Check the courses, there cannot be repeated courses"
}

Code 400 - Attempted to update the name or email with invalid data:

{
    "status": 400,
    "message": "Invalid data type, name and email must be text strings."
}

Code 404 - The user was not found or does not exist:

{
    "status": 404,
    "message": "Student not found or not exist"
}

+ To delete a user by their ID:

Endpoint: DELETE http://localhost:3000/students/id

Expected responses:
Code 200 - The user was successfully deleted:

{
    "status": 200,
    "message": "Student was deleted"
}

Code 404 - The user was not found or does not exist:

{
    "status": 404,
    "message": "Student not found or not exist"
}

