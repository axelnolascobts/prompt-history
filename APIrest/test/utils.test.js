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
    it("returns [] if all courses exist", () => {
      expect(checkCoursesExist(["Math", "Science"], coursesData)).toEqual([]);
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
    const students = [];
    const coursesData = [{ name: "Math" }, { name: "Science" }];

    it("validates a correct student object", () => {
      expect(
        validateStudent(
          {
            name: "Milton",
            email: "milton@mail.com",
            courses: ["Math"],
          },
          students,
          coursesData
        )
      ).toEqual({ valid: true });
    });

    it("invalidates an object with extra fields", () => {
      expect(
        validateStudent(
          {
            name: "Milton",
            email: "milton@mail.com",
            courses: ["Math"],
            foo: "bar",
          },
          students,
          coursesData
        )
      ).toEqual({ valid: false, message: "data must NOT have additional properties" });
    });
  });
});
