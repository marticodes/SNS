import db from '../db.mjs';
import Hashtag from '../models/hashtag_model.mjs';

const HashtagDAO = {

    async countHashtag(content){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'ELECT COUNT(*) AS count FROM Hashtag WHERE content = ?';
                db.get(sql, [content], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (row.length === 0) {
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
                const sql = 'SELECT post_id FROM Hashtag WHERE content = ?';
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

export default HashtagDAO;