import db from '../db.mjs';
import Community from '../models/community_model.mjs';

const CommunityDAO = {
    
    async getAllUserCommunities(user_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql1 = 'SELECT comm_id FROM CommunityMembership WHERE user_id = ?';
                db.all(sql1, [user_id], (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    let communityIds = rows.map(row => row.comm_id);
                    if (communityIds.length === 0) {
                        communityIds = [0];
                    }
                    const placeholders = communityIds.map(() => '?').join(', ');
                    const sql2 = `SELECT * FROM Community WHERE comm_id IN (${placeholders})`;
    
                    db.all(sql2, communityIds, (err, communities) => {
                        if (err) {
                            return reject(err);
                        }
                        const commList = communities.map(row => new Community(row.comm_id, row.comm_name, row.comm_image, row.comm_bio, row.duration));
                        resolve(commList);
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    
    
    async getCommunityInfo(comm_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Community WHERE comm_id = ?';
                db.get(sql, [comm_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (row.length === 0) {
                        resolve(false);
                    } else {
                        const comm = new Community(row.comm_id, row.comm_name, row.comm_image, row.comm_bio, row.duration);
                        resolve(comm);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async createNewChannel(comm_name, comm_image, comm_bio, user_id = 0, duration = 0){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Community (comm_name, comm_image, comm_bio, duration) VALUES (?,?,?, ?)';
                db.run(sql, [comm_name, comm_image, comm_bio, duration], function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        const timestamp = new Date().toISOString();

                        const id = this.lastID; 
                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id, 5, `New community "${comm_name}" has been created`, timestamp], function (log_err) {
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

    async getAllCommunityBios() {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT comm_bio FROM Community';
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    const bios = rows.map(row => row.comm_bio);
                    resolve(bios);
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async isEphemeralCommunity(comm_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT duration FROM Community WHERE comm_id = ?';
                db.get(sql, [comm_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(false);
                    } else {
                        resolve(row?.duration === 1);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

};

export default CommunityDAO;