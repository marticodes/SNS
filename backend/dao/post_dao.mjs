import db from '../db.mjs';
import Post from '../models/post_model.mjs';

const PostDAO = {
    async getAllPosts(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Post WHERE user_id=?';
                db.all(sql, [user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const posts= rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id));
                        resolve(posts);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getPostByPostId(post_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Post WHERE post_id=?';
                db.get(sql, [post_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (row.length === 0) {
                        resolve([]);
                    } else {
                        const post= new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id);
                        resolve(post);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async searchPostByTopic(topic){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Post WHERE topic=?';
                db.all(sql, [topic], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const posts= rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id));
                        resolve(posts);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async searchPostByWord(keyword){
        return new Promise((resolve, reject) => {
            try {         
                const sql = `SELECT * FROM Post WHERE LOWER(content) LIKE LOWER(?)`;
                const searchTerm = `%${keyword}%`;
                db.all(sql, [searchTerm], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const posts= rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id));
                        resolve(posts);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

    //Set duration for ephemeral posts. For regular posts, send as 0
    async insertPost(parent_id, user_id, content, topic, media_type, media_url, timestamp, duration, visibility, comm_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Post (parent_id, user_id, content, topic, media_type, media_url, timestamp, duration, visibility, comm_id) VALUES (?,?,?,?,?,?,?,?,?,?)';
                db.run(sql, [parent_id, user_id, content, topic, media_type, media_url, timestamp, duration, visibility, comm_id], function(err) { 
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

    async updatePostVisibility(post_id, visibility) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE Post SET visibility=? WHERE post_id=?';
                db.run(sql, [visibility, post_id], function (err) {
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

    async updatePost(post_id, content) {
        return new Promise((resolve, reject) => {
            //TODO: Change topic as well.
            try {
                const sql = 'UPDATE Post SET content=? WHERE post_id=?';
                db.run(sql, [content, post_id], function (err) {
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



};

export default PostDAO;