import db from '../db.mjs';
import ReadReceipts from '../models/read_receipts_model.mjs';

const ReceiptsDAO = {

    async deleteReceipts(chat_id, user_id){
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM ReadReceipts WHERE chat_id=? AND user_id=?';
            db.run(sql, [chat_id, user_id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes > 0); 
            });
        });
    },

    async getUnreadChats(user_id){

        return new Promise((resolve, reject) => {
            const sql = `
                SELECT chat_id
                FROM ReadReceipts
                WHERE user_id = ?
            `;
    
            db.all(sql, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const chats = rows.map(row => row.chat_id);
                    resolve(chats);
                }
            });
        }); 

    }

};

export default ReceiptsDAO;