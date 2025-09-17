const db = require('../db/connect')

class User {
  constructor({ user_id, name, email, org_id, department_id, password_hash }) {
    this.user_id = user_id;
    this.name = name;
    this.email = email;
    this.org_id = org_id;
    this.department_id = department_id;
    this.password_hash = password_hash;
  }

  static async getAll() {
    const response = await db.query('SELECT * FROM user;');
    if (response.rows.length === 0) {
      throw Error("No users available");
    }
    return response.rows.map((user) => new User(user));
  }

  static async getOneByUserName(userName) {
    const response = await db.query(
      'SELECT * FROM user WHERE LOWER(name) = LOWER($1);',
      [userName]
    );
    if (response.rows.length !== 1) {
      throw Error("Unable to locate user");
    }
    return new User(response.rows[0]);
  }

  static async create(data) {
    const { name, email, org_id, department_id, password_hash } = data;
    const existingUser = await db.query(
      'SELECT name FROM user WHERE LOWER(name) = LOWER($1);',
      [name]
    );
    if (existingUser.rows.length === 0) {
      let response = await db.query(
        'INSERT INTO user (name, email, org_id, department_id, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [name, email, org_id, department_id, password_hash]
      );
      return new User(response.rows[0]);
    } else {
      throw Error("A user with this name already exists");
    }
  }

  async update(data) {
    let response = await db.query(
      'UPDATE user SET email = COALESCE($2, email), org_id = COALESCE($3, org_id), department_id  = COALESCE($4, department_id), password_hash = COALESCE($5, password_hash)  WHERE name = $1 RETURNING *;',
      [
        this.name,
        data.email,
        data.org_id,
        data.department_id,
        data.password_hash
      ]
    );
    if (response.rows.length != 1) {
      throw new Error("Unable to update entries");
    }
    return new User(response.rows[0]);
  }
}

module.exports = User;
