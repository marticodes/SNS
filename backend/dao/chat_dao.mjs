import db from '../db.mjs';
import Chat from '../models/chat_model.mjs';
import GCMembership from '../models/gc_membership_model.mjs';

//When inserting, pass 0 for group_chat if DM. Otherwise, pass 1.
//DM: chat_name is id_2's user_name + chat_image is id_2's profile_picture
const ChatDAO = {
    async insertDM(user_id_1, user_id_2, chat_name, chat_image, duration = 0) {
        return new Promise((resolve, reject) => {
            try {
                const timestamp = new Date().toISOString();
                const sql = 'INSERT INTO Chat (user_id_1, user_id_2, group_chat, chat_name, chat_image, timestamp, duration) VALUES (?,?,?,?,?,?,?)';
                db.run(sql, [user_id_1, user_id_2, 0, chat_name, chat_image, timestamp, duration], function(err) {
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

    async insertGroupChat(user_ids, chat_name, chat_image, creator = 0, duration = 0) {
        if (user_ids.length > 10) {
            return reject("Cannot add more than 10 participants to the group chat.");
        }

        return new Promise((resolve, reject) => {
            // db.serialize()를 사용하여 쿼리들이 순차적으로 실행되도록 보장
            db.serialize(() => {
                db.run('BEGIN TRANSACTION', (err) => {
                    if (err) {
                        return reject(err);
                    }
                });

                const timestamp = new Date().toISOString();
                
                try {
                    // Insert into Chat table
                    db.run(
                        'INSERT INTO Chat (user_id_1, user_id_2, group_chat, chat_name, chat_image, timestamp, duration) VALUES (NULL, NULL, 1, ?, ?, ?, ?)',
                        [chat_name, chat_image, timestamp, duration],
                        function (err) {
                            if (err) {
                                return db.run('ROLLBACK', () => reject(err));
                            }

                            const chat_id = this.lastID;

                            // Insert all users into GCMembership
                            const sqlMembership = 'INSERT INTO GCMembership (chat_id, user_id) VALUES ' + 
                                user_ids.map(() => '(?, ?)').join(', ');
                            const membershipValues = user_ids.flatMap(user_id => [chat_id, user_id]);

                            db.run(sqlMembership, membershipValues, (err) => {
                                if (err) {
                                    return db.run('ROLLBACK', () => reject(err));
                                }

                                // Insert action log
                                const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                                
                                db.run(log_sql, 
                                    [creator, 3, `Created group chat with name ${chat_name}`, timestamp], 
                                    (err) => {
                                        if (err) {
                                            return db.run('ROLLBACK', () => reject(err));
                                        }

                                        // 모든 작업이 성공적으로 완료되면 커밋
                                        db.run('COMMIT', (err) => {
                                            if (err) {
                                                return db.run('ROLLBACK', () => reject(err));
                                            }
                                            resolve(chat_id);
                                        });
                                    }
                                );
                            });
                        }
                    );
                } catch (error) {
                    db.run('ROLLBACK', () => reject(error));
                }
            });
        });
    },

    async getChatMembers(chat_id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT group_chat, user_id_1, user_id_2 
                FROM Chat 
                WHERE chat_id = ?
            `;
    
            db.get(sql, [chat_id], (err, chat) => {
                if (err) {
                    reject(err);
                } else if (!chat) {
                    resolve([]); // Return empty array if chat_id is not found
                } else if (chat.group_chat === 0) {
                    resolve([chat.user_id_1, chat.user_id_2]); // Return single-element array for non-group chat
                } else {
                    const gcSql = `
                        SELECT user_id
                        FROM GCMembership
                        WHERE chat_id = ?
                    `;
    
                    db.all(gcSql, [chat_id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            const members = rows.map(row => row.user_id);
                            resolve(members);
                        }
                    });
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
                    const chats = rows.map(row => new Chat(row.chat_id, row.user_id_1, row.user_id_2, row.group_chat, row.chat_name, row.chat_image, row.timestamp, row.duration));
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
                    c.user_id_1 = ? OR c.user_id_2 = ?
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
                    const user = new Chat(row.chat_id, row.user_id_1, row.user_id_2, row.group_chat, row.chat_name, row.chat_image, row.timestamp, row.duration);
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
                    ((user_id_1 = ? AND user_id_2 = ?)  
                    OR (user_id_1 = ? AND user_id_2 = ?))  
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

    async getChatsHelper(user_ids) {
        if (!user_ids || user_ids.length === 0) return [];
    
        const placeholders = user_ids.map(() => "?").join(","); 
        const sql = `SELECT chat_id, user_id FROM GCMembership WHERE user_id IN (${placeholders})`;
    
        try {
            const rows = await new Promise((resolve, reject) => {
                db.all(sql, user_ids, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            return rows; 
        } catch (error) {
            console.error("Error fetching chat memberships:", error);
            return [];
        }
    },
    

    async checkExistingGroupChat(user_ids) {
        try {
            const chatMemberships = await ChatDAO.getChatsHelper(user_ids);
            
            const chatGroups = new Map(); 
            
            chatMemberships.forEach(({ chat_id, user_id }) => {
                if (!chatGroups.has(chat_id)) {
                    chatGroups.set(chat_id, new Set());
                }
                chatGroups.get(chat_id).add(user_id);
            });
    
            for (const [chat_id, members] of chatGroups) {
                let size = await ChatDAO.getChatMembers(chat_id);
                if (size.length === user_ids.length) {
                    const membersArray = Array.from(members);
                    if (
                        membersArray.every(id => user_ids.includes(id)) &&
                        user_ids.every(id => membersArray.includes(id))

                    ) {
                        return chat_id;
                    }
                }
            }
    
            return 0; 
        } catch (error) {
            console.error("Error checking existing group chat:", error);
            return 0;
        }
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
    async getAllGroupChats() {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM Chat WHERE group_chat = 1';
          db.all(sql, [], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              // Optionally, map rows to Chat objects if needed
              const chats = rows.map(row => new Chat(
                row.chat_id,
                row.user_id_1,
                row.user_id_2,
                row.group_chat,
                row.chat_name,
                row.chat_image,
                row.timestamp
              ));
              resolve(chats);
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
    },

    async isEphemeralChat(chat_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT duration FROM Chat WHERE chat_id = ?';
                db.get(sql, [chat_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(false);
                    } else {
                        resolve(row?.duration === 1);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getTotalNumberOfChats() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS total_chats FROM Chat';
            db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row.total_chats);   
            });
        });
    }
};

export default ChatDAO;