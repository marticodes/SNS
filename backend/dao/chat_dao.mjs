import db from '../db.mjs';
import Chat from '../models/chat_model.mjs';

//When inserting, pass 0 for group_chat if DM. Otherwise, pass 1.
//DM: chat_name is id_2's user_name + chat_image is id_2's profile_picture
const ChatDAO = {
    async insertChat(user_id_1, user_id_2, group_chat, chat_name, chat_image) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Chat (user_id_1, user_id_2, group_chat, chat_name, chat_image) VALUES (?,?,?,?,?)';
                db.run(sql, [user_id_1, user_id_2, group_chat, chat_name, chat_image], function(err) {
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

    async getAllUserChats(userId) {
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
    
            db.all(sql, [userId, userId, userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const chats = rows.map(row => new Chat(row.chat_id, row.user_id_1, row.user_id_2, row.group_chat, row.chat_name, row.chat_image));
                    resolve(chats);
                }
            });
        });
    }
    


};

export default ChatDAO;