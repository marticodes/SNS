import ActionChoice from './action_choice.mjs';
import db from './db.mjs';
import Simulation from './simulation.mjs';

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
    while (true) {
        try {
            const userIds = await getUserIds();
            // If there are users, decide randomly whether to create a new agent or perform an action with an existing one.
            if (userIds.length > 0) {
                // 2% chance to create a new agent.
                if (Math.random() < 0) {
                    const newAgentId = await Simulation.generateAgentFromGroupChats();
                    console.log(`New agent created with id: ${newAgentId}`);
                } else {
                    // Otherwise, select an existing agent to perform a random action.
                    const randomIndex = Math.floor(Math.random() * userIds.length);
                    const user_id = userIds[randomIndex];
                    try {
                        const action = await ActionChoice.performFeatureBasedAction(user_id);
                        console.log(`Agent ${user_id} performed: ${action}`);
                                            } catch (error) {
                        console.error(`Error with agent ${user_id}:`, error);
                    }
                }
            }
        } catch (dbError) {
            console.error('Error querying user IDs:', dbError);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// Start the simulation
ActionSimulation().catch(error => console.error("Simulation error:", error));


