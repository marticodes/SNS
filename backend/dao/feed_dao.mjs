import db from '../db.mjs';
import Post from '../models/post_model.mjs';
import CommentDAO from './comment_dao.mjs';
import ReactionDAO from './reaction_dao.mjs';

const FeedDAO = {
    async filterAndDeleteOldPosts(rows) {
        return new Promise((resolve, reject) => {
            const currentTime = new Date();
            const postsToDelete = [];
            const validPosts = [];
    
            rows.forEach(row => {
                const postTime = new Date(row.timestamp);
                const timeDiff = (currentTime - postTime) / (1000 * 60 * 60); // Convert to hours
                
                if (timeDiff >= 24) {
                    postsToDelete.push(row.post_id);
                } else {
                    validPosts.push(new Post(
                        row.post_id, row.parent_id, row.user_id, row.content, row.topic, 
                        row.media_type, row.media_url, row.timestamp, row.duration, 
                        row.visibility, row.comm_id, row.hashtag
                    ));
                }
            });
    
            if (postsToDelete.length > 0) {
                // console.log(postsToDelete);
                const deleteSql = `DELETE FROM Post WHERE post_id IN (${postsToDelete.map(() => '?').join(',')})`;
                db.run(deleteSql, postsToDelete, (deleteErr) => {
                    if (deleteErr) {
                        return reject(deleteErr);
                    }
                    resolve(validPosts);
                });
            } else {
                resolve(validPosts);
            }
        });
    },
    
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
                    AND p.user_id !=?
                ORDER BY p.timestamp DESC;
            `;
    
            db.all(sql, [userId, userId, userId, userId, userId], (err, rows) => {
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

    async getcombinedFeedforComment(userId){
        try {
            const [friendsFeed, interestFeed] = await Promise.all([
                this.getFeedFromFriends(userId),
                this.getInterestBasedFeed(userId)
            ]);
            const combinedFeed = [...friendsFeed, ...interestFeed];
            combinedFeed.sort((a, b) => b.timestamp - a.timestamp);

            // console.log(combinedFeed);

            const filteredFeed = await Promise.all(
                combinedFeed.map(async (post) => {
                    // console.log(post.post_id);
                    const hasComment = await CommentDAO.checkIfComment(post.post_id, 1, userId);
                    return hasComment ? null : post;
                })
            );

            // console.log(filteredFeed);
            
            
            return filteredFeed.filter(post => post !== null);
        } catch (err) {
            throw err;
        }
    },

    async getcombinedFeedforReaction(userId){
        try {
            const [friendsFeed, interestFeed] = await Promise.all([
                this.getFeedFromFriends(userId),
                this.getInterestBasedFeed(userId)
            ]);
            const combinedFeed = [...friendsFeed, ...interestFeed];
            combinedFeed.sort((a, b) => b.timestamp - a.timestamp);

            // console.log(combinedFeed);

            const filteredFeed = await Promise.all(
                combinedFeed.map(async (post) => {
                    // console.log(post.post_id);
                    const hasReact = await ReactionDAO.checkIfReact(post.post_id, userId);
                    return hasReact ? null : post;
                })
            );

            // console.log(filteredFeed);
            
            
            return filteredFeed.filter(post => post !== null);
        } catch (err) {
            throw err;
        }
    },

    async getChannelFeed(comm_id){

        return new Promise((resolve, reject) => {
            const sql = `
                SELECT *
                FROM Post 
                WHERE comm_id = ?
                ORDER BY timestamp DESC;
            `;
    
            db.all(sql, [comm_id], async (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const validPosts = await FeedDAO.filterAndDeleteOldPosts(rows);
                        resolve(validPosts);
                        } catch (error) {
                            reject(error);
                        }
                }
            });
        });

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
    
            db.all(sql, [userId, userId], async (err, rows) => {
                if (err) {
                    reject(err);
                } try {
                    // console.log(rows.length);
                    const validPosts = await FeedDAO.filterAndDeleteOldPosts(rows);
                    resolve(validPosts);
                    } catch (error) {
                        reject(error);
                    }
            });
        });
    },

    async sharable_feed(post_ids, chat_id){
        console.log(post_ids)

        return new Promise((resolve, reject) => {
            try {
                const placeholders = post_ids.map(() => '?').join(',');
                const sql = `SELECT content FROM Message WHERE chat_id = ? AND content IN (${placeholders})`;
                console.log(sql);
                db.all(sql, [chat_id,...post_ids], (err, rows) => {
                    if (err) return reject(err);
                    const existingPostIds = rows.map(row => row.content);
                    const filteredPostIds = post_ids.filter(id => !existingPostIds.includes(id));
                    resolve(filteredPostIds);
                    console.log(filteredPostIds);

                });
            } catch (error) {
                reject(error);
            }
        });

    }

};

export default FeedDAO;