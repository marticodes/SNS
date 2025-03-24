import db from '../db.mjs';
import Message from '../models/message_model.mjs';

const MessageDAO = {

    async insertMessage(chat_id, sender_id, reply_id, content, media_type, media_url, timestamp) {
        try {
            // Get chat details
            const chatQuery = 'SELECT user_id_1, user_id_2, group_chat FROM Chat WHERE chat_id = ?';
            const chat = await new Promise((resolve, reject) => {
                db.get(chatQuery, [chat_id], (err, chat) => {
                    if (err) return reject(err);
                    if (!chat) return reject(new Error('Chat not found'));
                    resolve(chat);
                });
            });
    
            let receiver_ids = [];
    
            if (chat.group_chat === 0) {
                // Private chat: Determine receiver_id
                const receiver_id = (chat.user_id_1 === sender_id) ? chat.user_id_2 : chat.user_id_1;
                receiver_ids = [receiver_id]; 
            } else {
                // Group chat: Get all members except sender
                const groupQuery = 'SELECT user_id FROM GCMembership WHERE chat_id = ? AND user_id != ?';
                const members = await new Promise((resolve, reject) => {
                    db.all(groupQuery, [chat_id, sender_id], (err, members) => {
                        if (err) return reject(err);
                        resolve(members);
                    });
                });
                receiver_ids = members.map(member => member.user_id);
            }
    
            // Insert message
            const messageQuery = `
                INSERT INTO Message (chat_id, sender_id, reply_id, content, media_type, media_url, timestamp) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const message_id = await new Promise((resolve, reject) => {
                db.run(messageQuery, [chat_id, sender_id, reply_id, content, media_type, media_url, timestamp], function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID); // Get inserted message ID
                });
            });

            //Update chat time
            await new Promise((resolve, reject) => { 
                const chatTimeUpdate = 'UPDATE Chat SET timestamp=? WHERE chat_id=?';
                db.run(chatTimeUpdate, [timestamp, chat_id], function (err) {
                    if (err) return reject(err);
                    resolve(this.changes > 0); 
                });
            });
    
            // Insert read receipts for all receivers
            const receiptQuery = 'INSERT INTO ReadReceipts (chat_id, user_id) VALUES (?, ?)';
            const insertReceipts = receiver_ids.map(user_id => {
                return new Promise((resolve, reject) => {
                    db.run(receiptQuery, [chat_id, user_id], function(err) {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });

            const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
            db.run(log_sql, [ sender_id, 3, `Sent a Message "${content}"`, timestamp], function (log_err) {
                if (log_err) {
                              return reject(log_err);
                            }
            });          
    
            await Promise.all(insertReceipts);
            return message_id;
    
        } catch (error) {
            throw error;
        }
    },
    
    

    async getMessagesByChatId(chat_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Message WHERE chat_id = ? ORDER BY timestamp ASC';
    
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

    async getMessageContentByChatId(chat_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT content FROM Message WHERE chat_id = ? ORDER BY timestamp ASC';
    
                db.all(sql, [chat_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const messages= rows.map(row => row.content);
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

    async getMessageByMessageId(message_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Message WHERE message_id = ?';
    
                db.get(sql, [message_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve([]);
                    } else {
                        resolve(new Message(row.message_id, row.chat_id, row.sender_id, row.reply_id, row.content, row.media_type, row.media_url, row.timestamp));
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

};

export default MessageDAO;