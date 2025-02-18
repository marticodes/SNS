import db from '../db.mjs';

const RelationDAO = {
    async getUsersByRelation(user_id, relation_type){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT user_id_2 FROM Relation WHERE user_id_1=? AND relation_type=?';
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

    async getRestrictedUsers(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT user_id_2 FROM Relation WHERE user_id_1=? AND restricted=?';
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

    async addRelation(user_id_1, user_id_2, relation_type, restricted) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Relation (user_id_1, user_id_2, relation_type, restricted) VALUES (?,?,?,?)';
                db.run(sql, [user_id_1, user_id_2, relation_type, restricted], function(err) { 
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

    async updateRelation(user_id_1, user_id_2, relation_type){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE Relation SET relation_type=? WHERE user_id_1 = ? AND user_id_2=?';
                db.run(sql, [relation_type, user_id_1, user_id_2], function (err) {
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

    async updateRestriction(user_id_1, user_id_2, restricted){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE Relation SET restricted=? WHERE user_id_1=? AND user_id_2=?';
                db.run(sql, [restricted, user_id_1, user_id_2], function (err) {
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

    async getMutualFollowers(user_id_1, user_id_2,){
        return new Promise((resolve, reject) => {
            try {
                const sql = `
                SELECT r1.user_id_2
                FROM Relation r1
                JOIN Relation r2 ON r1.user_id_2 = r2.user_id_2
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
                    resolve([]);
                } else {
                    resolve(rows.map(row => row.user_id_2))
                }
            });
        } catch (error) {
            reject(error);
        }
    });
    },

};

export default RelationDAO;
