import db from '../db.mjs';
import Reaction from '../models/reaction_model.mjs';

const ReactionDAO = {
    async getPostReactions(post_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Reaction WHERE post_id=?';
                db.all(sql, [post_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const reactions= rows.map(row => new Reaction(row.reaction_id, row.reaction_type, row.post_id, row.comment_id, row.message_id, row.user_id, row.timestamp));
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
                const sql = 'SELECT * FROM Reaction WHERE comment_id=?';
                db.all(sql, [comment_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const reactions= rows.map(row => new Reaction(row.reaction_id, row.reaction_type, row.post_id, row.comment_id, row.message_id, row.user_id, row.timestamp));
                        resolve(reactions);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getMessageReactions(message_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Reaction WHERE message_id=?';
                db.all(sql, [message_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const reactions= rows.map(row => new Reaction(row.reaction_id, row.reaction_type, row.post_id, row.comment_id, row.message_id, row.user_id, row.timestamp));
                        resolve(reactions);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getReactionsbyType(reaction_type){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Reaction WHERE reaction_type=?';
                db.all(sql, [reaction_type], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const reactions= rows.map(row => new Reaction(row.reaction_id, row.reaction_type, row.post_id, row.comment_id, row.message_id, row.user_id, row.timestamp));
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
                const sql = 'INSERT INTO Reaction (reaction_type, post_id, comment_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?)';
                db.run(sql, [reaction_type, post_id, 0, 0, user_id, timestamp], function(err) { 
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
                const sql = 'INSERT INTO Reaction (reaction_type, post_id, comment_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?)';
                db.run(sql, [reaction_type, 0, comment_id, 0, user_id, timestamp], function(err) { 
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

    async insertMessageReaction(reaction_type, message_id, user_id, timestamp){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Reaction (reaction_type, post_id, comment_id, message_id, user_id, timestamp) VALUES (?,?,?,?,?,?)';
                db.run(sql, [reaction_type, 0, 0, message_id, user_id, timestamp], function(err) { 
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