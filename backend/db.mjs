import sqlite3 from "sqlite3";

// Opening the database
const database_path = './'
const db = new sqlite3.Database(database_path+'db.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) throw err;
    
    // Enable WAL mode
    db.run('PRAGMA journal_mode = WAL;');
    
    // Set busy timeout to wait before returning SQLITE_BUSY
    db.run('PRAGMA busy_timeout = 2000;');
});

export default db;