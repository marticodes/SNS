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
    async performRandomAction(user_id) {
        const user_status = await UserDAO.isActiveUser(user_id);
        const user_activity_level = await UserDAO.getActivityLevel(user_id);
        const user_trait = await TraitDAO.getUserTraits(user_id);
        const persona = await PersonaDAO.getUserPersona(user_id);
        const social_groups = await SocialGroupDao.getUserSocialGroups(user_id);
        const interests = await UserInterestDAO.getUserInterests(user_id);

        const system_prompt = `You are a social media user with the following characteristics:
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
        if (user_status === 0) {
            if (Math.random() < user_activity_level) {
                return await UserDAO.updateUserStatus(user_id, 1);
            }
            return null;
        }

        // If online, small chance to go offline (inverse of activity_level)
        if (Math.random() < (1 - user_activity_level)) {
            return await UserDAO.updateUserStatus(user_id, 0);
        }

        // Define the logistic function to transform trait values into probabilities
        function logistic(value, k = 6, t = 0.4) {
            return 1 / (1 + Math.exp(-k * (value - t)));
        }

        const actions = [
            { action: "Update user bio", weight: logistic(user_trait.updating_trait) },
            { action: "Start new DM", weight: logistic(user_trait.messaging_trait) },
            { action: "Start new group chat", weight: logistic(user_trait.messaging_trait) },
            { action: "Add comment on post", weight: logistic(user_trait.commenting_trait) },
            { action: "Add comment on comment", weight: logistic(user_trait.commenting_trait) },
            { action: "Create new channel", weight: logistic(user_trait.comm_trait) },
            { action: "Add channel post", weight: logistic(user_trait.posting_trait) },
            { action: "Send message", weight: logistic(user_trait.messaging_trait) },
            { action: "Add post", weight: logistic(user_trait.posting_trait) },
            { action: "Update post visibility", weight: logistic(user_trait.updating_trait) },
            { action: "React", weight: logistic(user_trait.reacting_trait) },
            { action: "Send friend request", weight: logistic(user_trait.comm_trait) },
            {action: "Accept friend request", weight: logistic(user_trait.comm_trait)},
            {action: "Delete friend request", weight: logistic(user_trait.comm_trait)},
            { action: "Delete relation", weight: logistic(user_trait.comm_trait) },
            { action: "Update relation", weight: logistic(user_trait.updating_trait) },
            { action: "Update restriction", weight: logistic(user_trait.updating_trait) },
            { action: "View a story", weight: logistic(user_trait.comm_trait) },
            { action: "Read unread messages", weight: logistic(user_trait.notification_trait) },
            { action: "Join channel", weight: logistic(user_trait.comm_trait) },
            { action: "Add a story", weight: logistic(user_trait.posting_trait)},
            // { action: "Share post in chat", weight: logistic(user_trait.messaging_trait)}
        ];

        let totalWeight = actions.reduce((sum, a) => sum + a.weight, 0);
        let random = Math.random() * totalWeight;
        let chosenAction = null;

        for (let a of actions) {
            if (random < a.weight) {
                chosenAction = a.action;
                break;
            }
            random -= a.weight;
        }
        
        // chosenAction = "Share post in chat";

        // Fallback
        if (!chosenAction) {
            if (!chosenAction) {
                chosenAction = "React";
            }        }
        switch (chosenAction) {
            case "Update user bio":
                await Simulation.updateAGUserBio(user_id, system_prompt);
                break;
            case "Send DM":
                await Simulation.insertDM(user_id, system_prompt);
                break;
            case "Send message in group chat":
                await Simulation.insertGroupChat(user_id, system_prompt);
                break;
            case "Share post in chat":
                await Simulation.sharePost(user_id);
                break;
            case "Send message":
                await Simulation.insertAGMessage(user_id, system_prompt);
                break;
            case "Add comment on post":
                await Simulation.insertAGCommentOnPost(user_id, system_prompt);
                break;
            case "Add comment on comment":
                await Simulation.insertAGCommentOnComment(user_id, system_prompt);
                break;
            case "Create new channel":
                await Simulation.createAGChannel(user_id, system_prompt);
                break;
            case "Add channel post":
                await Simulation.addChannelPost(user_id, system_prompt);
                break;
            case "Clear notification":
                await NotificationDAO.removeNotification(user_id);
                break;
            case "Add post":
                await Simulation.generatePost(user_id, system_prompt);
                break;
            case "Update post visibility":
                await Simulation.updateAGPostVisibility(user_id);
                break;
            case "React":
                await Simulation.addAGReaction(user_id, system_prompt);
                break;
            case "Send friend request":
                await Simulation.sendRequest(user_id);
                break;
            case "Accept friend request":
                await Simulation.acceptRequest(user_id);
                break;
            case "Delete friend request":
                await Simulation.deleteRequest(user_id);
                break;
            case "Delete relation":
                await Simulation.deleteAGRelation(user_id);
                break;
            case "Update relation":
                await Simulation.updateAGRelation(user_id);
                break;
            case "Update restriction":
                await Simulation.deleteAGRestriction(user_id);
                break;
            case "Add a story":
                await Simulation.addAGStory(user_id, system_prompt);
                break;
            case "View a story":
                await Simulation.viewAGStory(user_id);
                break;
            case "Read unread messages":
                await Simulation.readAGMessages(user_id);
                break;
            case "Join channel":
                await Simulation.joinChannel(user_id, system_prompt);
                break;
            default:
                console.log("No action performed.");
                break;
        }
    },
    async performFeatureBasedAction(user_id) {
        const user_status        = await UserDAO.isActiveUser(user_id);
        const user_activity_level = await UserDAO.getActivityLevel(user_id);
        const user_trait         = await TraitDAO.getUserTraits(user_id);
        const persona            = await PersonaDAO.getUserPersona(user_id);
        const social_groups      = await SocialGroupDao.getUserSocialGroups(user_id);
        const interests          = await UserInterestDAO.getUserInterests(user_id);
    
        const system_prompt = `You are a social media user with the following characteristics:
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
    
        if (user_status === 0) {
            if (Math.random() < user_activity_level) {
                return await UserDAO.updateUserStatus(user_id, 1);
            }
            return null;
        }
        if (Math.random() < (1 - user_activity_level)) {
            return await UserDAO.updateUserStatus(user_id, 0);
        }

        const f = await FeatureSelectionDAO.getFeatures();
        
    
        function logistic(value, k = 6, t = 0.4) {
          const v = Number(value);
          if (Number.isNaN(v)) {
            return 0;
          }            
          return 1 / (1 + Math.exp(-k * (value - t)));
        }

        const actions = [
            { action: "Update user bio",          weight: logistic(user_trait.updating_trait) },
            { action: "Start new DM",             weight: logistic(user_trait.messaging_trait) },
            { action: "Start new group chat",     weight: logistic(user_trait.messaging_trait) },
            { action: "Add comment on post",      weight: logistic(user_trait.commenting_trait) },
            { action: "Add comment on comment",   weight: logistic(user_trait.commenting_trait) },
            { action: "Create new channel",       weight: logistic(user_trait.comm_trait) },
            { action: "Add channel post",         weight: logistic(user_trait.posting_trait) },
            { action: "Send message",             weight: logistic(user_trait.messaging_trait) },
            { action: "Add post",                 weight: logistic(user_trait.posting_trait) },
            { action: "Update post visibility",   weight: logistic(user_trait.updating_trait) },
            { action: "React",                    weight: logistic(user_trait.reacting_trait) },
            { action: "Send friend request",      weight: logistic(user_trait.comm_trait) },
            { action: "Accept friend request",    weight: logistic(user_trait.comm_trait) },
            { action: "Delete friend request",    weight: logistic(user_trait.comm_trait) },
            { action: "Delete relation",          weight: logistic(user_trait.comm_trait) },
            { action: "Update relation",          weight: logistic(user_trait.updating_trait) },
            { action: "Update restriction",       weight: logistic(user_trait.updating_trait) },
            { action: "View a story",             weight: logistic(user_trait.comm_trait) },
            { action: "Read unread messages",     weight: logistic(user_trait.notification_trait) },
            { action: "Join channel",             weight: logistic(user_trait.comm_trait) },
            { action: "Add a story",              weight: logistic(user_trait.posting_trait) },
            { action: "Share post in chat",       weight: logistic(user_trait.messaging_trait) },
        ];
    
        const requirements = {
            "Update user bio":        { lv1: { timeline: [1] },              lv2: {},                         lv3: {} },
            "Start new DM":           { lv1: {},                             lv2: {},                         lv3: {} },
            "Start new group chat":   { lv1: {},                             lv2: {},                         lv3: { messaging_mem: [2, 3] } },
            "Send message":           { lv1: {},                             lv2: {},                         lv3: {} },
            "Share post in chat":     { lv1: { timeline: [1] },              lv2: {},                         lv3: {} },
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
            "Delete friend request":  { lv1: {timeline: [1]},                lv2: {},                         lv3: {} },
            "Delete relation":        { lv1: {},                             lv2: {},                         lv3: {} },
            "Update relation":        { lv1: {},                             lv2: {},                         lv3: {} },
            "Update restriction":     { lv1: {timeline: [1]},                lv2: {},                         lv3: {} },
            "Read unread messages":   { lv1: {},                             lv2: {},                         lv3: {} },
            "Update post visibility": { lv1: { timeline: [1] },              lv2: {},                         lv3: {} },
          }; 
        //console.log("Feature flags f=", f);
        //console.log("Actions & weights:", actions.map(a => [a.action, a.weight]));
   
        const filtered = actions.filter(({ action }) => {
          const req = requirements[action];
          if (!req) return false;
          // LV1 checks
          for (let [k, allowed] of Object.entries(req.lv1)) {
            if (!allowed.includes(f[k])) return false;
          }
          // LV2 checks
          for (let [k, allowed] of Object.entries(req.lv2)) {
            if (!allowed.includes(f[k])) return false;
          }
          // LV3 checks
          for (let [k, allowed] of Object.entries(req.lv3)) {
            if (!allowed.includes(f[k])) return false;
          }
          return true;
        });
    
        // 8) If nothing passes, fall back to fully random
        //if (filtered.length === 0) {
          //return this.performRandomAction(user_id);
        //}
    
        let totalWeight = filtered.reduce((sum, a) => sum + a.weight, 0);
        let r = Math.random() * totalWeight;
        const picked = filtered.find(a => (r -= a.weight) <= 0);
        if (!picked) {
          await Simulation.insertDM(user_id, system_prompt);
          return "Start new DM";
        }
        
        const chosen = picked.action;    
        switch (chosen) {
          case "Update user bio":
            await Simulation.updateAGUserBio(user_id, system_prompt);
            return "Update user bio"
          case "Start new DM":
            await Simulation.insertDM(user_id, system_prompt);
            return "Start new DM"
          case "Start new group chat":
            await Simulation.insertGroupChat(user_id, system_prompt);
            return "Start new group chat"
          case "Add comment on post":
            await Simulation.insertAGCommentOnPost(user_id, system_prompt);
            return "Add comment on post"
          case "Add comment on comment":
            await Simulation.insertAGCommentOnComment(user_id, system_prompt);
            return "Add comment on comment"
          case "Create new channel":
            await Simulation.createAGChannel(user_id, system_prompt);
            return "Create new channel"
          case "Add channel post":
            await Simulation.addChannelPost(user_id, system_prompt);
            return "Add channel post"
          case "Share post in chat":
            await Simulation.sharePost(user_id);
            return "Share post in chat"
          case "Send message":
            await Simulation.insertAGMessage(user_id, system_prompt);
            return "Send message"
          case "Add post":
            await Simulation.generatePost(user_id, system_prompt);
            return "Add post"
          case "Update post visibility":
            await Simulation.updateAGPostVisibility(user_id);
            return "Update post visibility"
          case "React":
            await Simulation.addAGReaction(user_id, system_prompt);
            return "React"
          case "Send friend request":
            await Simulation.sendRequest(user_id);
            return "Send friend request"
          case "Accept friend request":
            await Simulation.acceptRequest(user_id);
            return "Accept friend request"
          case "Delete friend request":
            await Simulation.deleteRequest(user_id);
            return "Accept friend request"

          case "Delete relation":
            await Simulation.deleteAGRelation(user_id);
            return "Delete relation"

          case "Update relation":
            await Simulation.updateAGRelation(user_id);
            return "Update relation"

          case "Update restriction":
            await Simulation.deleteAGRestriction(user_id);
            return "Update restriction"

          case "View a story":
            await Simulation.viewAGStory(user_id);
            return "View a story"

          case "Read unread messages":
            await Simulation.readAGMessages(user_id);
            return "Read unread messages"

          case "Join channel":
            await Simulation.joinChannel(user_id, system_prompt);
            return "Join channel"

          case "Add a story":
            await Simulation.addAGStory(user_id, system_prompt);
            return "Add a story"

          default:
            console.log("No action performed.");
        }
    },
  
};

export default ActionChoice;

