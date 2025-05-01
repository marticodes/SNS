import db from "../db.mjs";
import LvlOneFeature from '../models/lvl_one_feature_model.mjs';
import LvlTwoFeature from '../models/lvl_two_feature_model.mjs';
import LvlThreeFeature from '../models/lvl_three_feature_model.mjs';
import FeatureModel from '../models/feature_model.mjs';

const FeatureSelectionDAO = {
    async getLvlOneFeatures(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM LvlOneFeature WHERE user_id=?';
                db.get(sql, [user_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve([]);
                    } else {
                        const features = new LvlOneFeature(row.lvl_one_id, row.timeline, row.connection_type, row.user_id);
                        resolve(features);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getLvlTwoFeatures(user_id){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM LvlTwoFeature WHERE user_id=?';
                db.get(sql, [user_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(null);
                    } else {
                        const features = new LvlTwoFeature(row.lvl_two_id, row.content_type, row.commenting, row.account_type, row.identity, row.messaging_mem, row.messaging_content, row.messaging_control, row.messaging_audience, row.user_id);
                        resolve(features);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getLvlThreeFeatures(user_id) {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM LvlThreeFeature WHERE user_id=?';
                db.get(sql, [user_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(null); 
                    } else {
                        const feature = new LvlThreeFeature(
                            row.lvl_three_id,
                            row.sharing,
                            row.reactions,
                            row.ephemerality,
                            row.visibility,
                            row.discovery,
                            row.networking_control,
                            row.privacy_default,
                            row.community_type,
                            row.user_id
                        );
                        resolve(feature);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    
    async getFeatures(user_id){
        return new Promise(async (resolve, reject) => {
            try {         
                const [lvlOneData, lvlTwoData, lvlThreeData] = await Promise.all([
                    this.getLvlOneFeatures(user_id),
                    this.getLvlTwoFeatures(user_id),
                    this.getLvlThreeFeatures(user_id)
                ]);
        
                const mergedFeatures = new FeatureModel(
                    lvlOneData.timeline,
                    lvlOneData.connection_type,
                    
                    lvlTwoData.content_type,
                    lvlTwoData.commenting,
                    lvlTwoData.account_type,
                    lvlTwoData.identity,
                    lvlTwoData.messaging_mem,
                    lvlTwoData.messaging_content,
                    lvlTwoData.messaging_control,
                    lvlTwoData.messaging_audience,

                    lvlThreeData.sharing,
                    lvlThreeData.reactions,
                    lvlThreeData.ephemerality,
                    lvlThreeData.visibility,
                    lvlThreeData.discovery,
                    lvlThreeData.networking_control,
                    lvlThreeData.privacy_default,
                    lvlThreeData.community_type,

                    lvlThreeData.user_id

                );
                resolve(mergedFeatures);
            } catch (error) {
                reject(error);
            }
        });
    },

    async insertLvlOneFeature(timeline, connection_type, user_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO LvlOneFeature (timeline, connection_type, user_id) VALUES (?,?,?)';
                db.run(sql, [timeline, connection_type, user_id], function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        resolve(this.lastID);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

    async insertLvlTwoFeature(content_type, commenting, account_type, identity, messaging_mem, messaging_content, messaging_control, messaging_audience, user_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO LvlTwoFeature (content_type, commenting, account_type, identity, messaging_mem, messaging_content, messaging_control, messaging_audience, user_id) VALUES (?,?,?,?,?,?,?,?,?)';
                db.run(sql, [content_type, commenting, account_type, identity, messaging_mem, messaging_content, messaging_control, messaging_audience, user_id], function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        resolve(this.lastID);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

    async insertLvlThreeFeature(sharing, reactions, ephemerality, visibility, discovery, networking_control, privacy_default, community_type, user_id){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO LvlThreeFeature (sharing, reactions, ephemerality, visibility, discovery, networking_control, privacy_default, community_type, user_id) VALUES (?,?,?,?,?,?,?,?,?)';
                db.run(sql, [sharing, reactions, ephemerality, visibility, discovery, networking_control, privacy_default, community_type, user_id], function(err) { 
                    if (err) {
                        reject(err);
                    } else if (this.changes === 0) { 
                        resolve(false);
                    } else {
                        resolve(this.lastID);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });

    },

    async insertFeatures(timeline, connection_type, content_type, commenting, account_type, identity, messaging_mem, messaging_content, messaging_control, messaging_audience, sharing, reactions, ephemerality, visibility, discovery, networking_control, privacy_default, community_type, user_id){
        return new Promise(async (resolve, reject) => {
            try {
            const lvlOneID = await FeatureSelectionDAO.insertLvlOneFeature(timeline, connection_type, user_id);
            const lvlTwoID = await FeatureSelectionDAO.insertLvlTwoFeature(content_type, commenting, account_type, identity, messaging_mem, messaging_content, messaging_control, messaging_audience, user_id);
            const lvlThreeID = await FeatureSelectionDAO.insertLvlThreeFeature(sharing, reactions, ephemerality, visibility, discovery, networking_control, privacy_default, community_type, user_id);
            
            if (lvlOneID && lvlTwoID && lvlThreeID) {
                resolve({ lvlOneID, lvlTwoID, lvlThreeID });
            } else {
                resolve(false);
            }
            } catch (error) {
                reject(error);
            }
        });

    },

    async removeFeatures(user_id){
        return new Promise((resolve, reject) => {
            try {
                const sql1 = 'DELETE FROM LvlOneFeature WHERE user_id=?';
                const sql2 = 'DELETE FROM LvlTwoFeature WHERE user_id=?';
                const sql3 = 'DELETE FROM LvlThreeFeature WHERE user_id=?';
    
                db.serialize(() => {
                    db.run(sql1, [user_id], function(err1) {
                        if (err1) return reject(err1);
                    });
                    db.run(sql2, [user_id], function(err2) {
                        if (err2) return reject(err2);
                    });
                    db.run(sql3, [user_id], function(err3) {
                        if (err3) return reject(err3);
                        resolve(true); 
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }



};

export default FeatureSelectionDAO;