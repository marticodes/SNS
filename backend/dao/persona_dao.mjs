import db from "../db.mjs";

const PersonaDAO = {
    async getUserPersona(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT DISTINCT persona_name FROM Persona WHERE user_id=?';
                db.all(sql, [user_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else if (rows.length === 0) {
                        resolve([]);
                    } else {
                        const persona = rows.map(row => row.persona_name);
                        resolve(persona);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async insertUserPersona(persona_name, user_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO Persona (persona_name, user_id) VALUES (?,?)';
                db.run(sql, [persona_name, user_id], function(err) { 
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

export default PersonaDAO;