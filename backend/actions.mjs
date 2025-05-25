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
        // const userCount = await FeatureSelectionDAO.getUserCount();
        const userCount = 10;
        
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
    // const userCount = await FeatureSelectionDAO.getUserCount();
    const userCount = 10;
    const targetRelations = Math.round((userCount * (userCount - 1)) / 2 * 0.6);  // 60% of n choose 2, rounded
    const existingRelations = new Set(); // Track existing relations
    
    while (true) {
        try {
            // Check current total
            const response = await fetch('http://localhost:3001/api/relations/total');
            const currentRelations = (await response.json()).total;
            console.log(`Current total relations: ${currentRelations}/${targetRelations}`);
            
            if (currentRelations >= targetRelations) {
                console.log("Reached target relations count!");
                break;
            }

            // Get all users
            const userIds = await getUserIds();
            
            // Create 10 random relations
            for (let i = 0; i < 10; i++) {
                const user1 = userIds[Math.floor(Math.random() * userIds.length)];
                let user2 = userIds[Math.floor(Math.random() * userIds.length)];
                
                // Keep trying until we find a new unique relation
                const relationKey = `${Math.min(user1, user2)}-${Math.max(user1, user2)}`;
                while (user1 === user2 || existingRelations.has(relationKey)) {
                    user2 = userIds[Math.floor(Math.random() * userIds.length)];
                    relationKey = `${Math.min(user1, user2)}-${Math.max(user1, user2)}`;
                }
                
                existingRelations.add(relationKey);

                await fetch('http://localhost:3001/api/relations/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id_1: user1,
                        user_id_2: user2,
                        relation_type: 2,
                        restricted: 0,
                        closeness: 0
                    })
                });
                console.log(`Added relation: ${user1} -> ${user2}`);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    ////////////////Action generation.////////////////////
    while (true) {
        try {
            const userIds = await getUserIds();
        
            if (userIds.length > 0) {
<<<<<<< HEAD
                await Promise.all(userIds.map(async (user_id) => {
=======
                // 2% chance to create a new agent.
                if (Math.random() < 0.02) {
                    const newAgentId = await Simulation.generateAgentFromGoals();
                    console.log(`New agent created with id: ${newAgentId}`);
                } else {
                    // Otherwise, select an existing agent to perform a random action.
                    const randomIndex = Math.floor(Math.random() * userIds.length);
                    const user_id = userIds[randomIndex];
>>>>>>> a732f35 (in progress)
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


