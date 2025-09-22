// Incident Reporting/server/__tests__/unit/models/tickets.test.js
const db = require("../../../db/connect");
const Ticket = require("../../../models/Tickets");

jest.mock("../../../db/connect");

describe("Ticket model", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return all tickets", async () => {
            const rows = [
                { ticket_id: 1, text: "Test 1" },
                { ticket_id: 2, text: "Test 2" }
            ];
            db.query.mockResolvedValue({ rows });

            const result = await Ticket.getAll();

            expect(db.query).toHaveBeenCalledWith("SELECT * FROM tickets;");
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Ticket);
        });

        it("should throw an error if no tickets exist", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Ticket.getAll()).rejects.toThrow("No tickets available");
        });
    });

    describe("getOneByID", () => {
        it("should return a single ticket", async () => {
            const row = { ticket_id: 1, text: "One ticket" };
            db.query.mockResolvedValue({ rows: [row] });

            const result = await Ticket.getOneByID(1);

            expect(db.query).toHaveBeenCalledWith("SELECT * FROM tickets WHERE ticket_id = $1;", [1]);
            expect(result).toBeInstanceOf(Ticket);
            expect(result.ticket_id).toBe(1);
        });

        it("should throw if no ticket found", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Ticket.getOneByID(99)).rejects.toThrow("Unable to locate ticket");
        });
    });

    describe("create", () => {
        it("should create a new ticket", async () => {
            const data = {
                status: "open",
                text: "New ticket",
                severity: "high",
                category: "bug",
                user_id: 1,
                date_created: "2025-09-22T10:00:00.000Z",
                date_completed: null
            };

            db.query
                .mockResolvedValueOnce({ rows: [{ user_id: 1 }] }) // check existing user
                .mockResolvedValueOnce({ rows: [{ ...data, ticket_id: 1 }] }); // insert ticket

            const result = await Ticket.create(data);

            expect(db.query).toHaveBeenNthCalledWith(
                1,
                'SELECT user_id FROM "user" WHERE user_id = $1;',
                [1]
            );
            expect(db.query).toHaveBeenNthCalledWith(
                2,
                'INSERT INTO tickets (status, text, severity, category, user_id, date_created, date_completed) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
                [data.status, data.text, data.severity, data.category, data.user_id, data.date_created, data.date_completed]
            );
            expect(result).toBeInstanceOf(Ticket);
            expect(result.text).toBe("New ticket");
        });

        it("should throw if user does not exist", async () => {
            db.query.mockResolvedValueOnce({ rows: [] }); // user lookup fails

            await expect(Ticket.create({ user_id: 99 })).rejects.toThrow(
                "A user with this ID does not exist"
            );
        });
    });

    describe("update", () => {
        it("should update a ticket successfully", async () => {
            const existing = new Ticket({ ticket_id: 1, text: "Old text", status: "open" });
            const data = { text: "Updated text", status: "in progress" };

            db.query.mockResolvedValueOnce({
                rows: [{ ticket_id: 1, text: "Updated text", status: "in progress" }]
            });

            const result = await existing.update(data);

            expect(db.query).toHaveBeenCalledWith(
                'UPDATE tickets SET status = $1, text = $2, severity = $3, category = $4, user_id = $5, date_created = $6, date_completed = $7 WHERE ticket_id = $8 RETURNING *;',
                [
                    "in progress",
                    "Updated text",
                    existing.severity,
                    existing.category,
                    existing.user_id,
                    existing.date_created,
                    null,
                    1
                ]
            );
            expect(result).toBeInstanceOf(Ticket);
            expect(result.text).toBe("Updated text");
        });

        it("should set date_completed if status is closed", async () => {
            const existing = new Ticket({ ticket_id: 2, text: "Close me", status: "open" });
            const data = { status: "closed" };

            db.query.mockResolvedValueOnce({
                rows: [{ ticket_id: 2, text: "Close me", status: "closed", date_completed: "some-date" }]
            });

            const result = await existing.update(data);

            expect(result.status).toBe("closed");
            expect(db.query).toHaveBeenCalled();
        });

        it("should throw if update fails", async () => {
            const existing = new Ticket({ ticket_id: 3, text: "Broken update", status: "open" });
            db.query.mockResolvedValueOnce({ rows: [] });

            await expect(existing.update({ text: "fail" })).rejects.toThrow("Unable to update ticket");
        });
    });

    describe("destroy", () => {
        it("should delete a ticket", async () => {
            const existing = new Ticket({ ticket_id: 5 });
            db.query.mockResolvedValueOnce({});

            await expect(existing.destroy()).resolves.not.toThrow();
            expect(db.query).toHaveBeenCalledWith("DELETE FROM tickets WHERE ticket_id = $1;", [5]);
        });

        it("should throw if deletion fails", async () => {
            const existing = new Ticket({ ticket_id: 6 });
            db.query.mockRejectedValueOnce(new Error("Cannot delete ticket"));

            await expect(existing.destroy()).rejects.toThrow("Cannot delete ticket");
        });
    });
});
