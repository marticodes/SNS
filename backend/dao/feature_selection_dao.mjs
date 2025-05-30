import db from "../db.mjs";
import LvlOneFeature from '../models/lvl_one_feature_model.mjs';
import LvlTwoFeature from '../models/lvl_two_feature_model.mjs';
import LvlThreeFeature from '../models/lvl_three_feature_model.mjs';
import FeatureModel from '../models/feature_model.mjs';

const FeatureSelectionDAO = {
    async getLvlOneFeatures(){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM LvlOneFeature';
                db.get(sql, [], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve([]);
                    } else {
                        const features = new LvlOneFeature(row.lvl_one_id, row.timeline, row.connection_type, row.content_order);
                        resolve(features);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getLvlOneDescriptions(){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT keyword, llm_descr, user_descr, user_count, llm_final FROM LvlOneFeature';
                db.get(sql, [], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(null);
                    } else {
                        resolve({
                            keyword: row.keyword,
                            llm_descr: row.llm_descr,
                            user_descr: row.user_descr,
                            user_count: row.user_count,
                            llm_final: row.llm_final
                        });
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getUserCount(){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT user_count FROM LvlOneFeature';
                db.get(sql, [], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(null);
                    } else {
                        resolve(row.user_count);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getLvlTwoFeatures(){
        return new Promise((resolve, reject) => {
            try {         
                const sql = 'SELECT * FROM LvlTwoFeature';
                db.get(sql, [], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(null);
                    } else {
                        const features = new LvlTwoFeature(row.lvl_two_id, row.commenting, row.account_type, row.identity, row.messaging_mem, row.messaging_control, row.messaging_audience, row.sharing, row.reactions);
                        resolve(features);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getLvlTwoIdentity(){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT identity FROM LvlTwoFeature';
                db.get(sql, [], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(null);
                    } else {
                        resolve(row.identity);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async getLvlThreeFeatures() {
        return new Promise((resolve, reject) => {
            try {
                const sql = 'SELECT * FROM LvlThreeFeature';
                db.get(sql, [], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (!row) {
                        resolve(null); 
                    } else {
                        const feature = new LvlThreeFeature(
                            row.lvl_three_id,
                            row.ephemerality,
                            row.visibility,
                            row.discovery,
                            row.networking_control,
                            row.privacy_default,
                            row.community_type
                        );
                        resolve(feature);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    
    async getFeatures(){
        return new Promise(async (resolve, reject) => {
            try {         
                const [lvlOneData, lvlTwoData, lvlThreeData] = await Promise.all([
                    this.getLvlOneFeatures(),
                    this.getLvlTwoFeatures(),
                    this.getLvlThreeFeatures()
                ]);
        
                const mergedFeatures = new FeatureModel(
                    lvlOneData.timeline,
                    lvlOneData.connection_type,
                    lvlOneData.content_order,
                    
                    lvlTwoData.commenting,
                    lvlTwoData.account_type,
                    lvlTwoData.identity,
                    lvlTwoData.messaging_mem,
                    lvlTwoData.messaging_control,
                    lvlTwoData.messaging_audience,
                    lvlTwoData.sharing,
                    lvlTwoData.reactions,
                    
                    lvlThreeData.ephemerality,
                    lvlThreeData.visibility,
                    lvlThreeData.discovery,
                    lvlThreeData.networking_control,
                    lvlThreeData.privacy_default,
                    lvlThreeData.community_type,

                );
                resolve(mergedFeatures);
            } catch (error) {
                reject(error);
            }
        });
    },

    async insertLvlOneFeature(timeline, connection_type, content_order){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO LvlOneFeature (timeline, connection_type, content_order) VALUES (?,?,?)';
                db.run(sql, [timeline, connection_type, content_order], function(err) { 
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

    async insertLvlOneDescriptions(keyword, llm_descr, user_descr, user_count, llm_final){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO LvlOneFeature (keyword, llm_descr, user_descr, user_count, llm_final) VALUES (?,?,?,?,?)';
                db.run(sql, [keyword, llm_descr, user_descr, user_count, llm_final], function(err) { 
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

    async insertLvlTwoFeature(commenting, account_type, identity, messaging_mem, messaging_control, messaging_audience, sharing, reactions){
        return new Promise((resolve, reject) => {
            try {                
                const sql = 'INSERT INTO LvlTwoFeature (commenting, account_type, identity, messaging_mem, messaging_control, messaging_audience, sharing, reactions) VALUES (?,?,?,?,?,?,?,?)';
                db.run(sql, [commenting, account_type, identity, messaging_mem, messaging_control, messaging_audience, sharing, reactions], function(err) { 
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

    async insertLvlThreeFeature(ephemerality, visibility, discovery, networking_control, privacy_default, community_type){
        return new Promise((resolve, reject) => {
            try {
                const sql = 'INSERT INTO LvlThreeFeature (ephemerality, visibility, discovery, networking_control, privacy_default, community_type) VALUES (?,?,?,?,?,?)';
                db.run(sql, [ephemerality, visibility, discovery, networking_control, privacy_default, community_type], function(err) { 
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

    async insertFeatures(timeline, connection_type, content_order, commenting, account_type, identity, messaging_mem, messaging_control, messaging_audience, sharing, reactions, ephemerality, visibility, discovery, networking_control, privacy_default, community_type){
        return new Promise(async (resolve, reject) => {
            try {

            this.removeFeatures();

            const lvlOneID = await FeatureSelectionDAO.insertLvlOneFeature(timeline, connection_type, content_order);
            const lvlTwoID = await FeatureSelectionDAO.insertLvlTwoFeature(commenting, account_type, identity, messaging_mem, messaging_control, messaging_audience, sharing, reactions);
            const lvlThreeID = await FeatureSelectionDAO.insertLvlThreeFeature(ephemerality, visibility, discovery, networking_control, privacy_default, community_type);
            
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

    async removeFeatures(){
        return new Promise((resolve, reject) => {
            try {
                const sql1 = 'DELETE FROM LvlOneFeature';
                const sql2 = 'DELETE FROM LvlTwoFeature';
                const sql3 = 'DELETE FROM LvlThreeFeature';
    
                db.serialize(() => {
                    db.run(sql1, [], function(err1) {
                        if (err1) return reject(err1);
                    });
                    db.run(sql2, [], function(err2) {
                        if (err2) return reject(err2);
                    });
                    db.run(sql3, [], function(err3) {
                        if (err3) return reject(err3);
                        resolve(true); 
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async updateLvlOneDescriptions(keyword, llm_descr, user_descr, user_count, llm_final) {
        try {
            // First check if any records exist
            const checkSql = 'SELECT COUNT(*) as count FROM LvlOneFeature';
            const checkResult = await db.get(checkSql);
            
            if (checkResult.count === 0) {
                // If no records exist, insert a new one
                const insertSql = 'INSERT INTO LvlOneFeature (keyword, llm_descr, user_descr, user_count, llm_final) VALUES (?, ?, ?, ?, ?)';
                await db.run(insertSql, [keyword, llm_descr || "", user_descr || "", user_count || "", llm_final || ""]);
            } else {
                // If records exist, update only the provided fields
                const updateFields = [];
                const updateValues = [];
                
                if (keyword !== undefined) {
                    updateFields.push('keyword = ?');
                    updateValues.push(keyword);
                }
                if (llm_descr !== undefined) {
                    updateFields.push('llm_descr = ?');
                    updateValues.push(llm_descr);
                }
                if (user_descr !== undefined) {
                    updateFields.push('user_descr = ?');
                    updateValues.push(user_descr);
                }
                if (user_count !== undefined) {
                    updateFields.push('user_count = ?');
                    updateValues.push(user_count);
                }
                if (llm_final !== undefined) {
                    updateFields.push('llm_final = ?');
                    updateValues.push(llm_final);
                }
                
                if (updateFields.length > 0) {
                    const updateSql = `UPDATE LvlOneFeature SET ${updateFields.join(', ')} WHERE lvl_one_id = (SELECT MIN(lvl_one_id) FROM LvlOneFeature)`;
                    await db.run(updateSql, updateValues);
                }
            }
            
            return { success: true };
        } catch (error) {
            console.error('Error updating lvl one descriptions', error);
            throw error;
        }
    },

};

export default FeatureSelectionDAO;