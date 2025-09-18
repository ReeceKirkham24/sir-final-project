const usersController = require("../../../controllers/users");
const User = require("../../../models/User");
const { json } = require("express");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd
}));

const mockRes = { status: mockStatus }

describe("User Controller", () => {

    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe("index", () => {

        let testUser, mockReq;

        beforeEach(() => {
            testUser = [{ name: "Test Name 1"}, { name: "Test Name 2"}];
            mockReq = {};
        })
        it("should return all users and give 200 status", async () => {
            jest.spyOn(User, "getAll").mockResolvedValue(testUser);

        await usersController.index(mockReq, mockRes);

        expect(User.getAll).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(testUser);
        })

        it("should return an Error of 500 if no users are available", async () => {
            jest.spyOn(User, "getAll").mockRejectedValue(new Error("db failure"));

            await usersController.index(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "db failure" }); 
        })

    })

    describe("show", () => {

        let testUser, mockReq;

        beforeEach(() => {
            testUser = { name: "Test Name" };
            mockReq = { params: { name: "Test Name" }};
        })

        it("should return a list of users with the same name and a status code of 200", async () => {
           jest.spyOn(User, "getOneByUserName").mockResolvedValue(testUser);
           
           await usersController.show(mockReq, mockRes);

           expect(User.getOneByUserName).toHaveBeenCalled();
           expect(mockStatus).toHaveBeenCalledWith(200);
           expect(mockJson).toHaveBeenCalledWith(testUser);
        })

        it("should return an Error of 404 if no users are found with that name", async () => {
            jest.spyOn(User, "getOneByUserName").mockRejectedValue(new Error("No"));

            await usersController.show(mockReq, mockRes);

            expect(User.getOneByUserName).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "No"});
        })
    })

    describe("create", () => {
    let testUser, mockReq;

    beforeEach(() => {
        testUser = { name: "New User", email: "new@user.com" };
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
        jest.spyOn(User, "create").mockRejectedValue(new Error("User exists"));

        await usersController.create(mockReq, mockRes);

        expect(User.create).toHaveBeenCalledWith(testUser);
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: "User exists" });
    });
});

describe("update", () => {
    let testUser, updatedUser, mockReq, mockUpdate;

    beforeEach(() => {
        testUser = { name: "UpdateUser" };
        updatedUser = { ...testUser, email: "updated@email.com" };
        mockReq = { body: updatedUser };

        mockUpdate = jest.fn().mockResolvedValue(updatedUser);
    });

    it("should update a user and return status 200", async () => {
        jest.spyOn(User, "getOneByUserName").mockResolvedValue({ update: mockUpdate });

        await usersController.update(mockReq, mockRes);

        expect(User.getOneByUserName).toHaveBeenCalledWith(updatedUser.name);
        expect(mockUpdate).toHaveBeenCalledWith(updatedUser);
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(updatedUser);
    });

    it("should return an error of 404 if update fails", async () => {
        jest.spyOn(User, "getOneByUserName").mockRejectedValue(new Error("User not found"));

        await usersController.update(mockReq, mockRes);

        expect(User.getOneByUserName).toHaveBeenCalledWith(updatedUser.name);
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ error: "User not found" });
    });
});

describe("destroy", () => {
    let testUser, mockReq, mockDestroy;

    beforeEach(() => {
        testUser = { name: "DeleteUser" };
        mockReq = { params: { name: testUser.name } };

        mockDestroy = jest.fn().mockResolvedValue({});
    });

    it("should delete a user and return status 204", async () => {
        jest.spyOn(User, "getOneByUserName").mockResolvedValue({ destroy: mockDestroy });

        await usersController.destroy(mockReq, mockRes);

        expect(User.getOneByUserName).toHaveBeenCalledWith(testUser.name);
        expect(mockDestroy).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(204);
        expect(mockEnd).toHaveBeenCalled();
    });

    it("should return an error of 404 if destroy fails", async () => {
        jest.spyOn(User, "getOneByUserName").mockRejectedValue(new Error("User not found"));

        await usersController.destroy(mockReq, mockRes);

        expect(User.getOneByUserName).toHaveBeenCalledWith(testUser.name);
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ error: "User not found" });
    });
});


})