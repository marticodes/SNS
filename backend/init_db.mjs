import sqlite3 from "sqlite3";
import fs from 'fs/promises';

// First, let's clean up any existing journal files
async function cleanupJournalFiles() {
    try {
        await fs.unlink('./db.db-journal').catch(() => {}); // Ignore if doesn't exist
        await fs.unlink('./db.db-wal').catch(() => {});     // Ignore if doesn't exist
        await fs.unlink('./db.db-shm').catch(() => {});     // Ignore if doesn't exist
        console.log('Cleaned up existing journal files');
    } catch (err) {
        console.log('No journal files to clean up');
    }
}

let db; // Declare db in outer scope

// Open/create database file directly
async function initDb() {
    await cleanupJournalFiles();

    db = new sqlite3.Database('./db.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) throw err;
        console.log('Connected to database.');
    });

    // Enable foreign key support but use DELETE mode for journal
    db.run('PRAGMA foreign_keys = ON;');
    db.run('PRAGMA journal_mode = DELETE;'); // Use DELETE instead of WAL to avoid journal files

    const tables = [
        `CREATE TABLE IF NOT EXISTS "User" (
            "user_id" INTEGER NOT NULL UNIQUE,
            "id_name" TEXT,
            "user_name" TEXT NOT NULL UNIQUE,
            "email" TEXT NOT NULL UNIQUE,
            "password" TEXT NOT NULL,
            "user_bio" TEXT,
            "profile_picture" TEXT,
            "status" INTEGER,
            "visibility" INTEGER,
            "activity_level" INTEGER,
            "is_login" INTEGER,
            PRIMARY KEY("user_id" AUTOINCREMENT)
        )`,

        `CREATE TABLE IF NOT EXISTS "ActionLogs" (
            "action_id" INTEGER,
            "user_id" INTEGER,
            "action_type" INTEGER,
            "content" TEXT,
            "timestamp" TEXT,
            PRIMARY KEY("action_id" AUTOINCREMENT),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "Chat" (
            "chat_id" INTEGER NOT NULL UNIQUE,
            "user_id_1" INTEGER,
            "user_id_2" INTEGER,
            "group_chat" INTEGER,
            "chat_name" TEXT,
            "chat_image" TEXT,
            "timestamp" TEXT,
            "duration" INTEGER,
            PRIMARY KEY("chat_id" AUTOINCREMENT),
            FOREIGN KEY("user_id_1") REFERENCES "User"("user_id"),
            FOREIGN KEY("user_id_2") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "Comment" (
            "comment_id" INTEGER NOT NULL,
            "parent_id" INTEGER,
            "user_id" INTEGER,
            "content" BLOB,
            "media_type" INTEGER,
            "media_url" TEXT,
            "timestamp" TEXT,
            "visibility" INTEGER,
            "post" INTEGER,
            PRIMARY KEY("comment_id"),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "Community" (
            "comm_id" INTEGER NOT NULL UNIQUE,
            "comm_name" TEXT,
            "comm_image" TEXT,
            "comm_bio" TEXT,
            "duration" INTEGER,
            PRIMARY KEY("comm_id" AUTOINCREMENT)
        )`,

        `CREATE TABLE IF NOT EXISTS "CommunityMembership" (
            "membership_id" INTEGER,
            "user_id" INTEGER NOT NULL,
            "comm_id" INTEGER,
            PRIMARY KEY("membership_id"),
            FOREIGN KEY("comm_id") REFERENCES "Community"("comm_id"),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "FriendRequest" (
            "request_id" INTEGER NOT NULL,
            "user_id_1" INTEGER,
            "user_id_2" INTEGER,
            PRIMARY KEY("request_id"),
            FOREIGN KEY("user_id_1") REFERENCES "User"("user_id"),
            FOREIGN KEY("user_id_2") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "GCMembership" (
            "gc_membership_id" INTEGER,
            "chat_id" INTEGER,
            "user_id" INTEGER,
            PRIMARY KEY("gc_membership_id"),
            FOREIGN KEY("chat_id") REFERENCES "Chat"("chat_id"),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE "LvlOneFeature" (
            "lvl_one_id" INTEGER,
            "timeline" INTEGER,
            "connection_type" INTEGER,
            "content_order" INTEGER,
            "user_count" INTEGER,
            "keyword" TEXT,
            "llm_descr" TEXT,
            "user_descr" TEXT,
            PRIMARY KEY("lvl_one_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "LvlTwoFeature" (
            "lvl_two_id" INTEGER,
            "commenting" INTEGER,
            "account_type" INTEGER,
            "identity" INTEGER,
            "messaging_mem" INTEGER,
            "messaging_control" INTEGER,
            "messaging_audience" INTEGER,
            "sharing" INTEGER,
            "reactions" INTEGER,
            PRIMARY KEY("lvl_two_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "LvlThreeFeature" (
            "lvl_three_id" INTEGER,
            "ephemerality" INTEGER,
            "visibility" INTEGER,
            "discovery" INTEGER,
            "networking_control" INTEGER,
            "privacy_default" INTEGER,
            "community_type" INTEGER,
            PRIMARY KEY("lvl_three_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "Message" (
            "message_id" INTEGER NOT NULL,
            "chat_id" INTEGER,
            "sender_id" INTEGER,
            "reply_id" INTEGER,
            "content" BLOB,
            "media_type" INTEGER,
            "media_url" TEXT,
            "timestamp" TEXT,
            "shared_post" INTEGER,
            PRIMARY KEY("message_id"),
            FOREIGN KEY("chat_id") REFERENCES "Chat"("chat_id"),
            FOREIGN KEY("reply_id") REFERENCES "Message"("message_id"),
            FOREIGN KEY("sender_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "Notification" (
            "notif_id" INTEGER NOT NULL,
            "content" INTEGER,
            "notif_type" INTEGER,
            "sender_id" INTEGER,
            "receiver_id" INTEGER,
            "timestamp" TEXT,
            PRIMARY KEY("notif_id" AUTOINCREMENT),
            FOREIGN KEY("receiver_id") REFERENCES "User"("user_id"),
            FOREIGN KEY("sender_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "Persona" (
            "persona_id" INTEGER NOT NULL,
            "persona_name" TEXT,
            "user_id" INTEGER,
            PRIMARY KEY("persona_id" AUTOINCREMENT),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "Post" (
            "post_id" INTEGER NOT NULL UNIQUE,
            "parent_id" INTEGER,
            "user_id" INTEGER,
            "content" BLOB,
            "topic" TEXT,
            "media_type" INTEGER NOT NULL,
            "media_url" TEXT,
            "timestamp" INTEGER,
            "duration" INTEGER,
            "visibility" INTEGER,
            "comm_id" INTEGER,
            "hashtag" TEXT,
            PRIMARY KEY("post_id" AUTOINCREMENT),
            FOREIGN KEY("comm_id") REFERENCES "Community"("comm_id"),
            FOREIGN KEY("parent_id") REFERENCES "Post"("post_id"),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "Reaction" (
            "reaction_id" INTEGER,
            "reaction_type" INTEGER,
            "emote_type" TEXT,
            "post_id" INTEGER,
            "comment_id" INTEGER,
            "chat_id" INTEGER,
            "message_id" INTEGER,
            "user_id" INTEGER,
            "timestamp" TEXT,
            PRIMARY KEY("reaction_id" AUTOINCREMENT),
            FOREIGN KEY("chat_id") REFERENCES "Chat"("chat_id"),
            FOREIGN KEY("comment_id") REFERENCES "Comment"("comment_id"),
            FOREIGN KEY("message_id") REFERENCES "Message"("message_id"),
            FOREIGN KEY("post_id") REFERENCES "Post"("post_id"),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "ReadReceipts" (
            "rr_id" INTEGER NOT NULL,
            "chat_id" INTEGER,
            "user_id" INTEGER,
            PRIMARY KEY("rr_id" AUTOINCREMENT),
            FOREIGN KEY("chat_id") REFERENCES "Chat"("chat_id"),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "Relations" (
            "relation_id" INTEGER,
            "user_id_1" INTEGER,
            "user_id_2" INTEGER,
            "relation_type" INTEGER,
            "restricted" INTEGER,
            "closeness" INTEGER,
            PRIMARY KEY("relation_id"),
            FOREIGN KEY("user_id_1") REFERENCES "User"("user_id"),
            FOREIGN KEY("user_id_2") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "SocialGroup" (
            "social_group_id" INTEGER,
            "social_group_name" TEXT,
            "user_id" INTEGER,
            PRIMARY KEY("social_group_id" AUTOINCREMENT),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "Trait" (
            "trait_id" INTEGER NOT NULL,
            "user_id" INTEGER,
            "posting_trait" INTEGER,
            "commenting_trait" INTEGER,
            "reacting_trait" INTEGER,
            "messaging_trait" INTEGER,
            "updating_trait" INTEGER,
            "comm_trait" INTEGER,
            "notification_trait" INTEGER,
            PRIMARY KEY("trait_id" AUTOINCREMENT),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "UserInterest" (
            "interest_id" INTEGER NOT NULL,
            "interest_name" TEXT,
            "user_id" INTEGER,
            "post_id" INTEGER,
            PRIMARY KEY("interest_id"),
            FOREIGN KEY("post_id") REFERENCES "Post"("post_id"),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`,

        `CREATE TABLE IF NOT EXISTS "Viewer" (
            "viewer_id" INTEGER NOT NULL,
            "user_id" INTEGER NOT NULL,
            "post_id" INTEGER,
            PRIMARY KEY("viewer_id" AUTOINCREMENT),
            FOREIGN KEY("post_id") REFERENCES "Post"("post_id"),
            FOREIGN KEY("user_id") REFERENCES "User"("user_id")
        )`
    ];

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Create tables first
            for (const sql of tables) {
                db.run(sql, (err) => {
                    if (err) {
                        console.error('Error creating table:', err);
                        reject(err);
                    }
                });
            }

            // Add test user
            const testUser = {
                id_name: "Test",
                user_name: "testuser",
                email: "test@example.com",
                password: "123",
                user_bio: "This is a test user account",
                status: 1, 
                visibility: 1,
                activity_level: 1,
                is_login: 0
            };

            const insertUserQuery = `
                INSERT OR IGNORE INTO User (
                    id_name, user_name, email, password, user_bio, 
                    status, visibility, activity_level, is_login
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(insertUserQuery, [
                testUser.id_name,
                testUser.user_name,
                testUser.email,
                testUser.password,
                testUser.user_bio,
                testUser.status,
                testUser.visibility,
                testUser.activity_level,
                testUser.is_login
            ], function(err) {
                if (err) {
                    console.error('Error inserting test user:', err);
                    reject(err);
                } else {
                    console.log('Test user created successfully');
                    resolve();
                }
            });
        });
    });
}

// Initialize the database
initDb()
    .then(() => {
        console.log('Database initialization completed');
        db.close(() => {
            console.log('Database connection closed.');
        });
    })
    .catch(err => {
        console.error('Database initialization failed:', err);
        if (db) {  // Check if db exists before trying to close it
            db.close(() => {
                console.log('Database connection closed.');
            });
        }
    }); 
