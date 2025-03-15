import db from "../db.mjs";
import Trait from "../models/trait_model.mjs";

const TraitDAO = {
    async getUserTraits(user_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM Trait WHERE user_id = ?';
                db.get(sql, [user_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(false);
                    } else {
                        const trait = new Trait(row.trait_id, row.user_id, row.posting_trait, row.commenting_trait, row.reacting_trait, row.messaging_trait, row.updating_trait, row.comm_trait, row.notification_trait);
                        resolve(trait);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async insertUserTraits(user_id, posting_trait, commenting_trait, reacting_trait, messaging_trait, updating_trait, comm_trait, notification_trait) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Trait (user_id, posting_trait, commenting_trait, reacting_trait, messaging_trait, updating_trait, comm_trait, notification_trait) VALUES (?,?,?,?,?,?,?,?)';
                db.run(sql, [user_id, posting_trait, commenting_trait, reacting_trait, messaging_trait, updating_trait, comm_trait, notification_trait], function(err) { 
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

export default TraitDAO;