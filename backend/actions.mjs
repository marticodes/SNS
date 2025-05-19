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
            if (userIds.length > 0) {
                // Process all users in parallel
                await Promise.all(userIds.map(async (user_id) => {
                    try {
                        // Run all actions for this user in parallel
                        const [apiAction1, featureAction] = await Promise.all([
                            ActionChoice.performAPIBasedAction(user_id),
                            ActionChoice.performFeatureBasedAction(user_id)
                        ]);

                        // Log all actions for this user
                        console.log(`Agent ${user_id} performed actions:`, {
                            apiAction1,
                            featureAction
                        });
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


