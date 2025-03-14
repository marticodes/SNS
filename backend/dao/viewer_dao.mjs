import db from '../db.mjs';
import Viewer from '../models/viewer_model.mjs';

const ViewerDAO = {
    async getAllViewers(post_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT user_id FROM Viewer WHERE post_id=?';
                db.all(sql, [post_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const viewers= rows.map(row => row.user_id);
                        resolve(viewers);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async addPostViewer(user_id, post_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Viewer (user_id, post_id) VALUES (?,?)';
                db.run(sql, [user_id, post_id], function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        const id = this.lastID;
                        const timestamp = new Date().toISOString();

                        const log_sql = `INSERT INTO ActionLogs (user_id, action_type, content, timestamp) 
                                    VALUES (?, ?, ?, ?)`;
                        db.run(log_sql, [ user_id, 5, `Viewed post with id ${post_id}`, timestamp], function (log_err) {
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

export default ViewerDAO;

