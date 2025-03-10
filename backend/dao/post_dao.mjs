import db from '../db.mjs';
import Post from '../models/post_model.mjs';

const PostDAO = {
    async getAllPosts(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Post WHERE user_id=? ORDER BY timestamp DESC';
                db.all(sql, [user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const posts= rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id, row.hashtag));
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
                        const post= new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id, row.hashtag);
                        resolve(post);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getPostContent(chat_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Message WHERE chat_id = ? ORDER BY timestamp ASC';
    
                db.all(sql, [chat_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const messages= rows.map(row => row.content);
                        resolve(messages);
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
                        const posts= rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id, row.hashtag));
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
                        const posts= rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id, row.hashtag));
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
            const hashtagMatch = content.match(/#(\w+)/);
            const hashtag = hashtagMatch ? hashtagMatch[1] : null;
                const sql = 'INSERT INTO Post (parent_id, user_id, content, topic, media_type, media_url, timestamp, duration, visibility, comm_id, hashtag) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
                db.run(sql, [parent_id, user_id, content, topic, media_type, media_url, timestamp, duration, visibility, comm_id, hashtag], function(err) { 
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
            try {
                const hashtagMatch = content.match(/#(\w+)/);
                const hashtag = hashtagMatch ? hashtagMatch[1] : null;
                const sql = 'UPDATE Post SET content=?, hashtag=? WHERE post_id=?';
                db.run(sql, [content, hashtag, post_id], function (err) {
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

    async countHashtag(content){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT COUNT(*) AS count FROM Post WHERE hashtag = ?';
                db.get(sql, [content], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(false);
                    } else {
                        resolve(row.count);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getPostIdsWithHashtag(content){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT post_id FROM Post WHERE hashtag = ?';
                db.all(sql, [content], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve(false);
                    } else {
                        const post_ids = rows.map(row => row.post_id);
                        resolve(post_ids);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

};

export default PostDAO;