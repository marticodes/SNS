import ActionChoice from './action_choice.mjs';
import db from './db.mjs';
import Simulation from './simulation.mjs';
import FeatureSelectionDAO from './dao/feature_selection_dao.mjs';
import UserDAO from './dao/user_dao.mjs';

function getUserIds() {
    return new Promise((resolve, reject) => {
        db.all('SELECT user_id FROM user', (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows.map(row => row.user_id));
        });
    });
    
}

async function ActionSimulation() {
    ////////////////Agent generation.////////////////////
    try {
        const userCount = await FeatureSelectionDAO.getUserCount();
        //const userCount = 10;
        
        let existingUserNames = [];
        let existingUserBios = [];
                for (let i = 0; i < userCount; i++) {
            if (i > 0) {
                existingUserNames = await UserDAO.getUserNames();
                existingUserBios = await UserDAO.getUserBios();
            }
            
            await Simulation.generateAgentFromMetaphor(existingUserNames, existingUserBios);
            console.log(`Generated agent ${i + 1} of ${userCount}`);
        }
        
        console.log(`All ${userCount} agents generated successfully!`);
    } catch (error) {
        console.error("Error generating agents:", error);
    }

    ////////////////Relation generation.////////////////////
    const userCount = await FeatureSelectionDAO.getUserCount();
    const totalTargetRelations = Math.round((userCount * (userCount - 1)) / 2 * 0.6);  // 60% of n choose 2
    
    const bidirectionalCount = Math.round(totalTargetRelations * 0.7);  // 70% bidirectional
    const unidirectionalCount = totalTargetRelations - bidirectionalCount;  // 30% unidirectional
    
    const existingRelations = new Set(); // Track existing relations to avoid duplicates
    
    async function createRelationEntry(u1, u2) {
        await fetch('http://localhost:3001/api/relations/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id_1: u1,
                user_id_2: u2,
                relation_type: 2,
                restricted: 0,
                closeness: 0
            })
        });
    }

    console.log(`Creating ${bidirectionalCount} bidirectional and ${unidirectionalCount} unidirectional relations`);

    try {
        const userIds = await getUserIds();
        
        // Create bidirectional relations (70%)
        for (let i = 0; i < bidirectionalCount; i++) {
            let user1, user2, relationKey;
            
            // Find a unique pair
            do {
                user1 = userIds[Math.floor(Math.random() * userIds.length)];
                user2 = userIds[Math.floor(Math.random() * userIds.length)];
                relationKey = `${Math.min(user1, user2)}-${Math.max(user1, user2)}`;
            } while (user1 === user2 || existingRelations.has(relationKey));
            
            existingRelations.add(relationKey);
            
            // Create both directions
            await createRelationEntry(user1, user2);
            await createRelationEntry(user2, user1);
            console.log(`Added bidirectional relation: ${user1} <-> ${user2}`);
        }
        
        // Create unidirectional relations (30%)
        for (let i = 0; i < unidirectionalCount; i++) {
            let user1, user2, relationKey;
            
            // Finding a unique pair
            do {
                user1 = userIds[Math.floor(Math.random() * userIds.length)];
                user2 = userIds[Math.floor(Math.random() * userIds.length)];
                relationKey = `${Math.min(user1, user2)}-${Math.max(user1, user2)}`;
            } while (user1 === user2 || existingRelations.has(relationKey));
            
            existingRelations.add(relationKey);
            
            // Create only one direction
            await createRelationEntry(user1, user2);
            console.log(`Added unidirectional relation: ${user1} -> ${user2}`);
        }
        
        console.log(`Relation generation complete! Created ${bidirectionalCount} bidirectional and ${unidirectionalCount} unidirectional relations.`);
        
    } catch (error) {
        console.error('Error creating relations:', error);
    }

    ////////////////Action generation.////////////////////
    while (true) {
        try {
            const userIds = await getUserIds();
        
            if (userIds.length > 0) {
                await Promise.all(userIds.map(async (user_id) => {
                    try {
                        const [apiAction1] = await Promise.all([
                            ActionChoice.performAction(user_id),
                        ]);
                
                        console.log(`Agent ${user_id} performed actions:`, {apiAction1});
                        
                    } catch (error) {
                        console.error(`Error with agent ${user_id}:`, error);
                    }
                }));
            }
        } catch (dbError) {
            console.error('Error querying user IDs:', dbError);
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

// Start the simulation
ActionSimulation().catch(error => console.error("Simulation error:", error));


