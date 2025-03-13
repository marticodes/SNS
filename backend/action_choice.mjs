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

        The above characteristics are simply used to describe who you are as a person and should not be repeated in every generation
        
        Your responses should reflect this background **naturally** without explicitly listing and without using all of the attributes. Instead, adopt a tone, style, and perspective that aligns with this persona. You SHOULD NOT mention every attribute—just let them subtly shape the way you respond.`

        if (user_status === 0) {
            if (Math.random() < user_activity_level) {
                return await UserDAO.updateUserStatus(user_id, 1);
            }
            return null;
        }

        // If online, small chance to go offline (inverse of activity_level)
        if (Math.random() < (1 - user_activity_level)) {
            return UserDAO.updateUserStatus(user_id, 0);
        }

        // Perform other actions if still online
        const actions = [
             {action: "Update user bio", weight: user_trait.updating_trait},//
             {action: "Start new DM", weight: user_trait.comm_trait},
             {action: "Start new group chat", weight: user_trait.comm_trait},
             {action: "Add comment on post", weight: user_trait.commenting_trait},
             {action: "Add comment on comment", weight: user_trait.commenting_trait},
             {action: "Create new channel", weight: user_trait.comm_trait},
             {action: "Send message", weight: user_trait.messaging_trait},
             {action: "Add post", weight: user_trait.posting_trait},
             {action: "Update post visibility", weight: user_trait.updating_trait},//
             {action: "React", weight: user_trait.reacting_trait},
             {action: "Send friend request", weight: user_trait.comm_trait},
             {action: "Delete relation", weight: user_trait.notification_trait},
             {action: "Update relation", weight: user_trait.updating_trait},
             {action: "Update restriction", weight: user_trait.updating_trait},
             {action: "View a story", weight: user_trait.comm_trait},
             {action: "Read unread messages", weight: user_trait.notification_trait},//
        ];       
        
        let totalWeight = actions.reduce((sum, a) => sum + a.weight, 0);
        let random = Math.random() * totalWeight;
        let chosenAction = null;

        for (let a of weightedActions) {
            if (random < a.weight) {
                chosenAction = a.action;
                break;
            }
            random -= a.weight;
        }

        switch (chosenAction) {
             case "Update user bio":
                await Simulation.updateAGUserBio(user_id, system_prompt);
                break;
        
            case "Start new DM":
                await Simulation.startAGDM(user_id);
                break;
        
            case "Start new group chat":
                await Simulation.startAGGroupChat(user_id, system_prompt);
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
        
            case "Send message":
                await Simulation.insertAGMessage(user_id, system_prompt);
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
        
            case "Delete relation":
                await Simulation.deleteAGRelation(user_id);
                break;
        
            case "Update relation":
                await Simulation.updateAGRelation(user_id);
                break;
        
            case "Update restriction":
                await Simulation.deleteAGRestriction(user_id);
                break;
        
            case "View a story":
                await Simulation.viewAGStory(user_id);
                break;
        
            case "Read unread messages":
                await Simulation.readAGMessages(user_id);
                break;
        
            default:
                console.log("No action performed.");
                break;
        }

    },
};


async function testUserBio(user_id = 2) {
    
    const user_trait = await TraitDAO.getUserTraits(user_id);
        const persona = await PersonaDAO.getUserPersona(user_id);
        const social_groups = await SocialGroupDao.getUserSocialGroups(user_id);
        const interests = await UserInterestDAO.getUserInterests(user_id);


        const system_prompt = `You are a social media user with the following characteristics:
        - Social identity: ${social_groups.join(", ")}
        - Personality traits: ${persona.join(", ")}
        - Interests: ${interests.join(", ")}

        The above characteristics are simply used to describe who you are as a person and should not be repeated in every generation
        
        Your responses should reflect this background **naturally** without explicitly listing and without using all of the attributes. Instead, adopt a tone, style, and perspective that aligns with this persona. You SHOULD NOT mention every attribute—just let them subtly shape the way you respond.`
    Simulation.generatePost(user_id, system_prompt);
}

testUserBio();



export default ActionChoice;
