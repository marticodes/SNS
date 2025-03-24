import db from '../db.mjs';
import Relations from '../models/relation_model.mjs'

const RelationDAO = {
    async getUsersByRelation(user_id, relation_type){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT user_id_2 FROM Relations WHERE user_id_1=? AND relation_type=?';
                db.all(sql, [user_id, relation_type], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const user_ids = rows.map(row => row.user_id_2);
                        resolve(user_ids);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

    async getUsersWithRelation(user_id, relation_type){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT user_id_1 FROM Relations WHERE user_id_2=? AND relation_type=?';
                db.all(sql, [user_id, relation_type], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const user_ids = rows.map(row => row.user_id_1);
                        resolve(user_ids);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

    async getRelation(user_id_1, user_id_2){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Relations WHERE user_id_1 = ? AND user_id_2 = ?';
                db.get(sql, [user_id_1, user_id_2], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve("No relation exists between users");
                    } else {
                        const user = new Relations(row.relation_id, row.user_id_1, row.user_id_2, row.relation_type, row.restricted, row.closeness);
                        resolve(user);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

    async getRestrictedUsers(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT user_id_2 FROM Relations WHERE user_id_1=? AND restricted=?';
                db.all(sql, [user_id, 1], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const user_ids = rows.map(row => row.user_id_2);
                        resolve(user_ids);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async addRelation(user_id_1, user_id_2, relation_type, restricted, closeness) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Relations (user_id_1, user_id_2, relation_type, restricted, closeness) VALUES (?,?,?,?,?)';
                db.run(sql, [user_id_1, user_id_2, relation_type, restricted, closeness], function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        const id = this.lastID;
                        const timestamp = new Date().toISOString();

                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id_1, 5, `Started relation type ${relation_type} with user ${user_id_2}`, timestamp], function (log_err) {
                            if (log_err) {
                                        return reject(log_err);
                                        }
                        });  
                        resolve(id);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async updateRelation(user_id_1, user_id_2, relation_type){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE Relations SET relation_type=? WHERE user_id_1 = ? AND user_id_2=?';
                db.run(sql, [relation_type, user_id_1, user_id_2], function (err) {
                    if (err) {
                      reject(err);
                    }else {
                        const timestamp = new Date().toISOString();

                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id_1, 5, `Updated relation type to ${relation_type} with user ${user_id_2}`, timestamp], function (log_err) {
                            if (log_err) {
                                        return reject(log_err);
                                        }
                        });    
                      resolve(this.changes > 0);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async updateRestriction(user_id_1, user_id_2, restricted){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE Relations SET restricted=? WHERE user_id_1=? AND user_id_2=?';
                db.run(sql, [restricted, user_id_1, user_id_2], function (err) {
                    if (err) {
                      reject(err);
                    }else {
                        const timestamp = new Date().toISOString();

                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id_1, 5, `Updated restriction with user ${user_id_2}`, timestamp], function (log_err) {
                            if (log_err) {
                                        return reject(log_err);
                                        }
                        });  
                      resolve(this.changes > 0);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getMutualFollowers(user_id_1, user_id_2,){
        return new Promise((resolve, reject) => {
            try {
                const sql = `
                SELECT r1.user_id_2
                FROM Relations r1
                JOIN Relations r2 ON r1.user_id_2 = r2.user_id_2
                WHERE 
                    r1.user_id_1 = ? 
                    AND r2.user_id_1 = ? 
                    AND r1.relation_type IN (0, 1, 2) 
                    AND r2.relation_type IN (0, 1, 2);
            `;
            db.all(sql, [user_id_1, user_id_2], (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    resolve(false);
                } else {
                    resolve(rows.map(row => row.user_id_2))
                }
            });
        } catch (error) {
            reject(error);
        }
    });
    },

    async deleteRelation(user_id_1, user_id_2){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Relations WHERE user_id_1=? AND user_id_2=?';
            db.run(sql, [user_id_1, user_id_2], function (err) {
                if (err) {
                    return reject(err);
                }
                const timestamp = new Date().toISOString();

                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id_1, 5, `Deleted relation with user ${user_id_2}`, timestamp], function (log_err) {
                            if (log_err) {
                                        return reject(log_err);
                                        }
                        });  
                resolve(this.changes > 0); 
            });
        });
    },

    async getCloseness(user_id_1, user_id_2){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT closeness FROM Relations WHERE user_id_1 = ? AND user_id_2 = ?';
                db.get(sql, [user_id_1, user_id_2], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve("No relation exists between users");
                    } else {
                        const closeness = row.closeness;
                        resolve(closeness);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

    async getRecommendedFriends(user_id){

        return new Promise((resolve, reject) => {
            const sql = `
                SELECT DISTINCT ui.user_id
                FROM UserInterest ui
                WHERE ui.interest_name = (
                    SELECT interest_name
                    FROM UserInterest
                    WHERE user_id = ?
                )
                AND ui.user_id != ?

                UNION

                SELECT DISTINCT p.user_id
                FROM Post p
                WHERE p.topic = (
                    SELECT interest_name
                    FROM UserInterest
                    WHERE user_id = ?
                )
                AND p.user_id != ?;

            `;
    
            db.all(sql, [user_id, user_id, user_id, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const users= rows.map(row => row.user_id);
                    resolve(users);
                }
            });
        });

    },

};

export default RelationDAO;
