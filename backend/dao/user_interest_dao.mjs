import db from "../db.mjs";

const UserInterestDAO = {

    async getUserInterests(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT DISTINCT interest_name FROM UserInterest WHERE user_id=?';
                db.all(sql, [user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const interest_name = rows.map(row => row.interest_name);
                        resolve(interest_name);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getUsersWithSimilarInterest(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT DISTINCT ui2.user_id 
                FROM UserInterest ui1
                JOIN UserInterest ui2 ON ui1.interest_name = ui2.interest_name
                WHERE ui1.user_id = ? AND ui2.user_id != ?
                AND ui2.user_id NOT IN (
                    SELECT user_id_2 FROM Relation WHERE user_id_1 = ?
                )
                LIMIT 10;
            `;
    
            db.all(sql, [userId, userId, userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => row.user_id));
                }
            });
        });
    },

};

export default UserInterestDAO;