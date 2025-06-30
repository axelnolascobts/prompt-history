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

describe("GET /students", () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('courses.json')) {
        return JSON.stringify([
          { name: "Math", students: [] },
          { name: "Science", students: [] }
        ]);
      }
      return JSON.stringify([
        { id: "123", name: "Milton", email: "milton@gmail.com", courses: ["Math"] }
      ]);
    });
  });

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

  it("should return 404 if not found", async () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    const res = await request(app).get("/students").query({ email: "notfound@mail.com" });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No students found with the given query");
  });
});

describe("POST /students", () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync
      .mockReturnValueOnce(JSON.stringify(mockStudents))
      .mockReturnValueOnce(JSON.stringify(mockCourses));
  });

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
    expect(res.body.message).toBe("Invalid body: check required fields and field names");
  });

  it("should reject duplicate email", async () => {
    const newStudent = {
      name: "Milton",
      email: "milton@gmail.com",
      courses: ["Math"]
    };
    const res = await request(app).post("/students").send(newStudent);
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Student with this email already exists");
  });

  it("should reject invalid course duplicates", async () => {
    const newStudent = {
      name: "Pedro",
      email: "pedro@gmail.com",
      courses: ["Math", "Math"]
    };
    const res = await request(app).post("/students").send(newStudent);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Duplicate courses are not allowed");
  });

  it("should reject invalid email format", async () => {
    const newStudent = {
      name: "Pedro",
      email: "pedro@@gmail.com",
      courses: ["Math"]
    };
    const res = await request(app).post("/students").send(newStudent);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid body: check required fields and field names");
  });

  it("should reject empty or invalid course strings", async () => {
    const newStudent = {
      name: "Pedro",
      email: "pedro2@gmail.com",
      courses: [""]
    };
    const res = await request(app).post("/students").send(newStudent);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid courses format");
  });
});

describe("PUT /students", () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync
      .mockReturnValueOnce(JSON.stringify(mockStudents))
      .mockReturnValueOnce(JSON.stringify(mockCourses));
  });

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
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Student with this email already exists");
  });

  it("should reject courses with duplicates", async () => {
    const updated = { name: "Milton", email: "milton@gmail.com", courses: ["Math", "Math"] };
    const res = await request(app).put("/students").query({ id: "123" }).send(updated);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Duplicate courses are not allowed");
  });
});

describe("PATCH /students", () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync
      .mockReturnValueOnce(JSON.stringify(mockStudents))
      .mockReturnValueOnce(JSON.stringify(mockCourses));
  });

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
    const res = await request(app).patch("/students").query({ id: "123" }).send({ email: "ana@gmail.com" });
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

describe("DELETE /students", () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync
      .mockReturnValueOnce(JSON.stringify(mockStudents))
      .mockReturnValueOnce(JSON.stringify(mockCourses));
  });

  it("should delete a student", async () => {
    const res = await request(app).delete("/students").query({ id: "123" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Student deleted successfully and courses updated");
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});

describe("Student Validation", () => {
  it("should validate student with all fields", () => {
    expect(validateStudent({
      name: "Milton",
      email: "milton@mail.com",
      courses: ["Math"]
    })).toBe(true);
  });

  it("should invalidate student with empty name", () => {
    expect(validateStudent({
      name: "",
      email: "milton@mail.com",
      courses: ["Math"]
    })).toBe(false);
  });

  it("should invalidate student with invalid email", () => {
    expect(validateStudent({
      name: "Milton",
      email: "miltonmail.com",
      courses: ["Math"]
    })).toBe(false);
  });

  it("should invalidate student with empty courses", () => {
    expect(validateStudent({
      name: "Milton",
      email: "milton@mail.com",
      courses: []
    })).toBe(false);
  });
});

describe("Extra controller edge cases", () => {
  beforeEach(() => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReset();
    fs.writeFileSync.mockReset();
  });

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
    expect(res.body.message).toMatch(/does not accept query parameters/);
  });

  it("PATCH /students should return 400 if no id or email", async () => {
    const res = await request(app).patch("/students").send({ name: "X" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/'id' or 'email' is required/);
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
    expect(res.body.message).toMatch(/'id' or 'email' is required/);
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
