const db = require("../../../db/connect");
const Department = require("../../../models/Department");

jest.mock("../../../db/connect");

describe("Department model", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return all departments for an org", async () => {
            const mockDepartments = [
                { department_id: 1, name: "HR", description: "People", org_id: 1 },
                { department_id: 2, name: "IT", description: "Tech", org_id: 1 }
            ];
            db.query.mockResolvedValue({ rows: mockDepartments });

            const result = await Department.getAll(1);

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM department WHERE org_id = $1",
                [1]
            );
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Department);
            expect(result[0].name).toBe("HR");
        });

        it("should throw if no departments exist", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Department.getAll(1)).rejects.toThrow(
                "No departments currently exist"
            );
        });
    });

    describe("getDepById", () => {
        it("should return a department when found", async () => {
            const row = { department_id: 1, name: "Finance", description: "Money", org_id: 1 };
            db.query.mockResolvedValue({ rows: [row] });

            const result = await Department.getDepById(1);

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM department WHERE department_id = $1",
                [1]
            );
            expect(result).toBeInstanceOf(Department);
            expect(result.name).toBe("Finance");
        });

        it("should throw if not found or duplicates exist", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Department.getDepById(99)).rejects.toThrow(
                "Could not find department with this ID, or there a duplicates"
            );
        });
    });

    describe("createDep", () => {
        it("should create a new department", async () => {
            const depData = { name: "Research", description: "R&D", org_id: 1 };
            db.query.mockResolvedValue({ rows: [{ ...depData, department_id: 10 }] });

            const result = await Department.createDep(depData);

            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO department (name, description, org_id) VALUES ($1, $2, $3) RETURNING *",
                [depData.name, depData.description, depData.org_id]
            );
            expect(result).toBeInstanceOf(Department);
            expect(result.department_id).toBe(10);
            expect(result.name).toBe("Research");
        });

        it("should throw if creation fails", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(
                Department.createDep({ name: "Bad", description: "Fail", org_id: 1 })
            ).rejects.toThrow("Failed to create this department");
        });
    });

    describe("update", () => {
        it("should update a department name", async () => {
            const dep = new Department({ department_id: 1, name: "Old", description: "Test", org_id: 1 });
            const updated = { department_id: 1, name: "New" };
            db.query.mockResolvedValue({ rows: [{ department_id: 1, name: "New", description: "Test", org_id: 1 }] });

            const result = await dep.update(updated);

            expect(db.query).toHaveBeenCalledWith(
                "UPDATE department SET name = $1 WHERE department_id = $2 RETURNING *",
                ["New", 1]
            );
            expect(result).toBeInstanceOf(Department);
            expect(result.name).toBe("New");
        });

        it("should throw if department not found", async () => {
            const dep = new Department({ department_id: 2, name: "Old", description: "Test", org_id: 1 });
            db.query.mockResolvedValue({ rows: [] });

            await expect(dep.update({ department_id: 2, name: "Fail" }))
                .rejects.toThrow("Cannot find department with this ID");
        });
    });

    describe("delete", () => {
        it("should delete department", async () => {
            const dep = new Department({ department_id: 5, name: "ToDelete", description: "Gone", org_id: 1 });
            db.query.mockResolvedValue({});

            await expect(dep.delete()).resolves.not.toThrow();
            expect(db.query).toHaveBeenCalledWith(
                "DELETE FROM department WHERE department_id = $1",
                [5]
            );
        });
    });
});
