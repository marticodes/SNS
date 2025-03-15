import db from "../db.mjs";

const RequestDAO = {
    async getRequests(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT user_id_1 FROM FriendRequest WHERE user_id_2=?';
                db.all(sql, [user_id], (err, rows) => {
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

    async addRequest(user_id_1, user_id_2) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO FriendRequest (user_id_1, user_id_2) VALUES (?,?)';
                db.run(sql, [user_id_1, user_id_2], function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        const id = this.lastID; 
                        const timestamp = new Date().toISOString();
                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id_1,5, `Sent a friend request to user ${user_id_2}`, timestamp], function (log_err) {
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

    async deleteRequest(user_id_1, user_id_2){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM FriendRequest WHERE user_id_1=? AND user_id_2=?';
            db.run(sql, [user_id_1, user_id_2], function (err) {
                if (err) {
                    return reject(err);
                }
                const timestamp = new Date().toISOString();
                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id_1, 5, `Deleted friend request to user ${user_id_2}`, timestamp], function (log_err) {
                            if (log_err) {
                                return reject(log_err);
                            }
                        });
                resolve(this.changes > 0); 
            });
        });
    },

};

export default RequestDAO;