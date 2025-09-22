const usersController = require("../../../controllers/users");
const User = require("../../../models/User");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd
}));

const mockRes = { status: mockStatus };

describe("User Controller", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe("index", () => {
        let testUsers;

        beforeEach(() => {
            testUsers = [{ user_id: 1, name: "User1" }, { user_id: 2, name: "User2" }];
        });

        it("should return all users and give 200 status", async () => {
            jest.spyOn(User, "getAll").mockResolvedValue(testUsers);

            await usersController.index({}, mockRes);

            expect(User.getAll).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testUsers);
        });

        it("should return an Error of 500 if no users are available", async () => {
            jest.spyOn(User, "getAll").mockRejectedValue(new Error("No users available"));

            await usersController.index({}, mockRes);

            expect(User.getAll).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "No users available" });
        });
    });

    describe("show", () => {
        let testUser, mockReq;

        beforeEach(() => {
            testUser = { user_id: 1, name: "TestUser" };
            mockReq = { params: { user_id: 1 } };
        });

        it("should return a user with the matching user_id and a status code of 200", async () => {
            jest.spyOn(User, "getOneByUserId").mockResolvedValue(testUser);

            await usersController.show(mockReq, mockRes);

            expect(User.getOneByUserId).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testUser);
        });

        it("should return an Error of 404 if no users are found with that user_id", async () => {
            jest.spyOn(User, "getOneByUserId").mockRejectedValue(new Error("Unable to locate user"));

            await usersController.show(mockReq, mockRes);

            expect(User.getOneByUserId).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Unable to locate user" });
        });
    });

    describe("create", () => {
        let testUser, mockReq;

        beforeEach(() => {
            testUser = { user_id: 1, name: "New User", email: "new@user.com", password_hash: "hash" };
            mockReq = { body: testUser };
        });

        it("should create a new user and return status 201", async () => {
            jest.spyOn(User, "create").mockResolvedValue(testUser);

            await usersController.create(mockReq, mockRes);

            expect(User.create).toHaveBeenCalledWith(testUser);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(testUser);
        });

        it("should return an error of 400 if creation fails", async () => {
            jest.spyOn(User, "create").mockRejectedValue(new Error("Failed to create user"));

            await usersController.create(mockReq, mockRes);

            expect(User.create).toHaveBeenCalledWith(testUser);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "Failed to create user" });
        });
    });

    describe("update", () => {
        let testUser, updatedUser, mockReq, mockUpdate;

        beforeEach(() => {
            testUser = { user_id: 1, name: "OldUser" };
            updatedUser = { user_id: 1, name: "UpdatedUser" };
            mockReq = { body: updatedUser };

            mockUpdate = jest.fn().mockResolvedValue(updatedUser);
        });

        it("should update a user and return status 200", async () => {
            jest.spyOn(User, "getOneByUserId").mockResolvedValue({ update: mockUpdate });

            await usersController.update(mockReq, mockRes);

            expect(User.getOneByUserId).toHaveBeenCalledWith(1);
            expect(mockUpdate).toHaveBeenCalledWith(updatedUser);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(updatedUser);
        });

        it("should return an error of 404 if update fails", async () => {
            jest.spyOn(User, "getOneByUserId").mockRejectedValue(new Error("Could not find a user with that Id"));

            await usersController.update(mockReq, mockRes);

            expect(User.getOneByUserId).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Could not find a user with that Id" });
        });
    });

    describe("destroy", () => {
        let testUser, mockReq, mockDestroy;

        beforeEach(() => {
            testUser = { user_id: 1, name: "DeleteUser" };
            mockReq = { body: { user_id: testUser.user_id } };

            mockDestroy = jest.fn().mockResolvedValue({});
        });

        it("should delete a user and return status 204", async () => {
            jest.spyOn(User, "getOneByUserId").mockResolvedValue({ destroy: mockDestroy });

            await usersController.destroy(mockReq, mockRes);

            expect(User.getOneByUserId).toHaveBeenCalledWith(1);
            expect(mockDestroy).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockEnd).toHaveBeenCalled();
        });

        it("should return an error of 404 if destroy fails", async () => {
            jest.spyOn(User, "getOneByUserId").mockRejectedValue(new Error("Cannot find a user with that id"));

            await usersController.destroy(mockReq, mockRes);

            expect(User.getOneByUserId).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Cannot find a user with that id" });
        });
    });
});
