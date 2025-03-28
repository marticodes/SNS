import db from '../db.mjs';
import Comment from '../models/comment_model.mjs';

const CommentDAO = {
    async getAllComments(comment_id, post){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Comment WHERE parent_id=? AND post =?';
                db.all(sql, [comment_id, post], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const comments= rows.map(row => new Comment(row.comment_id, row.parent_id, row.user_id, row.content, row.media_type, row.media_url, row.timestamp, row.reaction, row.visibility, row.post));
                        resolve(comments);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getAllCommentsForAction(comment_id, post, user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Comment WHERE parent_id=? AND post =? AND user_id != ?';
                db.all(sql, [comment_id, post, user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const comments= rows.map(row => new Comment(row.comment_id, row.parent_id, row.user_id, row.content, row.media_type, row.media_url, row.timestamp, row.reaction, row.visibility, row.post));
                        resolve(comments);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async checkIfComment(post_id, post, user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Comment WHERE parent_id=? AND post =? AND user_id = ?';
                db.all(sql, [post_id, post, user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows.length > 0);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getCommentByID(comment_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Comment WHERE comment_id = ?';
                db.get(sql, [comment_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve([]);
                    } else {
                        const comments= new Comment(row.comment_id, row.parent_id, row.user_id, row.content, row.media_type, row.media_url, row.timestamp, row.reaction, row.visibility, row.post);
                        resolve(comments);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async insertComment(parent_id, user_id, content, media_type, media_url, timestamp, visibility, post) {
        return new Promise((resolve, reject) => {
            try {
                 timestamp = new Date().toISOString();
                const sql = 'INSERT INTO Comment (parent_id, user_id, content, media_type, media_url, timestamp, visibility, post) VALUES (?,?,?,?,?,?,?,?)';
                db.run(sql, [parent_id, user_id, content, media_type, media_url, timestamp, visibility, post], function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        const id = this.lastID; 
                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [user_id, 1, `Added a comment "${content}"`, timestamp], function (log_err) {
                            if (log_err) {
                                return reject(log_err);
                            }
                        });
                        resolve(id);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

};

export default CommentDAO;