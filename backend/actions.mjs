import ActionChoice from './action_choice.mjs';
import db from './db.mjs';

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
            if (userIds.length === 0) {
                console.warn("No user IDs found in the database.");
            } else {
                const randomIndex = Math.floor(Math.random() * userIds.length);
                const user_id = userIds[randomIndex];
                try {
                    await ActionChoice.performRandomAction(user_id);
                    console.log(`Agent ${user_id} performed a random action.`);
                } catch (error) {
                    console.error(`Error with agent ${user_id}:`, error);
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

async function CreateAgentfromScratch() {


}