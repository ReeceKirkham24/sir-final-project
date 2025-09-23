const User = require('../../../models/User');
const db = require('../../../db/connect');
const bcrypt = require('bcryptjs');

describe('User', () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());

  describe('getAll', () => {
    it('resolves with users on successful db query', async () => {
      // Arrange
      const mockUsers = [
        { user_id: 1, name: 'u1', email: 'u1@test.com', org_id: 1, department_id: 1, password_hash: 'hash' },
        { user_id: 2, name: 'u2', email: 'u2@test.com', org_id: 2, department_id: 2, password_hash: 'hash' }
      ];
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockUsers });

      // Act
      const users = await User.getAll();

      // Assert
      expect(users).toHaveLength(2);
      expect(users[0]).toBeInstanceOf(User);
      expect(users[0]).toHaveProperty('name', 'u1');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM "user";');
    });

    it('should throw an Error when no users are found', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
      await expect(User.getAll()).rejects.toThrow('No users available');
    });
  });

  describe('getOneByUserId', () => {
    it('resolves with a user on successful db query', async () => {
      const mockUser = { user_id: 1, name: 'u1', email: 'u1@test.com', org_id: 1, department_id: 1, password_hash: 'hash' };
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.getOneByUserId(1);

      expect(result).toBeInstanceOf(User);
      expect(result.name).toBe('u1');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM "user" WHERE user_id = $1;', [1]);
    });

    it('should throw an Error when user not found', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
      await expect(User.getOneByUserId(99)).rejects.toThrow('Unable to locate user');
    });
  });

  describe('create', () => {
    it('resolves with a user on successful creation', async () => {
      const userData = { name: 'new', email: 'n@test.com', org_id: 1, department_id: 1, password_hash: 'hash' };
      jest.spyOn(db, 'query')
        .mockResolvedValueOnce({ rows: [] }) // no existing user
        .mockResolvedValueOnce({ rows: [{ user_id: 1, ...userData }] });

      const result = await User.create(userData);

      expect(result).toBeInstanceOf(User);
      expect(result).toHaveProperty('user_id', 1);
      expect(db.query).toHaveBeenNthCalledWith(
        1,
        'SELECT name FROM "user" WHERE LOWER(name) = LOWER($1);',
        [userData.name]
      );
      expect(db.query).toHaveBeenNthCalledWith(
        2,
        'INSERT INTO "user" (name, email, org_id, department_id, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [userData.name, userData.email, userData.org_id, userData.department_id, userData.password_hash]
      );
    });

    it('should throw an Error when user already exists', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ name: 'duplicate' }] });
      const userData = { name: 'duplicate', email: 'dup@test.com', org_id: 1, department_id: 1, password_hash: 'hash' };
      await expect(User.create(userData)).rejects.toThrow('A user with this name already exists');
    });
  });

  describe('checkUser', () => {
    it('returns true when password matches hash', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ password_hash: 'hashed' }] });
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const result = await User.checkUser('test@test.com', 'password');

      expect(result).toBe(true);
      expect(db.query).toHaveBeenCalledWith(
        `SELECT password_hash 
     FROM "user"
     WHERE email = $1;`,
        ['test@test.com']
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
    });

    it('returns false when password does not match hash', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ password_hash: 'hashed' }] });
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      const result = await User.checkUser('test@test.com', 'wrong');

      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should return the updated user on successful update', async () => {
      const user = new User({ user_id: 1, name: 'old', email: 'o@test.com', org_id: 1, department_id: 1, password_hash: 'oldhash' });
      const newData = { user_id: 1, name: 'new', email: 'n@test.com', org_id: 2, department_id: 2, password_hash: 'newhash' };
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [newData] });

      const result = await user.update(newData);

      expect(result).toBeInstanceOf(User);
      expect(result.name).toBe('new');
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE "user" SET name = COALESCE($6, name), email = COALESCE($2, email), org_id = COALESCE($3, org_id), department_id  = COALESCE($4, department_id), password_hash = COALESCE($5, password_hash)  WHERE user_id = $1 RETURNING *;',
        [newData.user_id, newData.email, newData.org_id, newData.department_id, newData.password_hash, newData.name]
      );
    });

    it('should throw an Error if update fails', async () => {
      const user = new User({ user_id: 1, name: 'old', email: 'o@test.com', org_id: 1, department_id: 1, password_hash: 'oldhash' });
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
      await expect(user.update({ user_id: 1, name: 'fail' })).rejects.toThrow('Unable to update entries');
    });
  });

  describe('destroy', () => {
    it('should return the deleted user on successful deletion', async () => {
      const user = new User({ user_id: 1, name: 'old', email: 'o@test.com', org_id: 1, department_id: 1, password_hash: 'oldhash' });
      const deletedData = { user_id: 1, name: 'deleted', email: 'd@test.com', password_hash: 'hash' };
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [deletedData] });

      const result = await user.destroy(deletedData);

      expect(result).toBeInstanceOf(User);
      expect(result.name).toBe('deleted');
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE "user" SET email = $1, password_hash = $2, name = $3 WHERE user_id = $4 RETURNING *',
        [deletedData.email, deletedData.password_hash, deletedData.name, deletedData.user_id]
      );
    });

    it('should throw an Error when destroy fails', async () => {
      const user = new User({ user_id: 1, name: 'old', email: 'o@test.com', org_id: 1, department_id: 1, password_hash: 'oldhash' });
      jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
      await expect(user.destroy({ user_id: 1, name: 'old', email: 'o@test.com', password_hash: 'hash' })).rejects.toThrow('Unable to locate user you wish to destroy');
    });
  });
});
