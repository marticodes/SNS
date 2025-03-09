import db from '../db.mjs';
import Reaction from '../models/reaction_model.mjs';

const ReactionDAO = {
    processReactions(rows) {
        const result = {
            likedUsers: [],
            emojiReactions: {},
            upvotes: 0,
            downvotes: 0,
            shares: 0
        };
    
        rows.forEach(row => {
            switch (row.reaction_type) {
                case 0: // Like
                    result.likedUsers.push(row.user_id);
                    break;
                case 1: // Upvote
                    result.upvotes++;
                    break;
                case 2: // Downvote
                    result.downvotes++;
                    break;
                case 3: // Share
                    result.shares++;
                    break;
                case 4: // Emoji Reaction
                    if (!result.emojiReactions[row.emote_type]) {
                        result.emojiReactions[row.emote_type] = [];
                    }
                    result.emojiReactions[row.emote_type].push(row.user_id);
                    break;
            }
        });
    
        // Convert emojiReactions object to an array format
        result.emojiReactions = Object.entries(result.emojiReactions).map(([emote_type, user_ids]) => ({
            emote_type,
            user_id: user_ids
        }));
    
        return result;
    },
    
    async getPostReactions(post_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = `
                    SELECT reaction_type, user_id, emote_type 
                    FROM Reaction 
                    WHERE post_id = ?
                `;
                
                db.all(sql, [post_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(ReactionDAO.processReactions(rows));
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
                    SELECT reaction_type, user_id, emote_type 
                    FROM Reaction 
                    WHERE comment_id = ?
                `;
                
                db.all(sql, [comment_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(ReactionDAO.processReactions(rows));
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
                    SELECT reaction_type, user_id, emote_type 
                    FROM Reaction 
                    WHERE chat_id = ? AND message_id = ?
                `;
                
                db.all(sql, [chat_id, message_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(ReactionDAO.processReactions(rows));
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async insertPostReaction(reaction_type, emote_type, post_id, user_id, timestamp) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Reaction (reaction_type, emote_type, post_id, comment_id, chat_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?,?)';
                db.run(sql, [reaction_type, emote_type, post_id, 0, 0, 0, user_id, timestamp], function(err) { 
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

    async insertCommentReaction(reaction_type, emote_type, comment_id, user_id, timestamp){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Reaction (reaction_type, emote_type, post_id, comment_id, chat_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?,?)';
                db.run(sql, [reaction_type, emote_type, 0, comment_id, 0, 0, user_id, timestamp], function(err) { 
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

    async insertMessageReaction(reaction_type, emote_type, chat_id, message_id, user_id, timestamp){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Reaction (reaction_type, emote_type, post_id, comment_id, chat_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?,?)';
                db.run(sql, [reaction_type, emote_type, 0, 0,chat_id, message_id, user_id, timestamp], function(err) { 
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