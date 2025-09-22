const ticketsController = require("../../../controllers/ticket");
const Ticket = require("../../../models/Tickets");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd
}));

const mockRes = { status: mockStatus };

describe("Tickets Controller", () => {
    let mockReq;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
    });

    describe("index", () => {
        it("should return all tickets with status 200", async () => {
            const tickets = [{ ticket_id: 1, text: "Test" }];
            jest.spyOn(Ticket, "getAll").mockResolvedValue(tickets);

            await ticketsController.index(mockReq, mockRes);

            expect(Ticket.getAll).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(tickets);
        });

        it("should return 500 on error", async () => {
            jest.spyOn(Ticket, "getAll").mockRejectedValue(new Error("DB error"));

            await ticketsController.index(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: "DB error" });
        });
    });

    describe("showId", () => {
        it("should return ticket with status 200", async () => {
            const ticket = { ticket_id: 1, text: "Example" };
            mockReq.params.id = "1";
            jest.spyOn(Ticket, "getOneByID").mockResolvedValue(ticket);

            await ticketsController.showId(mockReq, mockRes);

            expect(Ticket.getOneByID).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(ticket);
        });

        it("should return 404 if not found", async () => {
            mockReq.params.id = "99";
            jest.spyOn(Ticket, "getOneByID").mockRejectedValue(new Error("Not found"));

            await ticketsController.showId(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Not found" });
        });
    });

    describe("create", () => {
        it("should create a ticket and return 201", async () => {
            const newTicket = { ticket_id: 2, text: "New" };
            mockReq.body = { text: "New" };
            jest.spyOn(Ticket, "create").mockResolvedValue(newTicket);

            await ticketsController.create(mockReq, mockRes);

            expect(Ticket.create).toHaveBeenCalledWith({ text: "New" });
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(newTicket);
        });

        it("should return 400 on error", async () => {
            mockReq.body = { text: "Bad" };
            jest.spyOn(Ticket, "create").mockRejectedValue(new Error("Invalid"));

            await ticketsController.create(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: "Invalid" });
        });
    });

    describe("update", () => {
        it("should update ticket and return 200", async () => {
            const updatedTicket = { ticket_id: 1, text: "Updated" };
            const mockUpdate = jest.fn().mockResolvedValue(updatedTicket);

            mockReq.params.id = "1";
            mockReq.body = { text: "Updated" };

            jest.spyOn(Ticket, "getOneByID").mockResolvedValue({ update: mockUpdate });

            await ticketsController.update(mockReq, mockRes);

            expect(Ticket.getOneByID).toHaveBeenCalledWith(1);
            expect(mockUpdate).toHaveBeenCalledWith({ text: "Updated" });
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(updatedTicket);
        });

        it("should return 404 if update fails", async () => {
            mockReq.params.id = "1";
            jest.spyOn(Ticket, "getOneByID").mockRejectedValue(new Error("Not found"));

            await ticketsController.update(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Not found" });
        });
    });

    describe("destroy", () => {
        it("should delete a ticket and return 204", async () => {
            const mockDestroy = jest.fn().mockResolvedValue();
            mockReq.params.id = "1";
            jest.spyOn(Ticket, "getOneByID").mockResolvedValue({ destroy: mockDestroy });

            await ticketsController.destroy(mockReq, mockRes);

            expect(Ticket.getOneByID).toHaveBeenCalledWith(1);
            expect(mockDestroy).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockEnd).toHaveBeenCalled();
        });

        it("should return 404 if destroy fails", async () => {
            mockReq.params.id = "1";
            jest.spyOn(Ticket, "getOneByID").mockRejectedValue(new Error("Not found"));

            await ticketsController.destroy(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: "Not found" });
        });
    });
});
