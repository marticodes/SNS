import db from '../db.mjs';
import Notification from '../models/notification_model.mjs';

const NotificationDAO = {
    async addNotification(content, notif_type, sender_id, receiver_id, timestamp){
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

    async getNotificationByUserId(user_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Notification WHERE user_id = ?';
                db.get(sql, [user_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (row.length === 0) {
                        resolve(false);
                    } else {
                        const notif = new Notification(row.content, row.notif_type, row.sender_id, row.receiver_id, row.timestamp);
                        resolve(notif);
                    }
                });
            } catch (error) {
                reject(error);
            }
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

    async removeNotification(notif_id){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM Notification WHERE notif_id=?';
            db.run(sql, [notif_id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes > 0); 
            });
        });

    }

};

export default NotificationDAO;