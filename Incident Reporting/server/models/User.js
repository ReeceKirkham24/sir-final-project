// const db = require("../db/") -------------------------------

const { response } = require("../app");

class User {
  constructor({ User_Id, Name, Email, Org_Id, Department_Id, Password_Hash }) {
    (this.User_Id = User_Id),
      (this.Name = Name),
      (this.Email = Email),
      (this.Org_Id = Org_Id),
      (this.Department_Id = Department_Id),
      (this.Password_Hash = Password_Hash);
  }

  static async getAll() {
    const response = await db.query("SELECT name FROM users;");
    if (response.rows.length === 0) {
      throw Error("No users available");
    }
    return response.rows.map((user) => new User(user));
  }

  static async getOneByUserName(userName) {
    const response = await db.query(
      "SELECT * FROM users WHERE LOWER(name) = LOWER($1);",
      [userName]
    );
    if (response.rows.length !== 1) {
      throw Error("Unable to locate user");
    }
    return new User(response.rows[0]);
  }

  static async create(data) {
    const { User_Id, Name, Email, Org_Id, Department_Id, Password_Hash } = data;
    const existingUser = await db.query(
      "SELECT name FROM user WHERE LOWER(name) = LOWER($1);",
      [Name]
    );

    if (existingUser.rows.length === 0) {
      let response = await db.query(
        "INSERT INTO user (Name, Email, Org_Id, Department_Id, Password_Hash) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [Name, Email, Org_Id, Department_Id, Password_Hash]
      );
      return new User(response.rows[0]);
    } else {
      throw Error("A user with this name already exists");
    }
  }

  async update(data) {
    let response = await db.query(
      "UPDATE user SET EMAIL = COALESCE($2, Email), Org_Id = COALESCE($3, Org_Id), Department_Id  = COALESCE($4, Department_Id), Password_Hash = COALESCE($5, Password_Hash)  WHERE name = $1 RETURNING Name, Email, Org_Id, Department_Id, Password_Hash;",
      [
        this.Name,
        data.Email,
        data.Org_Id,
        data.Department_Id,
        data.Password_Hash
      ]
    );
    if (response.rows.length != 1) {
      throw new Error("Unable to update entries");
    }
    return new User(response.rows[0]);
  }
}

module.exports = User;
