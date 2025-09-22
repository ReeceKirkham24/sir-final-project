const db = require("../../../db/connect");
const bcrypt = require("bcryptjs");
const Organisation = require("../../../models/Organisation");

jest.mock("../../../db/connect");
jest.mock("bcryptjs");

describe("Organisation model", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getOrgById", () => {
        it("should return an organisation when found", async () => {
            const row = { org_id: 1, name: "TestOrg" };
            db.query.mockResolvedValue({ rows: [row] });

            const result = await Organisation.getOrgById(1);

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM organisation WHERE org_id = $1",
                [1]
            );
            expect(result).toBeInstanceOf(Organisation);
            expect(result.org_id).toBe(1);
        });

        it("should throw if organisation not found", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(Organisation.getOrgById(99)).rejects.toThrow(
                "Cannot find a org with that id"
            );
        });
    });

    describe("login", () => {
        const mockRow = {
            org_id: 1,
            name: "TestOrg",
            email: "org@test.com",
            password_hash: "hashed"
        };

        it("should login with correct credentials", async () => {
            db.query.mockResolvedValue({ rows: [mockRow] });
            bcrypt.compare.mockResolvedValue(true);

            const result = await Organisation.login({
                email: "org@test.com",
                password: "secret"
            });

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM organisation WHERE email = $1",
                ["org@test.com"]
            );
            expect(bcrypt.compare).toHaveBeenCalledWith("secret", "hashed");
            expect(result).toBeInstanceOf(Organisation);
            expect(result.email).toBe("org@test.com");
        });

        it("should throw if no organisation with email", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(
                Organisation.login({ email: "notfound@test.com", password: "pw" })
            ).rejects.toThrow("There is no organisation registered with this email");
        });

        it("should throw if password is incorrect", async () => {
            db.query.mockResolvedValue({ rows: [mockRow] });
            bcrypt.compare.mockResolvedValue(false);

            await expect(
                Organisation.login({ email: "org@test.com", password: "wrong" })
            ).rejects.toThrow("Incorrect sign in credentials");
        });
    });

    describe("createOrg", () => {
        it("should create an organisation", async () => {
            const orgData = {
                name: "NewOrg",
                password_hash: "hashedpw",
                is_account_active: true,
                email: "new@org.com"
            };
            db.query.mockResolvedValue({ rows: [orgData] });

            const result = await Organisation.createOrg(orgData);

            expect(db.query).toHaveBeenCalledWith(
                "INSERT INTO organisation(name, password_hash, is_account_active, email) VALUES($1, $2, $3, $4) RETURNING *",
                [
                    orgData.name,
                    orgData.password_hash,
                    orgData.is_account_active,
                    orgData.email
                ]
            );
            expect(result).toBeInstanceOf(Organisation);
            expect(result.name).toBe("NewOrg");
        });

        it("should throw if creation fails", async () => {
            db.query.mockResolvedValue({ rows: [] });

            await expect(
                Organisation.createOrg({
                    name: "FailOrg",
                    password_hash: "pw",
                    is_account_active: false,
                    email: "fail@org.com"
                })
            ).rejects.toThrow("Failed to create organisation");
        });
    });

    describe("changeOrgName", () => {
        it("should update the organisation name", async () => {
            const existing = new Organisation({ org_id: 1, name: "OldOrg" });
            const newData = { name: "UpdatedOrg", org_id: 1 };

            db.query.mockResolvedValue({ rows: [{ ...newData }] });

            const result = await existing.changeOrgName(newData);

            expect(db.query).toHaveBeenCalledWith(
                "UPDATE organisation SET name = $1 WHERE org_id = $2 RETURNING *",
                ["UpdatedOrg", 1]
            );
            expect(result).toBeInstanceOf(Organisation);
            expect(result.name).toBe("UpdatedOrg");
        });

        it("should throw if org not found", async () => {
            const existing = new Organisation({ org_id: 2, name: "DoesNotExist" });
            db.query.mockResolvedValue({ rows: [] });

            await expect(
                existing.changeOrgName({ name: "Fail", org_id: 2 })
            ).rejects.toThrow("Could not find an organisation with that Id");
        });
    });

    describe("deleteOrganisation", () => {
        it("should delete organisation", async () => {
            const existing = new Organisation({ org_id: 10 });
            db.query.mockResolvedValue({});

            await expect(existing.deleteOrganisation()).resolves.not.toThrow();
            expect(db.query).toHaveBeenCalledWith(
                "DELETE FROM organisation WHERE org_id = $1",
                [10]
            );
        });
    });
});
