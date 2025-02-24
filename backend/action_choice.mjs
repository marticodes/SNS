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

// const ActionChoice = {
//     async performRandomAction(user_id) {
        
        
        // const user_status = await UserDAO.isActiveUser(user_id);
        // const user_activity_level = await UserDAO.getActivityLevel(user_id);
        // const user_trait = await TraitDAO.getUserTraits(user_id);
        // const persona = await PersonaDAO.getUserPersona(user_id);
        // const social_groups = await SocialGroupDao.getUserSocialGroups(user_id);
        // const interests = await UserInterestDAO.getUserInterests(user_id);

        // const system_prompt = `You are a social media user with the following characteristics:
        // - Social identity: ${social_groups.join(", ")}
        // - Personality traits: ${persona.join(", ")}
        // - Interests: ${interests.join(", ")}
    
        // Your responses should reflect this background **naturally** without explicitly listing and without using all of the attributes. Instead, adopt a tone, style, and perspective that aligns with this persona. You SHOULD NOT mention every attribute—just let them subtly shape the way you respond.`

//         if (user_status === 0) {
//             if (Math.random() < user_activity_level) {
//                 return await UserDAO.updateUserStatus(user_id, 1);
//             }
//             return null;
//         }

//         // If online, small chance to go offline (inverse of activity_level)
//         if (Math.random() < (1 - user_activity_level)) {
//             return UserDAO.updateUserStatus(user_id, 0);
//         }

//         // Perform other actions if still online
//         const actions = [
//             {action: "Update profile picture", weight: user_trait.updating_trait},
//             {action: "Remove profile picture", weight: user_trait.updating_trait},
//             {action: "Update user bio", weight: user_trait.updating_trait},
//             {action: "Start new DM", weight: user_trait.comm_trait},
//             {action: "Start new group chat", weight: user_trait.comm_trait},
//             {action: "Add comment", weight: user_trait.commenting_trait},
//             {action: "Create new channel", weight: user_trait.comm_trait},
//             {action: "Join new channel", weight: user_trait.comm_trait},
//             {action: "Send message", weight: user_trait.messaging_trait},
//             {action: "Clear notificiation", weight: user_trait.notification_trait},
//             {action: "Add post", weight: user_trait.posting_trait},
//             {action: "Update post visibility", weight: user_trait.updating_trait},
//             {action: "Update post", weight: user_trait.updating_trait},
//             {action: "React to post", weight: user_trait.reacting_trait},
//             {action: "React to comment", weight: user_trait.reacting_trait},
//             {action: "React to message", weight: user_trait.reacting_trait},
//             {action: "Send friend request", weight: user_trait.comm_trait},
//             {action: "Delete friend request", weight: user_trait.notification_trait},
//             {action: "Update relation", weight: user_trait.updating_trait},
//             {action: "Update restriction", weight: user_trait.updating_trait},
//             {action: "View a story", weight: user_trait.comm_trait},
//             {action: "Read unread messages", weight: user_trait.notification_trait},
//         ];       
        
//         let totalWeight = actions.reduce((sum, a) => sum + a.weight, 0);
//         let random = Math.random() * totalWeight;
//         let chosenAction = null;

//         for (let a of weightedActions) {
//             if (random < a.weight) {
//                 chosenAction = a.action;
//                 break;
//             }
//             random -= a.weight;
//         }

//         switch (chosenAction) {
//             case "Update profile picture":
//                 await UserDAO.updateProfilePicture(user_id);
//                 break;
        
//                 // DONE
//             case "Remove profile picture": 
//                 await UserDAO.removeProfilePicture(user_id);
//                 break;
        
//             // DONE
//              case "Update user bio":
//                 await Simulation.userBio(user_id, system_prompt);
//                 break;
        
//             case "Start new DM":
//                 await ChatDAO.insertDM(user_id);
//                 break;
        
//             case "Start new group chat":
//                 await ChatDAO.insertGroupChat(user_id);
//                 break;
//        // DONE
//             case "Add comment":
//                 await CommentDAO.insertComment(user_id);
//                 break;
        
//             case "Create new channel":
//                 await CommunityDAO.createNewChannel(user_id);
//                 break;
        
//             case "Join new channel":
//                 await CMemberDAO.addChannel(user_id);
//                 break;
        
//             case "Send message":
//                 await MessageDAO.insertMessage(user_id);
//                 break;
        
//             case "Clear notification":
//                 await NotificationDAO.removeNotification(user_id);
//                 break;
        
//             case "Add post":
//                 await PostDAO.insertPost(user_id);
//                 break;
        
//             case "Update post visibility":
//                 await PostDAO.updatePostVisibility(user_id);
//                 break;
        
//             case "Update post":
//                 await PostDAO.updatePost(user_id);
//                 break;
        
//             case "React to post":
//                 await ReactionDAO.insertPostReaction(user_id);
//                 break;
        
//             case "React to comment":
//                 await ReactionDAO.insertCommentReaction(user_id);
//                 break;
        
//             case "React to message":
//                 await ReactionDAO.insertMessageReaction(user_id);
//                 break;
        
//             case "Send friend request":
//                 await RequestDAO.addRequest(user_id);
//                 break;
        
//             case "Delete friend request":
//                 await RequestDAO.deleteRequest(user_id);
//                 break;
        
//             case "Update relation":
//                 await RelationDAO.updateRelation(user_id);
//                 break;
        
//             case "Update restriction":
//                 await RelationDAO.updateRestriction(user_id);
//                 break;
        
//             case "View a story":
//                 await ViewerDAO.addPostViewer(user_id);
//                 break;
        
//             case "Read unread messages":
//                 await ReceiptsDAO.deleteReceipts(user_id);
//                 break;
        
//             default:
//                 console.log("No action performed.");
//                 break;
//         }
        


//     },
// };


async function testUserBio(user_id = 1) {
    const user_status = await UserDAO.isActiveUser(user_id);
    const user_trait = await TraitDAO.getUserTraits(user_id);
    const persona = await PersonaDAO.getUserPersona(user_id);
    const social_groups = await SocialGroupDao.getUserSocialGroups(user_id);
    const interests = await UserInterestDAO.getUserInterests(user_id);


    const system_prompt = `You are a social media user with the following characteristics:
    - Social identity: ${social_groups.join(", ")}
    - Personality traits: ${persona.join(", ")}
    - Interests: ${interests.join(", ")}
    
    Your responses should reflect this background **naturally** without explicitly listing and without using all of the attributes. Instead, adopt a tone, style, and perspective that aligns with this persona. You SHOULD NOT mention every attribute—just let them subtly shape the way you respond.`
    

    Simulation.insertAGMessage(user_id, system_prompt);

}

testUserBio();



// export default ActionChoice;
