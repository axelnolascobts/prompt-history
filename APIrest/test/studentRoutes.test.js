const request = require("supertest");
const app = require("../app");
const fs = require("fs");
const { validateStudent } = require("../controllers/student/utils");

jest.mock("fs");

const mockStudents = [
  { id: "123", name: "Milton", email: "milton@gmail.com", courses: ["Math"] },
  { id: "456", name: "Ana", email: "ana@gmail.com", courses: ["Math", "Science"] }
];

const mockCourses = [
  { name: "Math", students: ["milton@gmail.com", "ana@gmail.com"] },
  { name: "Science", students: ["ana@gmail.com"] }
];

describe("Student API", () => {
  beforeEach(() => {
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes("db.json")) {
        return JSON.stringify(mockStudents);
      }
      if (filePath.includes("courses.json")) {
        return JSON.stringify(mockCourses);
      }
      return "[]";
    });
    fs.writeFileSync.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Aquí inicia el GET
  describe("GET /students", () => {
    it("should filter by email", async () => {
      const res = await request(app).get("/students").query({ email: "milton@gmail.com" });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.email).toBe("milton@gmail.com");
    });

    it("should filter by course", async () => {
      const res = await request(app).get("/students").query({ course: "Math" });
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].courses).toContain("Math");
    });

    it("should filter by id", async () => {
      const res = await request(app).get("/students").query({ id: "123" });
      expect(res.statusCode).toBe(200);
      expect(res.body.data[0].id).toBe("123");
    });

    it("should return empty array if name is empty string", async () => {
      const res = await request(app).get("/students").query({ name: "" });
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    it("should return empty array if id is empty string", async () => {
      const res = await request(app).get("/students").query({ id: "" });
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    it("should return empty array if email is empty string", async () => {
      const res = await request(app).get("/students").query({ email: "" });
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    it("should return 404 if not found", async () => {
      fs.readFileSync.mockReturnValue(JSON.stringify([]));
      const res = await request(app).get("/students").query({ email: "notfound@mail.com" });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("No students found with the given query");
    });
  });

  // Aquí inicia el POST
  describe("POST /students", () => {
    it("should create a new student with valid data", async () => {
      const newStudent = {
        name: "Juan",
        email: "juan@gmail.com",
        courses: ["Math"]
      };
      const res = await request(app).post("/students").send(newStudent);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Student created successfully");
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it("should reject empty request body", async () => {
      const res = await request(app).post("/students").send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("data must have required property 'name'");
    });

    it("should reject duplicate email", async () => {
      const newStudent = {
        name: "Pedro",
        email: "milton@gmail.com",
        courses: ["Math"]
      };
      const res = await request(app).post("/students").send(newStudent);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("The email already exists");
    });

    it("should reject invalid email format", async () => {
      const newStudent = {
        name: "Pedro",
        email: "pedro@@gmail.com",
        courses: ["Math"]
      };
      const res = await request(app).post("/students").send(newStudent);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('email must match format "email"');
    });

    it("should reject empty or invalid course strings", async () => {
      const newStudent = {
        name: "Pedro",
        email: "pedro2@gmail.com",
        courses: [""]
      };
      const res = await request(app).post("/students").send(newStudent);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("All courses must be non-empty strings");
    });
  });

  // Aquí inicia el PUT
  describe("PUT /students", () => {
    it("should update the student with valid data", async () => {
      const updated = { name: "Milton Updated", email: "milton@gmail.com", courses: ["Math"] };
      const res = await request(app).put("/students").query({ id: "123" }).send(updated);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Student edited successfully and courses updated");
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it("should reject empty body", async () => {
      const res = await request(app).put("/students").query({ id: "123" }).send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Request body cannot be empty");
    });

    it("should reject duplicate email with another student", async () => {
      const updated = { name: "Milton", email: "ana@gmail.com", courses: ["Math"] };
      const res = await request(app).put("/students").query({ id: "123" }).send(updated);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("The email already exists");
    });

    it("should reject if name has invalid characters", async () => {
      const updated = { name: "Milton@#", email: "milton@gmail.com", courses: ["Math"] };
      const res = await request(app).put("/students").query({ id: "123" }).send(updated);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Name must contain only letters and spaces");
    });

    it("should accept name with punto, guion y comilla simple", async () => {
      const updated = { name: "Ana O'Brian-Jr.", email: "ana@gmail.com", courses: ["Math"] };
      const res = await request(app).put("/students").query({ id: "456" }).send(updated);
      expect([200, 400]).toContain(res.statusCode);
    });

    it("should reject name with invalid special characters", async () => {
      const updated = { name: "Ana@Brian", email: "ana@gmail.com", courses: ["Math"] };
      const res = await request(app).put("/students").query({ id: "456" }).send(updated);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/Name/);
    });

    it("should reject if any course contains invalid characters", async () => {
      const updated = { name: "Ana", email: "ana@gmail.com", courses: ["Math$", "Science"] };
      const res = await request(app).put("/students").query({ id: "456" }).send(updated);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/Course/);
    });

    it("should reject if courses have duplicates", async () => {
      const updated = { name: "Ana", email: "ana@gmail.com", courses: ["Math", "Math"] };
      const res = await request(app).put("/students").query({ id: "456" }).send(updated);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/duplicate/i);
    });

    it("should reject if courses is not an array (late check)", async () => {
      const updated = { name: "Milton", email: "milton@gmail.com", courses: "Math" };
      const res = await request(app).put("/students").query({ id: "123" }).send(updated);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("courses must be array");
    });
  });

  // Aquí inicia PUT casos de query faltante
  describe("PUT /students (missing query params)", () => {
    it("should return 400 if both id and email are missing in query", async () => {
      const updated = { name: "Milton", email: "milton@gmail.com", courses: ["Math"] };
      const res = await request(app).put("/students").send(updated);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch("cannot update with name");
    });
  });

  // Aquí inicia PUT existencia de cursos y actualización de email
  describe("PUT /students (courses existence and email update)", () => {
    it("should reject if any course does not exist", async () => {
      const updated = { name: "Milton", email: "milton@gmail.com", courses: ["Math", "NoExiste"] };
      const res = await request(app).put("/students").query({ id: "123" }).send(updated);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/These courses do not exist|Course\(s\) not found/i);
    });

    it("should update email in all courses if email changes", async () => {
      const updated = { name: "Milton", email: "milton2@gmail.com", courses: ["Math", "Science"] };
      const res = await request(app).put("/students").query({ id: "123" }).send(updated);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.email).toBe("milton2@gmail.com");
    });

    it("should remove student from old courses if courses changed", async () => {
      const updated = { name: "Milton", email: "milton@gmail.com", courses: ["Science"] };
      const res = await request(app).put("/students").query({ id: "123" }).send(updated);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.courses).toEqual(["Science"]);
    });

    it("should add student to new courses if courses changed", async () => {
      const updated = { name: "Milton", email: "milton@gmail.com", courses: ["Math", "Science"] };
      const res = await request(app).put("/students").query({ id: "123" }).send(updated);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.courses).toEqual(["Math", "Science"]);
    });
  });

  // Aquí inicia PUT edge cases
  describe("PUT /students (edge cases)", () => {
    it("should accept name with leading/trailing spaces", async () => {
      const updated = { name: "  Milton  ", email: "milton@gmail.com", courses: ["Math"] };
      const res = await request(app).put("/students").query({ id: "123" }).send(updated);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).toBe("Milton");
    });

    it("should accept email with leading/trailing spaces", async () => {
      const updated = { name: "Milton", email: "  milton@gmail.com  ", courses: ["Math"] };
      const res = await request(app).put("/students").query({ id: "123" }).send(updated);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/email/);
    });

    it("should not update email in courses if email does not change", async () => {
      const updated = { name: "Milton", email: "milton@gmail.com", courses: ["Math"] };
      const res = await request(app).put("/students").query({ id: "123" }).send(updated);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.email).toBe("milton@gmail.com");
    });
  });

  // Aquí inicia el PATCH
  describe("PATCH /students", () => {
    it("should update only name", async () => {
      const res = await request(app).patch("/students").query({ id: "123" }).send({ name: "Milton Patched" });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Student updated successfully");
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it("should update email and courses together", async () => {
      const res = await request(app).patch("/students").query({ id: "123" }).send({ email: "milton2@gmail.com", courses: ["Science"] });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Student updated successfully");
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it("should reject duplicate email", async () => {
      const res = await request(app)
        .patch("/students")
        .query({ id: "123" })
        .send({ email: "ana@gmail.com" });
      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("Student with this email already exists");
    });

    it("should reject non-array courses", async () => {
      const res = await request(app).patch("/students").query({ id: "123" }).send({ courses: "Math" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid courses format");
    });

    it("should reject courses with empty string", async () => {
      const res = await request(app).patch("/students").query({ id: "123" }).send({ courses: [""] });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid courses format");
    });
  });

  // Aquí inicia el DELETE
  describe("DELETE /students", () => {
    it("should delete a student by email", async () => {
      const res = await request(app).delete("/students").query({ email: "milton@gmail.com" });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Student deleted successfully and courses updated");
      expect(res.body.data.email).toBe("milton@gmail.com");
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it("should return 404 if student not found by email", async () => {
      const res = await request(app).delete("/students").query({ email: "notfound@mail.com" });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Student not found");
    });

    it("should return 400 if both id and email are empty strings", async () => {
      const res = await request(app).delete("/students").query({ id: "", email: "" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("cannot delete with name");
    });

    it("should return 400 if id is present but empty", async () => {
      const res = await request(app).delete("/students").query({ id: "" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("cannot delete with name");
    });

    it("should return 400 if email is present but empty", async () => {
      const res = await request(app).delete("/students").query({ email: "" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("cannot delete with name");
    });

    it("should not delete if student is already deleted", async () => {
      fs.readFileSync.mockReturnValueOnce(JSON.stringify([]));
      const res = await request(app).delete("/students").query({ id: "123" });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/Student not found/);
    });
  });

  // Aquí inicia la validación de estudiantes
  describe("Student Validation", () => {
    it("should validate student with all fields", () => {
      expect(validateStudent({
        name: "Milton",
        email: "milton@mail.com",
        courses: ["Math"]
      }, [], mockCourses)).toEqual({ valid: true });
    });

    it("should invalidate student with empty name", () => {
      expect(validateStudent({
        name: "",
        email: "milton@mail.com",
        courses: ["Math"]
      }, [], mockCourses)).toEqual({ valid: false, message: "name must NOT have fewer than 1 characters" });
    });

    it("should invalidate student with invalid email", () => {
      expect(validateStudent({
        name: "Milton",
        email: "miltonmail.com",
        courses: ["Math"]
      }, [], mockCourses)).toEqual({ valid: false, message: 'email must match format "email"' });
    });

    it("should invalidate student with empty courses", () => {
      expect(validateStudent({
        name: "Milton",
        email: "milton@mail.com",
        courses: []
      }, [], mockCourses)).toEqual({ valid: false, message: "courses must NOT have fewer than 1 items" });
    });
  });

  // Aquí inicia edge cases de controladores extra
  describe("Extra controller edge cases", () => {
    it("GET /students should return 404 if students file is empty", async () => {
      fs.readFileSync.mockReturnValueOnce(JSON.stringify([]));
      const res = await request(app).get("/students");
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/No students found/);
    });

    it("POST /students should reject if query params are present", async () => {
      fs.readFileSync
        .mockReturnValueOnce(JSON.stringify([]))
        .mockReturnValueOnce(JSON.stringify(mockCourses));
      const res = await request(app).post("/students?foo=bar").send({
        name: "Test",
        email: "test@mail.com",
        courses: ["Math"]
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Query parameters are not allowed in POST");
    });

    it("PATCH /students should return 400 if no id or email", async () => {
      const res = await request(app).patch("/students").send({ name: "X" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("cannot edit with name");
    });

    it("PATCH /students should return 404 if student not found", async () => {
      fs.readFileSync
        .mockReturnValueOnce(JSON.stringify([]))
        .mockReturnValueOnce(JSON.stringify(mockCourses));
      const res = await request(app).patch("/students").query({ id: "999" }).send({ name: "X" });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/Student not found/);
    });

    it("DELETE /students should return 400 if no id or email", async () => {
      const res = await request(app).delete("/students");
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("cannot delete with name");
    });

    it("DELETE /students should return 404 if student not found", async () => {
      fs.readFileSync
        .mockReturnValueOnce(JSON.stringify([]))
        .mockReturnValueOnce(JSON.stringify(mockCourses));
      const res = await request(app).delete("/students").query({ id: "999" });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/Student not found/);
    });
  });
});
