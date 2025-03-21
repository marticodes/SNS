import db from '../db.mjs';
import Chat from '../models/chat_model.mjs';

//When inserting, pass 0 for group_chat if DM. Otherwise, pass 1.
//DM: chat_name is id_2's user_name + chat_image is id_2's profile_picture
const ChatDAO = {
    async insertDM(user_id_1, user_id_2, chat_name, chat_image) {
        return new Promise((resolve, reject) => {
            try {
                const timestamp = new Date().toISOString();
                const sql = 'INSERT INTO Chat (user_id_1, user_id_2, group_chat, chat_name, chat_image, timestamp) VALUES (?,?,?,?,?,?)';
                db.run(sql, [user_id_1, user_id_2, 0, chat_name, chat_image, timestamp], function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes > 0) {
                        const id = this.lastID;
                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [user_id_1, 3, `Created DM with user ${user_id_2}`, timestamp], function (log_err) {
                            if (log_err) {
                                return reject(log_err);
                            }
                        }); 
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

    async updateChatTime(chat_id, timestamp){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE Chat SET timestamp=? WHERE chat_id=?';
                db.run(sql, [timestamp, chat_id], function (err) {
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

    async insertGroupChat(user_ids, chat_name, chat_image, creator = 0) {
        return new Promise((resolve, reject) => {
            try {
                db.run('BEGIN TRANSACTION');
                const timestamp = new Date().toISOString();
                // Insert into Chat table (user_id_1 and user_id_2 are NULL for group chats)
                const sqlChat = 'INSERT INTO Chat (user_id_1, user_id_2, group_chat, chat_name, chat_image, timestamp) VALUES (NULL, NULL, 1, ?, ?, ?)';
                db.run(sqlChat, [chat_name, chat_image, timestamp], function (err) {
                    if (err) {
                        db.run('ROLLBACK'); 
                        reject(err);
                    } else {
                        const chat_id = this.lastID; 
                        
                        // Insert all users into GCMembership
                        const sqlMembership = 'INSERT INTO GCMembership (chat_id, user_id) VALUES ' + 
                                              user_ids.map(() => '(?, ?)').join(', ');
    
                        const membershipValues = user_ids.flatMap(user_id => [chat_id, user_id]);
    
                        db.run(sqlMembership, membershipValues, function (err) {
                            if (err) {
                                db.run('ROLLBACK'); 
                                reject(err);
                            } else {
                                db.run('COMMIT'); 
                                resolve(chat_id);
                            }
                        });

                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [creator, 3, `Created group chat with name ${chat_name}`, timestamp], function (log_err) {
                            if (log_err) {
                                return reject(log_err);
                            }
                        });
                    }
                });
            } catch (error) {
                db.run('ROLLBACK'); 
                reject(error);
            }
        });
    },

    async getChatMembers(chat_id){
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT user_id
                FROM GCMembership
                WHERE chat_id = ?
            `;
    
            db.all(sql, [chat_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const mems = rows.map(row => row.user_id);
                    resolve(mems);
                }
            });
        });

    },
    

    async getAllUserChats(user_id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT c.*
                FROM Chat c
                LEFT JOIN GCMembership gcm ON c.chat_id = gcm.chat_id
                WHERE 
                    (c.group_chat = 0 AND (c.user_id_1 = ? OR c.user_id_2 = ?)) 
                    OR 
                    (c.group_chat = 1 AND gcm.user_id = ?)
                ORDER BY c.timestamp DESC;
            `;
    
            db.all(sql, [user_id, user_id, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const chats = rows.map(row => new Chat(row.chat_id, row.user_id_1, row.user_id_2, row.group_chat, row.chat_name, row.chat_image, row.timestamp));
                    resolve(chats);
                }
            });
        });
    },

    async getAllChatIds(user_id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT c.chat_id
                FROM Chat c
                LEFT JOIN GCMembership gcm ON c.chat_id = gcm.chat_id
                WHERE 
                    (c.group_chat = 0 AND (c.user_id_1 = ? OR c.user_id_2 = ?)) 
                    OR 
                    (c.group_chat = 1 AND gcm.user_id = ?)
                ORDER BY c.timestamp DESC;
            `;
    
            db.all(sql, [user_id, user_id, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const chats = rows.map(row => row.chat_id);
                    resolve(chats);
                }
            });
        });
    },

    async getChatFromChatId(chat_id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT c.*
                FROM Chat c
                WHERE chat_id = ?;
            `;
    
            db.get(sql, [chat_id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(false);
                } else {
                    const user = new Chat(row.chat_id, row.user_id_1, row.user_id_2, row.group_chat, row.chat_name, row.chat_image, row.timestamp);
                    resolve(user);
                }
            });
        });
    },

    async checkExistingChat(user_id_1, user_id_2) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * 
                FROM Chat 
                WHERE 
                    (user_id_1 = ? AND user_id_2 = ?) 
                    OR (user_id_1 = ? AND user_id_2 = ?)
                    AND group_chat = 0;
            `;
    
            db.get(sql, [user_id_1, user_id_2, user_id_2, user_id_1], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    },

    async isExistingChat(user_id_1, user_id_2) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT chat_id 
                FROM Chat 
                WHERE 
                    (user_id_1 = ? AND user_id_2 = ?) 
                    OR (user_id_1 = ? AND user_id_2 = ?)
                    AND group_chat = 0;
            `;
    
            db.get(sql, [user_id_1, user_id_2, user_id_2, user_id_1], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.chat_id : 0);
                }
            });
        });
    },

    async deleteChat() {
        return new Promise((resolve, reject) => {
            const fetchChatIdsSql = 'SELECT chat_id FROM Chat';
    
            db.all(fetchChatIdsSql, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
    
                if (rows.length === 0) {
                    return resolve(false);
                }
    
                let deletedChats = 0;
                let totalChats = rows.length;
    
                rows.forEach((row) => {
                    const chat_id = row.chat_id;
    
                    const checkMessagesSql = 'SELECT COUNT(*) AS message_count FROM Message WHERE chat_id = ?';
                    db.get(checkMessagesSql, [chat_id], (err, msgRow) => {
                        if (err) {
                            return reject(err);
                        }
    
                        if (msgRow.message_count === 0) {
                            const deleteChatSql = 'DELETE FROM Chat WHERE chat_id = ?';
                            db.run(deleteChatSql, [chat_id], function (err) {
                                if (err) {
                                    return reject(err);
                                }
                                if (this.changes > 0) {
                                    deletedChats++;
                                }
                                if (--totalChats === 0) {
                                    resolve(deletedChats > 0);
                                }
                            });
                        } else {
                            if (--totalChats === 0) {
                                resolve(deletedChats > 0);
                            }
                        }
                    });
                });
            });
        });
    }

};

export default ChatDAO;