import db from '../db.mjs';
import Post from '../models/post_model.mjs';

const FeedDAO = {
    async  getFeedFromFriends(userId){
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.*
                FROM Post p
                JOIN Relations r 
                    ON (p.user_id = r.user_id_2)
                WHERE 
                    (r.user_id_1 = ?)  
                    AND r.relation_type IN (0, 1, 2)  
                    AND p.user_id != ?   
                    AND p.duration IS NULL
                ORDER BY p.timestamp DESC;
            `;
    
            db.all(sql, [userId, userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const posts= rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id, row.hashtag));
                    resolve(posts);
                }
            });
        });
    },

    async getInterestBasedFeed(userId){
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.*
                FROM Post p
                JOIN UserInterest ui ON p.topic = ui.interest_name
                WHERE 
                    ui.user_id = ?  
                    AND p.user_id NOT IN ( 
                        SELECT CASE 
                                WHEN r.user_id_1 = ? THEN r.user_id_2 
                                ELSE r.user_id_1 
                            END 
                        FROM Relations r 
                        WHERE (r.user_id_1 = ? OR r.user_id_2 = ?) 
                            AND r.relation_type IN (0, 1, 2)  
                    )
                    AND p.visibility = 2
                    AND p.duration IS NULL
                ORDER BY p.timestamp DESC;
            `;
    
            db.all(sql, [userId, userId, userId, userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const posts= rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id, row.hashtag));
                    resolve(posts);
                }
            });
        });
    },

    async getcombinedFeed(userId){
        try {
            const [friendsFeed, interestFeed] = await Promise.all([
                this.getFeedFromFriends(userId),
                this.getInterestBasedFeed(userId)
            ]);
            const combinedFeed = [...friendsFeed, ...interestFeed];
            combinedFeed.sort((a, b) => b.timestamp - a.timestamp);
            return combinedFeed;
        } catch (err) {
            throw err;
        }
    },
    
    async  getEphemeralPosts(userId){
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.*
                FROM Post p
                JOIN Relations r 
                    ON (p.user_id = r.user_id_2)
                WHERE 
                    (r.user_id_1 = ?)  
                    AND r.relation_type IN (0, 1, 2)  
                    AND p.user_id != ?
                    AND p.duration IS NOT NULL
                    AND p.duration > 0   
                ORDER BY p.timestamp DESC;
            `;
    
            db.all(sql, [userId, userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const posts= rows.map(row => new Post(row.post_id, row.parent_id, row.user_id, row.content, row.topic, row.media_type, row.media_url, row.timestamp, row.duration, row.visibility, row.comm_id, row.hashtag));
                    resolve(posts);
                }
            });
        });
    },

};

export default FeedDAO;