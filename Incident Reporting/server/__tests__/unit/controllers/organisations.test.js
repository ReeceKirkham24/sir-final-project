const organisationsController = require("../../../controllers/organisations");
const Organisation = require("../../../models/Organisation");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd
}));

const mockRes = { status: mockStatus };

describe("Organisations Controller", () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe("showOrg", () => {
        let testOrg, mockReq;

        beforeEach(() => {
            testOrg = { org_id: 1, name: "TestOrg" };
            mockReq = { body: { org_id: 1 } };
        });

        it("should return an organisation by ID with status 200", async () => {
            jest.spyOn(Organisation, "getOrgById").mockResolvedValue(testOrg);

            await organisationsController.showOrg(mockReq, mockRes);

            expect(Organisation.getOrgById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testOrg);
        });

        it("should return 404 if organisation not found", async () => {
            jest.spyOn(Organisation, "getOrgById").mockRejectedValue(new Error("Cannot find a org with that id"));

            await organisationsController.showOrg(mockReq, mockRes);

            expect(Organisation.getOrgById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ err: "Cannot find a org with that id" });
        });
    });

    describe("createOrg", () => {
        let testOrg, mockReq;

        beforeEach(() => {
            testOrg = { org_id: 1, name: "NewOrg", password_hash: "hash", is_account_active: true };
            mockReq = { body: testOrg };
        });

        it("should create a new organisation with status 201", async () => {
            jest.spyOn(Organisation, "createOrg").mockResolvedValue(testOrg);

            await organisationsController.createOrg(mockReq, mockRes);

            expect(Organisation.createOrg).toHaveBeenCalledWith(testOrg);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(testOrg);
        });

        it("should return 400 if organisation creation fails", async () => {
            jest.spyOn(Organisation, "createOrg").mockRejectedValue(new Error("Failed to create organisation"));

            await organisationsController.createOrg(mockReq, mockRes);

            expect(Organisation.createOrg).toHaveBeenCalledWith(testOrg);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "Failed to create organisation" });
        });
    });

    describe("updateOrg", () => {
        let testOrg, updatedOrg, mockReq, mockChangeName;

        beforeEach(() => {
            testOrg = { org_id: 1, name: "OldOrg" };
            updatedOrg = { org_id: 1, name: "UpdatedOrg" };
            mockReq = { body: updatedOrg };

            mockChangeName = jest.fn().mockResolvedValue(updatedOrg);
        });

        it("should update an organisation with status 200", async () => {
            jest.spyOn(Organisation, "getOrgById").mockResolvedValue({ changeOrgName: mockChangeName });

            await organisationsController.updateOrg(mockReq, mockRes);

            expect(Organisation.getOrgById).toHaveBeenCalledWith(1);
            expect(mockChangeName).toHaveBeenCalledWith(updatedOrg);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(updatedOrg);
        });

        it("should return 404 if update fails", async () => {
            jest.spyOn(Organisation, "getOrgById").mockRejectedValue(new Error("Could not find an organisation with that Id"));

            await organisationsController.updateOrg(mockReq, mockRes);

            expect(Organisation.getOrgById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Could not find an organisation with that Id" });
        });
    });

    describe("destroyOrg", () => {
        let testOrg, mockReq, mockDelete;

        beforeEach(() => {
            testOrg = { org_id: 1, name: "ToDeleteOrg" };
            mockReq = { body: { org_id: testOrg.org_id } };

            mockDelete = jest.fn().mockResolvedValue({});
        });

        it("should delete an organisation and return status 204", async () => {
            jest.spyOn(Organisation, "getOrgById").mockResolvedValue({ deleteOrganisation: mockDelete });

            await organisationsController.destroyOrg(mockReq, mockRes);

            expect(Organisation.getOrgById).toHaveBeenCalledWith(1);
            expect(mockDelete).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockEnd).toHaveBeenCalled();
        });

        it("should return 404 if deletion fails", async () => {
            jest.spyOn(Organisation, "getOrgById").mockRejectedValue(new Error("Cannot find a org with that id"));

            await organisationsController.destroyOrg(mockReq, mockRes);

            expect(Organisation.getOrgById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Cannot find a org with that id" });
        });
    });
});
