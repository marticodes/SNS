import db from "../db.mjs";

const TraitDao = {

    async getUserTraits(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT DISTINCT trait_name FROM Traits WHERE user_id=?';
                db.all(sql, [user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const traits = rows.map(row => row.trait_name);
                        resolve(traits);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async insertUserSocialGroup(trait_name, user_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Traits (trait_name, user_id) VALUES (?,?)';
                db.run(sql, [trait_name, user_id], function(err) { 
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

};

export default TraitDao;