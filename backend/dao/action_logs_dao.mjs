import db from '../db.mjs';
import ActionLogs from '../models/action_logs_model.mjs';

const ActionLogsDAO = {
    async insertActionLog(user_id, action_type, content, timestamp) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO ActionLogs (user_id, action_type, content, timestamp) VALUES (?,?,?,?)';
                db.run(sql, [user_id, action_type, content, timestamp], function(err) { 
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

    async getAllActionLogs(){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM ActionLogs ORDER BY timestamp ASC';
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const logs= rows.map(row => new ActionLogs(row.action_id, row.user_id, row.action_type, row.content, row.timestamp));
                        resolve(logs);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getUserActionLogs(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM ActionLogs WHERE user_id =? ORDER BY timestamp ASC';
                db.all(sql, [user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const logs= rows.map(row => new ActionLogs(row.action_id, row.user_id, row.action_type, row.content, row.timestamp));
                        resolve(logs);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async deleteAllActionLogs(){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ActionLogs';
            db.run(sql, [], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes > 0); 
            });
        });
    },

    async deleteUserActionLogs(user_id){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ActionLogs WHERE user_id=?';
            db.run(sql, [user_id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes > 0); 
            });
        });
    }

};

export default ActionLogsDAO;