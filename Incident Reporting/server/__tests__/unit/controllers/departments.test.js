const departmentsController = require("../../../controllers/departments");
const Department = require("../../../models/Department");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd
}));

const mockRes = { status: mockStatus };

describe("Departments Controller", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe("index", () => {
        let testDepartments, mockReq;

        beforeEach(() => {
            testDepartments = [{ name: "HR" }, { name: "Finance" }];
            mockReq = { body: { org_id: 1 } };
        });

        it("should return all departments with status 200", async () => {
            jest.spyOn(Department, "getAll").mockResolvedValue(testDepartments);

            await departmentsController.index(mockReq, mockRes);

            expect(Department.getAll).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testDepartments);
        });

        it("should return an error of 404 if no departments exist", async () => {
            jest.spyOn(Department, "getAll").mockRejectedValue(new Error("No departments currently exist"));

            await departmentsController.index(mockReq, mockRes);

            expect(Department.getAll).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ err: "No departments currently exist" });
        });
    });

    describe("show", () => {
        let testDepartment, mockReq;

        beforeEach(() => {
            testDepartment = { department_id: 1, name: "HR" };
            mockReq = { body: { department_id: 1 } };
        });

        it("should return a department by ID with status 200", async () => {
            jest.spyOn(Department, "getDepById").mockResolvedValue(testDepartment);

            await departmentsController.show(mockReq, mockRes);

            expect(Department.getDepById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testDepartment);
        });

        it("should return an error of 404 if department not found", async () => {
            jest.spyOn(Department, "getDepById").mockRejectedValue(new Error("Could not find department with this ID, or there a duplicates"));

            await departmentsController.show(mockReq, mockRes);

            expect(Department.getDepById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ err: "Could not find department with this ID, or there a duplicates" });
        });
    });

    describe("createDep", () => {
        let testDepartment, mockReq;

        beforeEach(() => {
            testDepartment = { name: "Engineering", description: "Tech dept", org_id: 1 };
            mockReq = { body: testDepartment };
        });

        it("should create a new department with status 201", async () => {
            jest.spyOn(Department, "createDep").mockResolvedValue(testDepartment);

            await departmentsController.createDep(mockReq, mockRes);

            expect(Department.createDep).toHaveBeenCalledWith(testDepartment);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(testDepartment);
        });

        it("should return an error of 400 if department creation fails", async () => {
            jest.spyOn(Department, "createDep").mockRejectedValue(new Error("Failed to create this department"));

            await departmentsController.createDep(mockReq, mockRes);

            expect(Department.createDep).toHaveBeenCalledWith(testDepartment);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ err: "Failed to create this department" });
        });
    });

    describe("updateDep", () => {
        let testDepartment, updatedDepartment, mockReq, mockUpdate;

        beforeEach(() => {
            testDepartment = { department_id: 1, name: "HR" };
            updatedDepartment = { department_id: 1, name: "Human Resources" };
            mockReq = { body: updatedDepartment };

            mockUpdate = jest.fn().mockResolvedValue(updatedDepartment);
        });

        it("should update a department with status 200", async () => {
            jest.spyOn(Department, "getDepById").mockResolvedValue({ update: mockUpdate });

            await departmentsController.updateDep(mockReq, mockRes);

            expect(Department.getDepById).toHaveBeenCalledWith(1);
            expect(mockUpdate).toHaveBeenCalledWith(updatedDepartment);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(updatedDepartment);
        });

        it("should return an error of 400 if update fails", async () => {
            jest.spyOn(Department, "getDepById").mockRejectedValue(new Error("Cannot find department with this ID"));

            await departmentsController.updateDep(mockReq, mockRes);

            expect(Department.getDepById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ err: "Cannot find department with this ID" });
        });
    });

    describe("destroyDep", () => {
        let testDepartment, mockReq, mockDelete;

        beforeEach(() => {
            testDepartment = { department_id: 1, name: "HR" };
            mockReq = { body: { department_id: testDepartment.department_id } };

            mockDelete = jest.fn().mockResolvedValue({});
        });

        it("should delete a department and return status 204", async () => {
            jest.spyOn(Department, "getDepById").mockResolvedValue({ delete: mockDelete });

            await departmentsController.destroyDep(mockReq, mockRes);

            expect(Department.getDepById).toHaveBeenCalledWith(1);
            expect(mockDelete).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockEnd).toHaveBeenCalled();
        });

        it("should return an error of 400 if deletion fails", async () => {
            jest.spyOn(Department, "getDepById").mockRejectedValue(new Error("Department not found"));

            await departmentsController.destroyDep(mockReq, mockRes);

            expect(Department.getDepById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ err: "Department not found" });
        });
    });
});
