import db from '../db.mjs';
import Post from '../models/post_model.mjs';

const CMemberDAO = {

    async getCommunitiesByUserID(user_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM CommunityMembership WHERE user_id = ?';
                db.all(sql, [user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve(false);
                    } else {
                        const community_id = rows.map(row => row.comm_id);
                        resolve(community_id);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async addChannel(user_id, comm_id){
        return new Promise((resolve, reject) => {
            try {
                let comm_name = "";
                const timestamp = new Date().toISOString();
                const sql = 'INSERT INTO CommunityMembership (user_id, comm_id) VALUES (?,?)';
                db.run(sql, [user_id, comm_id], function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes > 0) {
                        const id = this.lastID; 

                        const comm_sql = 'SELECT comm_name FROM Community WHERE comm_id = ?';
                        db.get(comm_sql, [comm_id], (err, row) => {
                            if (err) {
                                reject(err);
                            } else if (row.length === 0) {
                                resolve(false);
                            } else {
                                comm_name = row.comm_name;
                                const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                                db.run(log_sql, [user_id, 1, `Joined the community "${comm_name}"`, timestamp], function (log_err) {
                                    if (log_err) {
                                        return reject(log_err);
                                    }
                                });
                            }
                        });
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

    async getChannelPost(comm_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM Post WHERE comm_id=?';
                db.all(sql, [comm_id], (err, rows) => {
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

    async getChannelMembers(comm_id){

        return new Promise((resolve, reject) => {
            const sql = `
                SELECT user_id
                FROM CommunityMembership
                WHERE comm_id = ?
            `;
    
            db.all(sql, [comm_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const mems = rows.map(row => row.user_id);
                    resolve(mems);
                }
            });
        });

    },

};

export default CMemberDAO;