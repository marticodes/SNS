import db from '../db.mjs';
import Notification from '../models/notification_model.mjs';

const NotificationDAO = {
    async addSingularNotification(content, notif_type, sender_id, receiver_id, timestamp){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Notification (content, notif_type, sender_id, receiver_id, timestamp) VALUES (?,?,?,?,?)';
                db.run(sql, [content, notif_type, sender_id, receiver_id, timestamp], function(err) { 
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

    async addGroupNotification(){

    },

    async getNotificationByUserId(user_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Notification WHERE receiver_id = ?';
                db.all(sql, [user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve(false);
                    } else {
                        const notifs = rows.map(row => new Notification(row.notif_id, row.content, row.notif_type, row.sender_id, row.receiver_id, row.timestamp));
                        resolve(notifs);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async  getSpecificNotification(sender_id, notif_type, receiver_id) {
        const sql = 'SELECT notif_id FROM Notification WHERE sender_id = ? AND notif_type = ? AND receiver_id = ?';
    
        return new Promise((resolve, reject) => {
            db.all(sql, [sender_id, notif_type, receiver_id], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows.length > 0 ? rows.map(row => row.notif_id) : false);
            });
        });
    },
    
    async getNotificationByType(notif_type, receiver_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Notification WHERE notif_type = ? AND receiver_id=?';
                db.all(sql, [notif_type, receiver_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve(false);
                    } else {
                        const notifs = rows.map(row =>new Notification(row.notif_id,row.content, row.notif_type, row.sender_id, row.receiver_id, row.timestamp));
                        resolve(notifs);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

    async removeNotification(notif_id, user_id = 0){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Notification WHERE notif_id=?';
            db.run(sql, [notif_id], function (err) {
                if (err) {
                    return reject(err);
                }
                //TODO
                const timestamp = new Date().toISOString();
                const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                                db.run(log_sql, [ user_id , 1, `Removed notification with id ${notif_id}`, timestamp], function (log_err) {
                                    if (log_err) {
                                        return reject(log_err);
                                    }
                                });
                resolve(this.changes > 0); 
            });
        });

    }

};

export default NotificationDAO;