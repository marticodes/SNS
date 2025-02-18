import db from '../db.mjs';
import Message from '../models/chat_model.mjs';

const MessageDAO = {

    async insertMessage(chat_id, sender_id, reply_id, content, media_type, media_url, timestamp){  
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Message (chat_id, sender_id, reply_id, content, media_type, media_url, timestamp) VALUES (?,?,?,?, ?,?,?)';
                return db.run(sql, [chat_id, sender_id, reply_id, content, media_type, media_url, timestamp], function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes > 0) {
                        const id = this.lastID;  // Use this.lastID to get the inserted chat_id
                        resolve(id);
                    } else {
                        resolve(false);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getMessagesByChatId(chat_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Message WHERE chat_id = ?';
    
                db.all(sql, [chat_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const messages= rows.map(row => new Message(row.message_id, row.chat_id, row.sender_id, row.reply_id, row.content, row.media_type, row.media_url, row.timestamp));
                        resolve(messages);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getSenderByMessageId(message_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT sender_id FROM Message WHERE message_id = ?';
    
                db.get(sql, [message_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (row.length === 0) {
                        resolve([]);
                    } else {
                        resolve(row.sender_id);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

};

export default MessageDAO;