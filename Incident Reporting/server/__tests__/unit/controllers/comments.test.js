const commentsController = require("../../../controllers/comment");
const Comment = require("../../../models/Comments");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd
}));

const mockRes = { status: mockStatus };

describe("Comments Controller", () => {
    let mockReq;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
    });

    describe("index", () => {
        it("should return all comments with status 200", async () => {
            const comments = [{ commentid: 1, body: "Test comment" }];
            jest.spyOn(Comment, "getAll").mockResolvedValue(comments);

            await commentsController.index(mockReq, mockRes);

            expect(Comment.getAll).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(comments);
        });

        it("should return 500 on error", async () => {
            jest.spyOn(Comment, "getAll").mockRejectedValue(new Error("DB error"));

            await commentsController.index(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "DB error" });
        });
    });

    describe("showId", () => {
        it("should return a comment with status 200", async () => {
            const comment = { commentid: 1, body: "Example" };
            mockReq.params.id = "1";
            jest.spyOn(Comment, "getOneByID").mockResolvedValue(comment);

            await commentsController.showId(mockReq, mockRes);

            expect(Comment.getOneByID).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(comment);
        });

        it("should return 404 if not found", async () => {
            mockReq.params.id = "99";
            jest.spyOn(Comment, "getOneByID").mockRejectedValue(new Error("Not found"));

            await commentsController.showId(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Not found" });
        });
    });

    describe("create", () => {
        it("should create a comment and return 201", async () => {
            const newComment = { commentid: 2, body: "New comment" };
            mockReq.body = { ticketid: 1, userid: 1, body: "New comment" };
            jest.spyOn(Comment, "create").mockResolvedValue(newComment);

            await commentsController.create(mockReq, mockRes);

            expect(Comment.create).toHaveBeenCalledWith(mockReq.body);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(newComment);
        });

        it("should return 400 on error", async () => {
            mockReq.body = { body: "Bad comment" };
            jest.spyOn(Comment, "create").mockRejectedValue(new Error("Invalid"));

            await commentsController.create(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "Invalid" });
        });
    });

    describe("update", () => {
        it("should update a comment and return 200", async () => {
            const updatedComment = { commentid: 1, body: "Updated" };
            const mockUpdate = jest.fn().mockResolvedValue(updatedComment);

            mockReq.params.id = "1";
            mockReq.body = { body: "Updated" };

            jest.spyOn(Comment, "getOneByID").mockResolvedValue({ update: mockUpdate });

            await commentsController.update(mockReq, mockRes);

            expect(Comment.getOneByID).toHaveBeenCalledWith(1);
            expect(mockUpdate).toHaveBeenCalledWith({ body: "Updated" });
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(updatedComment);
        });

        it("should return 404 if update fails", async () => {
            mockReq.params.id = "1";
            jest.spyOn(Comment, "getOneByID").mockRejectedValue(new Error("Not found"));

            await commentsController.update(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Not found" });
        });
    });

    describe("destroy", () => {
        it("should delete a comment and return 204", async () => {
            const mockDestroy = jest.fn().mockResolvedValue();
            mockReq.params.id = "1";
            jest.spyOn(Comment, "getOneByID").mockResolvedValue({ destroy: mockDestroy });

            await commentsController.destroy(mockReq, mockRes);

            expect(Comment.getOneByID).toHaveBeenCalledWith(1);
            expect(mockDestroy).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockEnd).toHaveBeenCalled();
        });

        it("should return 404 if destroy fails", async () => {
            mockReq.params.id = "1";
            jest.spyOn(Comment, "getOneByID").mockRejectedValue(new Error("Not found"));

            await commentsController.destroy(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Not found" });
        });
    });
});
