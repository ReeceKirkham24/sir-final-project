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
            jest.spyOn(User, "getAll").mockResolvedValue([testUser]);

        await usersController.index(mockReq, mockRes);

        expect(User.getAll).toHaveBeenCalled;
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith([testUser]);
        })

        it("should return an Error of 500 if no users are available", async () => {
            jest.spyOn(User, "getAll").mockRejectedValue(new Error("db failure"));

            await usersController.index(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "db failure" }); 
        })

    })

})