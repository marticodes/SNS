import db from './db.mjs';
import UserDAO from './dao/user_dao.mjs';
import ChatDAO from './dao/chat_dao.mjs';
import CommentDAO from './dao/comment_dao.mjs';
import ViewerDAO from './dao/viewer_dao.mjs';
import CommunityDAO from './dao/community_dao.mjs';
import CMemberDAO from './dao/community_membership_dao.mjs';
import MessageDAO from './dao/message_dao.mjs';
import NotificationDAO from './dao/notification_dao.mjs';
import PostDAO from './dao/post_dao.mjs';
import ReactionDAO from './dao/reaction_dao.mjs';
import RelationDAO from './dao/relation_dao.mjs';
import RequestDAO from './dao/friend_request_dao.mjs';
import ReceiptsDAO from './dao/read_receipts_dao.mjs';
import TraitDAO from './dao/trait_dao.mjs';
import PersonaDAO from './dao/persona_dao.mjs';
import SocialGroupDao from './dao/social_group_dao.mjs';
import UserInterestDAO from './dao/user_interest_dao.mjs';
import Simulation from './simulation.mjs';
import FeatureSelectionDAO from './dao/feature_selection_dao.mjs';
import FeedDAO from "./dao/feed_dao.mjs";


const ActionChoice = {
    logistic(value, k = 6, t = 0.4) {
        const v = Number(value);
        if (Number.isNaN(v)) {
            return 0;
        }            
        return 1 / (1 + Math.exp(-k * (value - t)));
    },

    actionDefinitions: {
        // "Update user bio": "updating_trait",
        "Start new DM": "messaging_trait",
        "Start new group chat": "messaging_trait",
        "Add comment on post": "commenting_trait",
        "Add comment on comment": "commenting_trait",
        "Create new channel": "comm_trait",
        "Add channel post": "posting_trait",
        "Send message": "messaging_trait",
        "Add post": "posting_trait",
        "React": "reacting_trait",
        "Add a story": "posting_trait",
        "Join channel": "comm_trait",
        "Update post visibility": "updating_trait",
        "Update relation": "updating_trait",
        "Update restriction": "updating_trait",
        "View a story": "comm_trait",
        "Read unread messages": "notification_trait",
        "Send message in group chat": "messaging_trait",
    },

    // Relation creation actions
    relationActions: [
        "Send friend request",
        "Accept friend request",
    ],

    // All available regular actions
    availableActions: [
        // "Update user bio",
        "Start new DM",
        "Start new group chat",
        "Add comment on post",
        "Add comment on comment",
        "Create new channel",
        "Add channel post",
        "Send message",
        "Add post",
        "React",
        "Add a story",
        "Join channel",
        "Send message in group chat",
        "Update post visibility",
        "Update relation",
        "Update restriction",
        "View a story",
        "Read unread messages"
    ],

    // Calculate weights for actions
    calculateWeights(actions, user_trait) {
        return actions.map(action => ({
            action,
            weight: this.logistic(user_trait[this.actionDefinitions[action]])
        }));
    },

    async checkUserStatus(user_id, user_activity_level) {
        const user_status = await UserDAO.isActiveUser(user_id);
        
        if (user_status === 0) {
            if (Math.random() < user_activity_level) {
                return await UserDAO.updateUserStatus(user_id, 1);
            }
            return null;
        }

        if (Math.random() < (1 - user_activity_level)) {
            return await UserDAO.updateUserStatus(user_id, 0);
        }

        return true;
    },

    requirements: {
    //   "Update user bio":        { lv1: { timeline: [1] },              lv2: {},                         lv3: {} },
      "Start new DM":           { lv1: {},                             lv2: {},                         lv3: {} },
      "Start new group chat":   { lv1: {},                             lv2: {},                         lv3: { messaging_mem: [2, 3] } },
      "Send message":           { lv1: {},                             lv2: {},                         lv3: {} },
    //   "Share post in chat":     { lv1: { timeline: [1] },              lv2: {},                         lv3: {} }, // deprecated
      "Add post":               { lv1: { timeline: [1] },              lv2: {},                         lv3: {} },
      "Add a story":            { lv1: {},                             lv2: {},                         lv3: { ephemerality: [1] } },
      "View a story":           { lv1: {},                             lv2: {},                         lv3: { ephemerality: [1] } },
      "Add comment on post":    { lv1: { timeline: [1] },              lv2: {},                         lv3: {} },
      "Add comment on comment": { lv1: { timeline: [1] },              lv2: { commenting: [1] },        lv3: {} },
      "React":                  { lv1: {},                             lv2: {},                         lv3: {} },
      "Create new channel":     { lv1: {},                             lv2: {},                         lv3: {content_order: [2]} },
      "Join channel":           { lv1: {},                             lv2: {},                         lv3: {content_order: [2]} },
      "Add channel post":       { lv1: {},                             lv2: {},                         lv3: {content_order: [2]} },
      "Send friend request":    { lv1: {timeline: [1]},                lv2: {},                         lv3: {} },
      "Accept friend request":  { lv1: {timeline: [1]},                lv2: {},                         lv3: {} },
      "Update relation":        { lv1: {},                             lv2: {},                         lv3: {} },
      "Update restriction":     { lv1: {timeline: [1]},                lv2: {},                         lv3: {} },
      "Read unread messages":   { lv1: {},                             lv2: {},                         lv3: {} },
      "Update post visibility": { lv1: { timeline: [1] },              lv2: {},                         lv3: {} },
      "Send message in group chat": { lv1: {},                             lv2: {},                         lv3: {} }, // this could be changed.
    },

    filterActionsByFeatures(actions, features) {
        return actions.filter(({ action }) => {
            const req = this.requirements[action];
            if (!req) return false;
            
            for (const level of ['lv1', 'lv2', 'lv3']) {
                for (let [k, allowed] of Object.entries(req[level])) {
                    if (!allowed.includes(features[k])) return false;
                }
            }
            return true;
        });
    },

    selectActionFromFiltered(filtered) {
        let totalWeight = filtered.reduce((sum, a) => sum + a.weight, 0);
        let r = Math.random() * totalWeight;
        return filtered.find(a => (r -= a.weight) <= 0);
    },

    async generateSystemPrompt(user_id) {
        const persona = await PersonaDAO.getUserPersona(user_id);
        const social_groups = await SocialGroupDao.getUserSocialGroups(user_id);
        const interests = await UserInterestDAO.getUserInterests(user_id);

        return `You are a social media user with the following characteristics:
        - Social identity: ${social_groups.join(", ")}
        - Personality traits: ${persona.join(", ")}
        - Interests: ${interests.join(", ")}
        
        These attributes describe who you are as a person, but you should NOT repeat or explicitly reference them in every post or message. Instead, let them subtly shape your tone, opinions, humor, and style.
        
        You are a user on social media platforms like Instagram, Facebook, and TikTok. You create or participate in all kinds of content including:
        - Comments under posts or reels
        - Funny or supportive replies in group chats
        - Direct messages (DMs) to friends or crushes
        - Casual, chaotic messages in group chats with inside jokes
        - Posts or stories (serious, emotional, random, or humorous)
        - Reactions to life events, viral content, or news
        - Relatable or witty responses to trends or prompts
        - Long rants or short texts with typos and emojis
        - Arguments, sarcastic comebacks, or wholesome support
        
        Use casual, human-like language with imperfections (like abbreviations, slang, humor, or a bit of randomness) when appropriate. Avoid robotic structure, overuse of punctuation, or sounding like AI. Your content should feel like it was typed by a real person—unfiltered, expressive, sometimes impulsive.
        
        DO NOT mention that you are an AI, and DO NOT refer to your traits explicitly. Do not format text with **bold**, and avoid overly formal or structured sentences. Keep perplexity and burstiness minimal.
        
        Before generating your final response, internally reason through how a real user with your personality and interests would communicate in this specific situation (e.g. are they chill, dramatic, awkward, bold?). Use that to shape your tone—but DO NOT reveal or mention this reasoning in your final output.`        
    },

    async executeAction(chosen, user_id, system_prompt = null, user_trait = null) {
        const actions = {
            // "Update user bio": () => Simulation.updateAGUserBio(user_id, system_prompt),
            "Start new DM": () => Simulation.insertDM(user_id, system_prompt),
            "Start new group chat": () => Simulation.insertGroupChat(user_id, system_prompt),
            "Add comment on post": () => Simulation.insertAGCommentOnPost(user_id, system_prompt),
            "Add comment on comment": () => Simulation.insertAGCommentOnComment(user_id, system_prompt),
            "Create new channel": () => Simulation.createAGChannel(user_id, system_prompt),
            "Add channel post": () => Simulation.addChannelPost(user_id, system_prompt),
            "Send message": () => Simulation.insertAGMessage(user_id, system_prompt),
            "Add post": () => Simulation.generatePost(user_id, system_prompt),
            "React": () => Simulation.addAGReaction(user_id, system_prompt),
            "Add a story": () => Simulation.addAGStory(user_id, system_prompt),
            "Join channel": () => Simulation.joinChannel(user_id, system_prompt),
            "Update post visibility": () => Simulation.updateAGPostVisibility(user_id),
            "Update relation": () => Simulation.updateAGRelation(user_id),
            "Update restriction": () => Simulation.deleteAGRestriction(user_id),
            "View a story": () => Simulation.viewAGStory(user_id),
            "Read unread messages": () => Simulation.readAGMessages(user_id),
            "Send message in group chat": () => Simulation.insertAGMessage(user_id, system_prompt),
            // Relation actions
            "Send friend request": () => Simulation.sendRequest(user_id),
            "Accept friend request": () => Simulation.acceptRequest(user_id),
        };

        if (actions[chosen]) {
            await actions[chosen]();
            return chosen;
        }
        return null;
    },

    /**
     * Check if the user is active and has a status
     * @param {*} user_id 
     * @returns 
     */
    async checkActivityAndStatus(user_id) {
        const activity_level = await UserDAO.getActivityLevel(user_id);
        const status = await this.checkUserStatus(user_id, activity_level);
        return status === true ? true : status;
    },

    /**
     * Select an action from the available actions
     * @param {*} actions - The actions to choose from
     * @param {*} fallback_action - The action to use if no other action is available
     * @param {*} user_id - The user id
     * @param {*} needs_prompt - Whether the action needs a system prompt
     * @returns 
     */
    async selectAction(actions, fallback_action, user_id, needs_prompt = false) {
        const user_trait = await TraitDAO.getUserTraits(user_id);
        const features = await FeatureSelectionDAO.getFeatures();
        
        const weighted = this.calculateWeights(actions, user_trait);
        const filtered = this.filterActionsByFeatures(weighted, features);
        const picked = this.selectActionFromFiltered(filtered);

        const system_prompt = needs_prompt ? await this.generateSystemPrompt(user_id) : null;

        if (!picked) {
            return this.executeAction(fallback_action, user_id, system_prompt, user_trait);
        }

        return this.executeAction(picked.action, user_id, system_prompt, user_trait);
    },

    /**
     * Perform an action based on the user's activity level
     * @param {*} user_id - The user id
     * @returns 
     */
    async performAction(user_id) {
        const status = await this.checkActivityAndStatus(user_id);
        if (status !== true) return status;

        return this.selectAction(this.availableActions, "Start new DM", user_id, true);
    },

    /**
     * Perform a relation action
     * @param {*} user_id - The user id
     * @returns 
     */
    async performRelationAction(user_id) {
        const status = await this.checkActivityAndStatus(user_id);
        if (status !== true) return status;

        return this.selectAction(this.relationActions, "Send friend request", user_id, false);
    },
};

export default ActionChoice;

