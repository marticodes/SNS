import db from "../db.mjs";

const SocialGroupDao = {

    async getUserSocialGroups(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT DISTINCT social_group_name FROM SocialGroup WHERE user_id=?';
                db.all(sql, [user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const group_name = rows.map(row => row.social_group_name);
                        resolve(group_name);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async insertUserSocialGroup(social_group_name, user_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO SocialGroup (social_group_name, user_id) VALUES (?,?)';
                db.run(sql, [social_group_name, user_id], function(err) { 
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

     async getGroupsByIds(group_ids) {
        return new Promise((resolve, reject) => {
            if (group_ids.length === 0) {
                resolve([]);
                return;
            }
            const placeholders = group_ids.map(() => '?').join(', ');
            const query = `
            SELECT social_group_name
            FROM SocialGroup
            WHERE user_id IN (${placeholders})
            GROUP BY social_group_name
            HAVING COUNT(DISTINCT user_id) = ?
          `;
        
          // Execute query with dynamic group_ids
          db.all(query, [...group_ids, group_ids.length], (err, results) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            resolve(results.map((row) => row.social_group_name) );
          });
        });
    }

};

export default SocialGroupDao;