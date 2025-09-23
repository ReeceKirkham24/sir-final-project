const db = require("../../../db/connect");
const Comment = require("../../../models/Comments");

jest.mock("../../../db/connect");

describe("Comment model", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return all comments", async () => {
            const mockComments = [
                { comment_id: 1, ticket_id: 1, user_id: 2, body: "First comment" },
                { comment_id: 2, ticket_id: 1, user_id: 3, body: "Second comment" }
            ];
            db.query.mockResolvedValue({ rows: mockComments });

            const result = await Comment.getAll();

            expect(db.query).toHaveBeenCalledWith("SELECT * FROM comments;");
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Comment);
            expect(result[0].body).toBe("First comment");
        });

        it("should throw if no comments available", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Comment.getAll()).rejects.toThrow("No comments available");
        });
    });

    describe("getOneByID", () => {
        it("should return a comment when found", async () => {
            const row = { comment_id: 1, ticket_id: 1, user_id: 2, body: "Test comment" };
            db.query.mockResolvedValue({ rows: [row] });

            const result = await Comment.getOneByID(1);

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM comments WHERE comment_id = $1;",
                [1]
            );
            expect(result).toBeInstanceOf(Comment);
            expect(result.body).toBe("Test comment");
        });

        it("should throw if comment not found", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Comment.getOneByID(99)).rejects.toThrow("Unable to locate comment");
        });
    });

    describe("create", () => {
        it("should create a new comment when user and ticket exist", async () => {
            const data = { ticket_id: 1, user_id: 2, body: "Hello" };

            db.query
                .mockResolvedValueOnce({ rows: [{ user_id: 2 }] }) // check user
                .mockResolvedValueOnce({ rows: [{ ticket_id: 1 }] }) // check ticket
                .mockResolvedValueOnce({ rows: [{ comment_id: 10, ...data }] }); // insert

            const result = await Comment.create(data);

            expect(db.query).toHaveBeenNthCalledWith(
                1,
                'SELECT user_id FROM "user" WHERE user_id = $1;',
                [2]
            );
            expect(db.query).toHaveBeenNthCalledWith(
                2,
                "SELECT ticket_id FROM tickets WHERE ticket_id = $1;",
                [1]
            );
            expect(db.query).toHaveBeenNthCalledWith(
                3,
                "INSERT INTO comments (ticket_id, user_id, body) VALUES ($1, $2, $3) RETURNING *;",
                [1, 2, "Hello"]
            );
            expect(result).toBeInstanceOf(Comment);
            expect(result.comment_id).toBe(10);
        });

        it("should throw if user does not exist", async () => {
            db.query.mockResolvedValueOnce({ rows: [] }); // user not found

            await expect(
                Comment.create({ ticket_id: 1, user_id: 999, body: "Fail" })
            ).rejects.toThrow("A user with this ID does not exist");
        });

        it("should throw if ticket does not exist", async () => {
            db.query
                .mockResolvedValueOnce({ rows: [{ user_id: 2 }] }) // user exists
                .mockResolvedValueOnce({ rows: [] }); // ticket not found

            await expect(
                Comment.create({ ticket_id: 999, user_id: 2, body: "Fail" })
            ).rejects.toThrow("A ticket with this ID does not exist");
        });
    });

    describe("update", () => {
        it("should update a comment", async () => {
            const comment = new Comment({ comment_id: 1, ticket_id: 1, user_id: 2, body: "Old" });
            const updatedRow = { comment_id: 1, ticket_id: 1, user_id: 2, body: "New" };
            db.query.mockResolvedValue({ rows: [updatedRow] });

            const result = await comment.update({ body: "New" });

            expect(db.query).toHaveBeenCalledWith(
                "UPDATE comments SET ticket_id = $1, user_id = $2, body = $3 WHERE comment_id = $4 RETURNING *;",
                [1, 2, "New", 1]
            );
            expect(result).toBeInstanceOf(Comment);
            expect(result.body).toBe("New");
        });

        it("should throw if comment not found", async () => {
            const comment = new Comment({ comment_id: 1, ticket_id: 1, user_id: 2, body: "Old" });
            db.query.mockResolvedValue({ rows: [] });

            await expect(comment.update({ body: "Nothing" }))
                .rejects.toThrow("Unable to locate comment");
        });
    });

    describe("destroy", () => {
        it("should delete a comment", async () => {
            const comment = new Comment({ comment_id: 1, ticket_id: 1, user_id: 2, body: "Delete me" });
            db.query.mockResolvedValue({});

            await expect(comment.destroy()).resolves.not.toThrow();
            expect(db.query).toHaveBeenCalledWith(
                "DELETE FROM comments WHERE comment_id = $1;",
                [1]
            );
        });

        it("should throw if delete fails", async () => {
            const comment = new Comment({ comment_id: 1, ticket_id: 1, user_id: 2, body: "Error" });
            db.query.mockImplementation(() => { throw new Error("DB error"); });

            await expect(comment.destroy()).rejects.toThrow("Cannot delete comment");
        });
    });
});
