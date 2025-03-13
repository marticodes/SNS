import db from '../db.mjs';
import Community from '../models/community_model.mjs';

const CommunityDAO = {
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
                        const comm = new Community(row.comm_id, row.comm_name, row.comm_image, row.comm_bio);
                        resolve(comm);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

//TODO
    async createNewChannel(comm_name, comm_image, comm_bio){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Community (comm_name, comm_image, comm_bio) VALUES (?,?,?)';
                db.run(sql, [comm_name, comm_image, comm_bio], function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        const timestamp = new Date().toISOString();

                        const id = this.lastID; 
                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ 0, 5, `New community "${comm_name}" has been created`, timestamp], function (log_err) {
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

export default CommunityDAO;