import db from '../db.mjs';
import Post from '../models/post_model.mjs';
import Simulation from '../simulation.mjs';
import OpenAI from "openai";
import { OPENAI_API_KEY } from '../apiKey.mjs';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY});
const topics = ["Animals", "Art & Design", "Automobiles", "DIY & Crafting", "Education", "Fashion", "Finance", "Fitness", "Food", "Gaming", "History & Culture", "Lifestyle", "Literature", "Movies", "Music", "Nature", "Personal Development", "Photography", "Psychology", "Religion", "Social", "Sports", "Technology", "Travel", "Wellness"];
async function generateResponse(system_prompt, user_prompt) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: system_prompt },
                { role: "user", content: user_prompt },
            ],
            temperature: 0.7,
            store: true,
        });
        return completion.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "Error generating response.";
    }
}

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

    async getPostContent(post_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Post WHERE post_id = ? ORDER BY timestamp ASC';
    
                db.all(sql, [post_id], (err, rows) => {
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

    async searchCombined(keyword){
        return new Promise((resolve, reject) => {
            try {
                const searchTerm = `%${keyword.toLowerCase()}%`;       
                const sql = `SELECT * FROM Post 
                WHERE LOWER(content) LIKE ?
                OR topic=?
                OR hashtag = ?`;
                db.all(sql, [searchTerm, keyword, keyword], (err, rows) => {
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

    async searchinComminity(keyword, comm_id){
        return new Promise((resolve, reject) => {
            try {         
                const searchTerm = `%${keyword}%`;         
                const sql = `SELECT * FROM Post 
                WHERE comm_id = ?
                AND (LOWER(content) LIKE LOWER(?)
                OR topic=?)
                `;
                db.all(sql, [comm_id, searchTerm, keyword], (err, rows) => {
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
       
        const system_prompt = "Respond in keywords only.";
        const user_prompt = `From the list of the following topics ${topics}}, which topic most aligns a post with the following content ${content}. There may be multiple right answers, but only choose the one that aligns the most. Only respond with the topic name`
        const post_topic = await generateResponse(system_prompt, user_prompt);

        return new Promise((resolve, reject) => {
            try {
            const hashtagMatch = content.match(/#(\w+)/);
            const hashtag = hashtagMatch ? hashtagMatch[1] : null;
            topic = topic || post_topic;
                const sql = 'INSERT INTO Post (parent_id, user_id, content, topic, media_type, media_url, timestamp, duration, visibility, comm_id, hashtag) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
                db.run(sql, [parent_id, user_id, content, topic, media_type, media_url, timestamp, duration, visibility, comm_id, hashtag], function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        const id = this.lastID;
                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id, 0, `Made a post "${content}"`, timestamp], function (log_err) {
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

    async updatePostVisibility(post_id, visibility, user_id = 0) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'UPDATE Post SET visibility=? WHERE post_id=?';
                db.run(sql, [visibility, post_id], function (err) {
                    if (err) {
                      reject(err);
                    }else {
                        const timestamp = new Date().toISOString();

                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id, 4, `Updated post visibility to type ${visibility}`, timestamp], function (log_err) {
                            if (log_err) {
                                        return reject(log_err);
                                        }
                        });  
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
    //ADDED FUNC //
    async getRecentPostsByUserInCommunity(user_id, comm_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Post WHERE user_id = ? AND comm_id = ? ORDER BY timestamp DESC LIMIT 3'; // Get 3 most recent posts
                db.all(sql, [user_id, comm_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);  // No posts found
                    } else {
                        const posts = rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id, row.hashtag));
                        resolve(posts);  // Return posts
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
                const sql = 'SELECT * FROM Post WHERE hashtag = ?';
                db.all(sql, [content], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve(false);
                    } else {
                        const post = rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id, row.hashtag));
                        resolve(post);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

};

export default PostDAO;