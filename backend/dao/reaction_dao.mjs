import db from '../db.mjs';
import Reaction from '../models/reaction_model.mjs';
import Post from '../models/post_model.mjs';
import PostDAO from './post_dao.mjs';
import CommentDAO from './comment_dao.mjs';
import MessageDAO from './message_dao.mjs';
import { check } from 'express-validator';

async function makeAPIRequest(url, method, body) {
    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed: ${response.status} - ${errorText}`);
        }
        return await response.json();

    } catch (error) {
        console.error(`Error making API request to ${url}:`, error);
        return "Error processing request.";
    }
}

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
                const sql = 'INSERT INTO Reaction (reaction_type, emote_type, post_id, comment_id, chat_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?,?,?)';
                db.run(sql, [reaction_type, emote_type, post_id, 0, 0, 0, user_id, timestamp], async function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        const id = this.lastID;
                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id, 2, `Inserted a reaction to post with id ${post_id}`, timestamp], function (log_err) {
                            if (log_err) {
                                        return reject(log_err);
                                        }
                        });
                        
                        let temp_post = await PostDAO.getPostByPostId(post_id);
                        await makeAPIRequest("http://localhost:3001/api/notifs/add", "POST", { 
                            content: temp_post.post_id,
                            notif_type: 0,
                            sender_id: user_id,
                            receiver_id: temp_post.user_id,
                            timestamp: new Date().toISOString()
                        });
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
                const sql = 'INSERT INTO Reaction (reaction_type, emote_type, post_id, comment_id, chat_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?,?,?)';
                db.run(sql, [reaction_type, emote_type, 0, comment_id, 0, 0, user_id, timestamp], async function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        const id = this.lastID;
                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id, 2, `Inserted a reaction to comment with id ${comment_id}`, timestamp], function (log_err) {
                            if (log_err) {
                                        return reject(log_err);
                                        }
                        });
                        let temp_post = await CommentDAO.getCommentByID(comment_id);
                        await makeAPIRequest("http://localhost:3001/api/notifs/add", "POST", { 
                            content: temp_post.comment_id,
                            notif_type: 1,
                            sender_id: user_id,
                            receiver_id: temp_post.user_id,
                            timestamp: new Date().toISOString()
                        });  
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
                console.log(message_id);

                const sql = 'INSERT INTO Reaction (reaction_type, emote_type, post_id, comment_id, chat_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?,?,?)';
                db.run(sql, [reaction_type, emote_type, 0, 0,chat_id, message_id, user_id, timestamp], async function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        const id = this.lastID;
                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id, 2, `Inserted a reaction to message with id ${message_id}`, timestamp], function (log_err) {
                            if (log_err) {
                                        return reject(log_err);
                                        }
                        }); 
                        let temp_post = await MessageDAO.getMessageByMessageId(message_id);
                        console.log(temp_post);
                        await makeAPIRequest("http://localhost:3001/api/notifs/add", "POST", { 
                            content: temp_post.message_id,
                            notif_type: 2,
                            sender_id: user_id,
                            receiver_id: temp_post.sender_id,
                            timestamp: new Date().toISOString()
                        }); 
                        resolve(id);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async checkReactPost(user_id, post_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = `
                    SELECT reaction_type, emote_type 
                    FROM Reaction 
                    WHERE user_id = ?
                    AND post_id = ?
                `;
    
                db.all(sql, [user_id, post_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const reactions = rows.map(row => ({
                            reaction_type: row.reaction_type, 
                            emote_type: row.emote_type
                        }));
                        resolve(reactions);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    

    async checkReactComment(user_id, comment_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = `
                    SELECT reaction_type, emote_type 
                    FROM Reaction 
                    WHERE user_id = ?
                    AND comment_id = ?
                `;
    
                db.all(sql, [user_id, comment_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const reactions = rows.map(row => ({
                            reaction_type: row.reaction_type, 
                            emote_type: row.emote_type
                        }));
                        resolve(reactions);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

    async checkReactMsg(user_id, chat_id, message_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = `
                    SELECT reaction_type, emote_type 
                    FROM Reaction 
                    WHERE user_id = ?
                    AND chat_id = ?
                    AND message_id = ?
                `;
    
                db.all(sql, [user_id, chat_id, message_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const reactions = rows.map(row => ({
                            reaction_type: row.reaction_type, 
                            emote_type: row.emote_type
                        }));
                        resolve(reactions);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    }

};

export default ReactionDAO;