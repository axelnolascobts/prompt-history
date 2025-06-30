const {
  hasDuplicateCourses,
  checkCoursesExist,
  emailRegex,
  validateStudent,
} = require("../controllers/student/utils");

describe("Utils", () => {
  describe("hasDuplicateCourses", () => {
    it("returns true if there are duplicates", () => {
      expect(hasDuplicateCourses(["Math", "Science", "Math"])).toBe(true);
    });
    it("returns false if there are no duplicates", () => {
      expect(hasDuplicateCourses(["Math", "Science"])).toBe(false);
    });
  });

  describe("checkCoursesExist", () => {
    const coursesData = [{ name: "Math" }, { name: "Science" }];
    it("returns false if all courses exist", () => {
      expect(checkCoursesExist(["Math", "Science"], coursesData)).toBe(false);
    });
    it("returns array of missing courses if some do not exist", () => {
      expect(checkCoursesExist(["Math", "Biology"], coursesData)).toEqual([
        "Biology",
      ]);
    });
  });

  describe("emailRegex", () => {
    it("matches valid emails", () => {
      expect(emailRegex.test("test@mail.com")).toBe(true);
    });
    it("rejects invalid emails", () => {
      expect(emailRegex.test("invalid-email")).toBe(false);
    });
  });

  describe("validateStudent", () => {
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
        courses: {
          type: "array",
          items: { type: "string" },
          minItems: 1,
        },
      },
      required: ["name", "email", "courses"],
      additionalProperties: false,
    };

    it("validates a correct student object", () => {
      expect(
        validateStudent({
          name: "Milton",
          email: "milton@mail.com",
          courses: ["Math"],
        })
      ).toBe(true);
    });

    it("invalidates an object with extra fields", () => {
      expect(
        validateStudent(schema, {
          name: "Milton",
          email: "milton@mail.com",
          courses: ["Math"],
          foo: "bar",
        })
      ).toBe(false);
    });
  });
});
