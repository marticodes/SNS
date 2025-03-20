import ActionChoice from './action_choice.mjs';
import { testUserBio } from './action_choice.mjs';

async function makeUsersDoSomething() {
    for (let user_id = 5; user_id <= 14; user_id++) {
        await ActionChoice.performRandomAction(user_id);
        console.log(`User ${user_id} performed a random action!`);
    }
}


testUserBio(6)
testUserBio(7)
testUserBio(8)
testUserBio(9)
testUserBio(10)
