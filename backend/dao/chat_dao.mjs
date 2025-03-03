import db from '../db.mjs';
import Chat from '../models/chat_model.mjs';

//When inserting, pass 0 for group_chat if DM. Otherwise, pass 1.
//DM: chat_name is id_2's user_name + chat_image is id_2's profile_picture
const ChatDAO = {
    async insertDM(user_id_1, user_id_2, chat_name, chat_image) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Chat (user_id_1, user_id_2, group_chat, chat_name, chat_image) VALUES (?,?,?,?,?)';
                db.run(sql, [user_id_1, user_id_2, 0, chat_name, chat_image], function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes > 0) {
                        const id = this.lastID; 
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

    async insertGroupChat(user_ids, chat_name, chat_image) {
        return new Promise((resolve, reject) => {
            try {
                db.run('BEGIN TRANSACTION'); // Start a transaction
                
                // Insert into Chat table (user_id_1 and user_id_2 are NULL for group chats)
                const sqlChat = 'INSERT INTO Chat (user_id_1, user_id_2, group_chat, chat_name, chat_image) VALUES (NULL, NULL, 1, ?, ?)';
                db.run(sqlChat, [chat_name, chat_image], function (err) {
                    if (err) {
                        db.run('ROLLBACK'); // Rollback transaction if chat insert fails
                        reject(err);
                    } else {
                        const chat_id = this.lastID; // Get the newly created chat_id
                        
                        // Insert all users into GCMembership
                        const sqlMembership = 'INSERT INTO GCMembership (chat_id, user_id) VALUES ' + 
                                              user_ids.map(() => '(?, ?)').join(', ');
    
                        const membershipValues = user_ids.flatMap(user_id => [chat_id, user_id]);
    
                        db.run(sqlMembership, membershipValues, function (err) {
                            if (err) {
                                db.run('ROLLBACK'); // Rollback transaction if membership insert fails
                                reject(err);
                            } else {
                                db.run('COMMIT'); // Commit transaction if everything succeeds
                                resolve(chat_id);
                            }
                        });
                    }
                });
            } catch (error) {
                db.run('ROLLBACK'); // Ensure rollback on unexpected error
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
                ORDER BY c.chat_id DESC;
            `;
    
            db.all(sql, [user_id, user_id, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const chats = rows.map(row => new Chat(row.chat_id, row.user_id_1, row.user_id_2, row.group_chat, row.chat_name, row.chat_image));
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
                ORDER BY c.chat_id DESC;
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
                    const user = new Chat(row.chat_id, row.user_id_1, row.user_id_2, row.group_chat, row.chat_name, row.chat_image);
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
    }
    
    


};

export default ChatDAO;