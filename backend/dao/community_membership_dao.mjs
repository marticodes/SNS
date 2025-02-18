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
                const sql = 'INSERT INTO CommunityMembership (user_id, comm_id) VALUES (?,?)';
                db.run(sql, [user_id, comm_id], function(err) {
                    if (err) {
                        reject(err);
                    } else if (this.changes > 0) {
                        const id = this.lastID; 
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
                        const posts= rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id));
                        resolve(posts);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
        

    },

};

export default CMemberDAO;