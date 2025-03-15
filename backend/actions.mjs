import ActionChoice from './action_choice.mjs';


async function makeEmmaDoSomething() {
    await ActionChoice.performRandomAction(5);
    console.log("Emma performed a random action!");
}

makeEmmaDoSomething();