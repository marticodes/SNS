import db from '../db.mjs';
import Comment from '../models/comment_model.mjs';

const CommentDAO = {
    async getAllComments(post_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Comment WHERE post_id=?';
                db.all(sql, [post_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const comments= rows.map(row => new Comment(row.comment_id, row.parent_id, row.user_id, row.content, row.media_type, row.media_url, row.timestamp, row.reaction, row.visibility));
                        resolve(comments);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async insertComment(parent_id, user_id, content, media_type, media_url, timestamp, reaction, visibility) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Comment (parent_id, user_id, content, media_type, media_url, timestamp, reaction, visibility) VALUES (?,?,?,?,?,?,?,?)';
                db.run(sql, [parent_id, user_id, content, media_type, media_url, timestamp, reaction, visibility], function(err) { 
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

export default CommentDAO;