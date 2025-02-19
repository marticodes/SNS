import db from '../db.mjs';
import Reactions from '../models/reaction_model.mjs';

const ReactionDAO = {
    async getPostReactions(post_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = `
                    SELECT reaction_type, COUNT(*) AS count 
                    FROM Reactions 
                    WHERE post_id = ? 
                    GROUP BY reaction_type
                `;
                db.all(sql, [post_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const reactions = rows.map(row => [row.reaction_type, row.count]);
                        resolve(reactions);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getCommentReactions(comment_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = `
                    SELECT reaction_type, COUNT(*) AS count 
                    FROM Reactions 
                    WHERE comment_id = ? 
                    GROUP BY reaction_type
                `;
                db.all(sql, [comment_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const reactions = rows.map(row => [row.reaction_type, row.count]);
                        resolve(reactions);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getMessageReactions(chat_id, message_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = `
                    SELECT reaction_type, COUNT(*) AS count 
                    FROM Reactions 
                    WHERE message_id = ? AND chat_id = ? 
                    GROUP BY reaction_type
                `;
                db.all(sql, [message_id, chat_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const reactions = rows.map(row => [row.reaction_type, row.count]);
                        resolve(reactions);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async insertPostReaction(reaction_type, post_id, user_id, timestamp) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Reactions (reaction_type, post_id, comment_id, chat_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?,?)';
                db.run(sql, [reaction_type, post_id, 0, 0, 0, user_id, timestamp], function(err) { 
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

    async insertCommentReaction(reaction_type, comment_id, user_id, timestamp){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Reactions (reaction_type, post_id, comment_id, chat_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?,?)';
                db.run(sql, [reaction_type, 0, comment_id, 0, 0, user_id, timestamp], function(err) { 
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

    async insertMessageReaction(reaction_type, chat_id, message_id, user_id, timestamp){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Reactions (reaction_type, post_id, comment_id, chat_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?,?)';
                db.run(sql, [reaction_type, 0, 0,chat_id, message_id, user_id, timestamp], function(err) { 
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

};

export default ReactionDAO;