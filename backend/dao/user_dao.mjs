import db from '../db.mjs';
import User from '../models/user_model.mjs';

const UserDAO = {

    async getUserInfo(user_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM User WHERE user_id = ?';
                db.get(sql, [user_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(false);
                    } else {
                        const user = new User(row.user_id, row.id_name, row.user_name, row.email, row.password, row.user_bio, row.profile_picture, row.status, row.visibility, row.activity_level);
                        resolve(user);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getActiveUsers() {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT user_id FROM User WHERE status = ?';
                db.all(sql, [1], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve(false);
                    } else {
                        const user_ids = rows.map(row => row.user_id);
                        resolve(user_ids);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getActiveUsersInfo() {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM User WHERE status = ?';
                db.all(sql, [1], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve(false);
                    } else {
                        const users = rows.map(row => new User(row.user_id, row.id_name, row.user_name, row.email, row.password, row.user_bio, row.profile_picture, row.status, row.visibility, row.activity_level));
                        resolve(users);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getActivityLevel(user_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT activity_level FROM User WHERE user_id = ?';
                db.get(sql, [user_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(false);
                    } else {
                        const activity_level = row.activity_level;
                        resolve(activity_level);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async isActiveUser(user_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT status FROM User WHERE user_id = ?';
                db.get(sql, [user_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(false);
                    } else {
                        const status = row.status;
                        resolve(status);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async updateUserStatus(user_id, status){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE User SET status=? WHERE user_id=?';
                db.run(sql, [status, user_id], function (err) {
                    if (err) {
                    reject(err);
                    }else {
                    resolve(this.changes > 0); 
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async insertUser(id_name, user_name, email, password, user_bio, profile_picture) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO User (id_name, user_name, email, password, user_bio, profile_picture, status, visibility, activity_level) VALUES (?,?,?,?,?,?,?,?,?)';
                db.run(sql, [id_name, user_name, email, password, user_bio, profile_picture, 1, 1, 7], function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        const id = this.lastID; 
                        resolve(id);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },


    async updateProfilePicture(user_id, profile_picture) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE User SET profile_picture=? WHERE user_id=?';
                db.run(sql, [profile_picture, user_id], function (err) {
                    if (err) {
                      reject(err);
                    }else {
                      resolve(this.changes > 0);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },


    async removeProfilePicture(user_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE User SET profile_picture=? WHERE user_id=?';
                db.run(sql, [null, user_id], function (err) {
                    if (err) {
                      reject(err);
                    }else {
                      resolve(this.changes > 0); 
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async checkCredentials(id_name, password) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT user_id FROM User WHERE id_name=? AND password=?';

            try {
                db.get(query, [id_name, password], (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    if (row === undefined) {
                        resolve(false);
                    } else {
                        resolve(row.user_id);
                    }
                });
            } catch (err) { reject({ error: err.message }) }

        });
    },


    async updateUserBio(user_id, user_bio) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE User SET user_bio=? WHERE user_id=?';
                db.run(sql, [user_bio, user_id], function (err) {
                    if (err) {
                      reject(err);
                    }else {
                      resolve(this.changes > 0);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async updateUserEmail(user_id, email) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE User SET email=? WHERE user_id=?';
                db.run(sql, [email, user_id], function (err) {
                    if (err) {
                      reject(err);
                    }else {
                      resolve(this.changes > 0);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async updateUserPassword(user_id, password) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE User SET password=? WHERE user_id=?';
                db.run(sql, [password, user_id], function (err) {
                    if (err) {
                      reject(err);
                    }else {
                      resolve(this.changes > 0);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async updateAccountVisibility(user_id, visibility) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE User SET visibility=? WHERE user_id=?';
                db.run(sql, [visibility, user_id], function (err) {
                    if (err) {
                      reject(err);
                    }else {
                      resolve(this.changes > 0);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

};

export default UserDAO;