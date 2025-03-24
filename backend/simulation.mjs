import OpenAI from "openai";
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
import UserInterestDao from './dao/user_interest_dao.mjs';
import fs from "fs/promises";
import ActionLogsDAO from './dao/action_logs_dao.mjs';


import { OPENAI_API_KEY } from './apiKey.mjs';
import FeedDAO from "./dao/feed_dao.mjs";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY});

async function generateResponse(system_prompt, user_prompt) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: system_prompt },
                { role: "user", content: user_prompt },
            ],
            store: true,
        });
        return completion.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "Error generating response.";
    }
}

async function makeAPIRequest(url, method, body) {
    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed: ${response.status} - ${errorText}`);
        }
        return await response.json();

    } catch (error) {
        console.error(`Error making API request to ${url}:`, error);
        return "Error processing request.";
    }
}

async function selectPostFromFeed(user_id) {
    const feed = Math.random() < 0.5 
        ? await FeedDAO.getFeedFromFriends(user_id) 
        : await FeedDAO.getInterestBasedFeed(user_id);

    if (!feed || feed.length === 0) {
        console.error("No posts found in feed.");
        return null;
    }

    return feed[Math.floor(Math.random() * feed.length)];
}

async function selectCommentOnPost(post_id) {
    const feed = await CommentDAO.getAllComments(post_id, 1);

    if (!feed || feed.length === 0) {
        console.error("No comments found in post.");
        return null;
    }

    return feed[Math.floor(Math.random() * feed.length)];
}

async function selectChatFromInbox(user_id) {
    const feed = await ChatDAO.getAllChatIds(user_id);

    if (!feed || feed.length === 0) {
        console.error("No chats found.");
        return null;
    }

    return feed[Math.floor(Math.random() * feed.length)];
}


const Simulation = {
    async updateAGUserBio(user_id, system_prompt) {
        try {
            const prev_bio = await UserDAO.getUserInfo(user_id).then(user => user.user_bio);
            const user_prompt = `You are about to update your user bio on social media. Your previous bio was: "${prev_bio}". Generate a new bio.`;
            const new_bio = await generateResponse(system_prompt, user_prompt);
            
            await makeAPIRequest("http://localhost:3001/api/user/update/bio", "POST", { user_id, user_bio: new_bio });
        } catch (error) {
            console.error("Error updating user bio:", error);
        }
    },

    async insertAGCommentOnPost(user_id, system_prompt) {
        try {
            const sel_post = await selectPostFromFeed(user_id);
            if (sel_post == null) {
                console.log("No posts to comment on");
                return;
            }
            const closeness = await RelationDAO.getRelation(user_id, sel_post.user_id);
            const user_prompt = `You are about to comment on a post. The content of the post is: "${sel_post.content}". On a scale of 1 to 10, your closeness level with the person is "${closeness}". Generate a comment for the post.`;
            const comment = await generateResponse(system_prompt, user_prompt);

            const time = new Date().toISOString();
            await makeAPIRequest("http://localhost:3001/api/post/comment/add", "POST", {
                parent_id: sel_post.post_id,
                user_id,
                content: comment,
                media_type: 0,
                media_url: null,
                timestamp: time,
                visibility: await UserDAO.getUserInfo(user_id).then(user => user.visibility),
                post: 1,
            });
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    },

    async insertAGCommentOnComment(user_id, system_prompt) {
        try {
            const sel_post = await selectPostFromFeed(user_id);
            if (!sel_post) return;

            const sel_comment =  await selectCommentOnPost(sel_post.post_id);
            if (sel_comment == null) {
                console.log("No comment to reply to");
                return;
            }

            const user_prompt = `You are about to comment on a comment to a post. The content of the post is: "${sel_post.content}". The content of the comment is: "${sel_comment.content}". Generate a comment for the comment "${sel_comment.content}".`;
            const comment = await generateResponse(system_prompt, user_prompt);

            const time = new Date().toISOString();
            await makeAPIRequest("http://localhost:3001/api/post/comment/add", "POST", {
                parent_id: sel_comment.comment_id,
                user_id,
                content: comment,
                media_type: 0,
                media_url: null,
                timestamp: time,
                visibility: await UserDAO.getUserInfo(user_id).then(user => user.visibility),
                post: 0,
            });
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    },

    async insertAGMessage(user_id, system_prompt){

        try {
            const sel_chat_id = await selectChatFromInbox(user_id);
            if (sel_chat_id == null) {
                console.log("No chatrooms found");
                return;
            }

            const sel_messages =  await MessageDAO.getMessageContentByChatId(sel_chat_id);

            let last_messages = "";

            if (!sel_messages || sel_messages.length === 0) {
                last_messages = "No messages";
            }
            
            else last_messages = sel_messages.slice(-10); // Get the last 10 messages (or fewer if not available)

            let people = await ChatDAO.getChatMembers(sel_chat_id);

            let closeness_levels = await Promise.all(
                people.map(async (person) => {
                    let closeness = await RelationDAO.getCloseness(user_id, person);
                    return closeness;
                })
            );
            let social_groups = await SocialGroupDao.getGroupsByIds(people);

            const user_prompt = `You are about to send a message in a conversation in a chatroom. The last messages in the chatroom were: "${last_messages}". 
            There are "${people.length}" people involved in the conversation. Your closeness levels to the people on a scale of 1 to 10 are "${closeness_levels}". 
            You belong to "${social_groups}" soial groups together. 
            Using the provided information as a premise to adopt a tone and style, generate a message to contribute to the ongoing conversation or start a new conversation as you see fit.`;
            
            const message = await generateResponse(system_prompt, user_prompt);

            const time = new Date().toISOString();
            await makeAPIRequest("http://localhost:3001/api/messages/add", "POST", {
                chat_id: sel_chat_id,
                sender_id: user_id,
                reply_id: null,
                content: message,
                media_type:0,
                media_url: null,
                timestamp: time,
            });
        } catch (error) {
            console.error("Error adding message:", error);
        }

    },

    async generatePost(user_id, system_prompt) {
        try {

            const sel_posts =  await PostDAO.getAllPosts(user_id);
            let last_posts = "";

            if (!sel_posts || sel_posts.length === 0) {
                last_posts = "You have not made any posts so far. Make your first post.";
            }
            else {
                last_posts = sel_posts.map(post => post.content).slice(-10);
            }

            const user_prompt = `You are about to make a new post on social media. While making a post ensure that:
            1. The theme of the post is only one. 
            2. Make sure that your new post is signficantly different in content and context to your old posts. 
            3. **Structure the post clearly.** Avoid adding multiple unrelated ideas in a single post.  
            The contents of some of your previous posts are:${last_posts}. 
            Now, generate a new post that sticks to a single theme and maintains a coherent structure.`;
            const new_post = await generateResponse(system_prompt, user_prompt);
            
            const time = new Date().toISOString();
            await makeAPIRequest("http://localhost:3001/api/post/add", "POST", { 
                parent_id: null,
                user_id: user_id, 
                content: new_post, 
                topic: "", 
                media_type: 0, 
                media_url: "", 
                timestamp: time, 
                duration: null, 
                visibility: await UserDAO.getUserInfo(user_id).then(user => user.visibility), 
                comm_id: null});
        } catch (error) {
            console.error("Error adding new post:", error);
        }
    },

    async addAGReaction(user_id, system_prompt){
        try {
            const sel = Math.floor(Math.random() * 3) + 1;
            let choice = "";
            const sel_post = await selectPostFromFeed(user_id);
            let link = "";
            let post_id = null;
            let chat_id = null;
            let comment_id = null;
            let message_id = null;

            switch (sel) {
                case 1:
                    choice = sel_post;
                    if (sel_post == null) {
                        console.log("No posts to react on.");
                        return;
                    }
                    link = "http://localhost:3001/api/reactions/post/add";
                    post_id = choice.post_id;
                    break;
                case 2:
                    if (sel_post == null) {
                        console.log("No posts to react on.");
                        return;
                    }
                    choice = await selectCommentOnPost(sel_post.post_id);
                    if (choice == null) {
                        console.log("No comments to react on.");
                        return;
                    }
                    comment_id =  choice.comment_id;
                    link = "http://localhost:3001/api/reactions/comment/add"
                    break;
                case 3:
                    let chat =  await selectChatFromInbox(user_id);
                    if (chat == null || chat.length === 0) {
                        console.log("No chats found");
                        return;
                    }
                    chat_id = chat;
                    link = "http://localhost:3001/api/reactions/message/add";
                    const sel_messages =  await MessageDAO.getMessagesByChatId(chat_id);
                    if (!sel_messages || sel_messages.length === 0) {
                        return;
                    }
                    choice = sel_messages.slice(-1);
                    message_id = choice[0].message_id;
                    break;
                default:
                    console.error("Unexpected value:", sel);
            }

            const user_prompt = `You find the following on your feed: ${choice.content}. You want to react to the conte. What reaction are you using. Respond using only one reaction and no text`;
            const reaction_type = await generateResponse(system_prompt, user_prompt);
            
            const time = new Date().toISOString();

            await makeAPIRequest(link, "POST", { 
                reaction_type: 4, 
                emote_type: reaction_type,
                post_id: post_id, 
                user_id: user_id, 
                chat_id: chat_id,
                message_id: message_id,
                comment_id: comment_id, 
                timestamp: time,
            });
        } catch (error) {
            console.error("Error adding new reaction:", error);
        }

    },

    async viewAGStory(user_id){
        let feed = await FeedDAO.getEphemeralPosts(user_id);
        if (!feed || feed.length === 0) {
            console.error("No stories found");
            return null;
        }
    
        let sel_post =  feed[Math.floor(Math.random() * feed.length)];

        try {
            await makeAPIRequest("http://localhost:3001/api/viewers/post/add", "POST", { 
                post_id: sel_post.post_id,
                user_id: user_id
            });
        } catch (error) {
            console.error("Error viewing story:", error);
        }

    },

    async updateAGPostVisibility(user_id){
        let feed = await PostDAO.getAllPosts(user_id);
        if (!feed || feed.length === 0) {
            console.error("No posts found.");
            return null;
        }

        let sel_post = feed[Math.floor(Math.random() * feed.length)];

        try {
            await makeAPIRequest("http://localhost:3001/api/posts/visibility", "POST", { 
                post_id: sel_post.post_id,
                visibility: Math.floor(Math.random() * 4),
                user_id: user_id
            });
        } catch (error) {
            console.error("Error updating visibility:", error);
        }

    },

    async updateAGRelation(user_id){
        let relation_type = Math.floor(Math.random() * 4);
        let frens = await RelationDAO.getUsersByRelation(user_id, relation_type);

        if (!frens || frens.length === 0) {
            console.error("No users found.");
            return null;
        }

        let sel_fren = frens[Math.floor(Math.random() * frens.length)];

        try {
            await makeAPIRequest("http://localhost:3001/api/relations/update", "POST", { 
                user_id_1: user_id,
                user_id_2: sel_fren,
                relation_type: Math.floor(Math.random() * 4),
            });
        } catch (error) {
            console.error("Error updating relation:", error);
        }

    },

    async deleteAGRestriction(user_id){
        let frens = await RelationDAO.getRestrictedUsers(user_id);
        if (!frens || frens.length === 0) {
            console.error("No users found.");
            return null;
        }
        let sel_fren = frens[Math.floor(Math.random() * frens.length)];
        try {
            await makeAPIRequest("http://localhost:3001/api/relations/delete/", "DELETE", { 
                user_id_1: user_id,
                user_id_2: sel_fren,
            });
        } catch (error) {
            console.error("Error deleting restriction:", error);
        }
    },

    async deleteAGRelation(user_id){

        let relation_type = Math.floor(Math.random() * 4);
        let frens = await RelationDAO.getUsersByRelation(user_id, relation_type);
        if (!frens || frens.length === 0) {
            console.error("No users found.");
            return null;
        }

        let sel_fren = frens[Math.floor(Math.random() * frens.length)];

        try {
            await makeAPIRequest("http://localhost:3001/api/relations/delete/", "DELETE", { 
                user_id_1: user_id,
                user_id_2: sel_fren,
            });
        } catch (error) {
            console.error("Error deleting relation:", error);
        }
    },

    async startAGDM(user_id){
        let frens = await RelationDAO.getUsersByRelation(user_id, 2);
        if (!frens || frens.length === 0) {
            console.error("No users found.");
            return null;
        }

        let sel_fren = frens[Math.floor(Math.random() * frens.length)];
        let chat = await ChatDAO.checkExistingChat(user_id, sel_fren);

        if (!chat) {
            console.log("No existing chat found. Creating a new one...");
            let user_info = await UserDAO.getUserInfo(sel_fren);
            try {
                await makeAPIRequest("http://localhost:3001/api/chats/add", "POST", { 
                    user_id_1: user_id,
                    user_id_2: sel_fren,
                    chat_name: user_info.id_name, 
                    chat_image: user_info.profile_picture,
                });
            } catch (error) {
                console.error("Error adding new chat", error);
            }
        
        }

    },

    async startAGGroupChat(user_id, system_prompt){
        let frens = await RelationDAO.getUsersByRelation(user_id, 2);
        if (!frens || frens.length === 0) {
            console.error("No users found.");
            return null;
        }

        let sel_fren = frens.sort(() => Math.random() - 0.5).slice(0, 3);
        let closeness_levels = await Promise.all(
            sel_fren.map(async (person) => {
                let closeness = await RelationDAO.getCloseness(user_id, person);
                return closeness;
            })
        );

        let social_groups = await SocialGroupDao.getGroupsByIds(sel_fren);
        const user_prompt = `You are about to create a group chat with "${sel_fren.length}" people. 
        Your closeness levels to the people on a scale of 1 to 10 are "${closeness_levels}". 
        You belong to "${social_groups}" soial groups together. 
        Using the provided information as a premise, generate a name for the group chat. Be straightforward and reply with just the name`;
        
        const name = await generateResponse(system_prompt, user_prompt);
        try {
            await makeAPIRequest("http://localhost:3001/api/chats/group/add", "POST", { 
                user_ids: sel_fren,
                chat_name: name,
                chat_image: null,
                user_id: user_id
            });
        } catch (error) {
            console.error("Error adding new chat", error);
        }

    },

    async createAGChannel(user_id, system_prompt){
        let user_prompt = `You are about to create a new community channel.
        Using the provided information as a premise, generate a name for the community channel. Be straightforward and reply with just the name`;
        let name = await generateResponse(system_prompt, user_prompt);
        user_prompt = `You just created a channel ${name}. Now create a bio for this channel`;        
        let bio = await generateResponse(system_prompt, user_prompt);
        try {
            let id = await makeAPIRequest("http://localhost:3001/api/channels/create", "POST", { 
                comm_name: name,
                comm_bio: bio,
                comm_image: null,
                user_id: user_id
            });
            await makeAPIRequest("http://localhost:3001/api/channels/add", "POST", { 
                user_id: user_id,
                comm_id: id.ina,
            });
        } catch (error) {
            console.error("Error adding new channel", error);
        }
    },

    async readAGMessages(user_id){
        let unread = await ReceiptsDAO.getUnreadChats(user_id);
        if (!unread || unread.length === 0) {
            console.log('No unread chats');
            return;
        }
        let sel = unread[Math.floor(Math.random() * unread.length)];
        
        try {
            await makeAPIRequest("http://localhost:3001/api/read/receipts/delete", "DELETE", { 
                chat_id: sel,
                user_id: user_id,
            });
        } catch (error) {
            console.error("Error reading message:", error);
        }
    },

    async sendRequest(user_id){
        let frens = await RelationDAO.getRecommendedFriends(user_id);
        console.log(frens);
        if (!frens || frens.length === 0) {
            console.error("No recommended friends.");
            return null;
        }
        let sel_fren = frens[Math.floor(Math.random() * frens.length)];
        try {
            await makeAPIRequest("http://localhost:3001/api/requests/add", "POST", { 
                user_id_1: user_id,
                user_id_2: sel_fren
            });
        } catch (error) {
            console.error("Error sending request:", error);
        }
    },

    async acceptRequest(user_id){
        let frens = await RequestDAO.getRequests(user_id);
        if (!frens || frens.length === 0) {
            console.error("No requests found.");
            return null;
        }
        let sel_fren = frens[Math.floor(Math.random() * frens.length)];
        let closeness = Math.floor(Math.random() * 11);
        try {
            await makeAPIRequest("http://localhost:3001/api/relations/add", "POST", { 
                user_id_1: sel_fren,
                user_id_2: user_id,
                relation_type: 2,
                restricted: 0,
                closeness: closeness,
            });

            await makeAPIRequest("http://localhost:3001/api/requests/delete", "DELETE", { 
                user_id_1: sel_fren,
                user_id_2: user_id,
            });

        } catch (error) {
            console.error("Error accepting request:", error);
        }
    },

    async deleteRequest(user_id){
        let frens = await RequestDAO.getRequests(user_id);
        if (!frens || frens.length === 0) {
            console.error("No requests found.");
            return null;
        }
        let sel_fren = frens[Math.floor(Math.random() * frens.length)];
        try {
            await makeAPIRequest("http://localhost:3001/api/requests/delete", "DELETE", { 
                user_id_1: sel_fren,
                user_id_2: user_id,
            });

        } catch (error) {
            console.error("Error deleting request:", error);
        }
    },

    async joinChannel(user_id, system_prompt){
        let communities = await CommunityDAO.getAllUserCommunities(user_id);
        if (!communities || communities.length === 0) {
            console.error("No communities found.");
            return null;
        }
        
        let user_prompt = `You want to join a new community. Based on your personality, choose **one** from the list below.  
        Be direct and reply with **only the community ID** of the selected community.  

        Available communities:  
        ${communities.map(comm => `ID: ${comm.comm_id} | Name: ${comm.comm_name} | Bio: ${comm.comm_bio}`).join('\n')}`;

        let comm_id = await generateResponse(system_prompt, user_prompt);   
        
        try {
            await makeAPIRequest("http://localhost:3001/api/channels/add", "POST", { 
                user_id: user_id,
                comm_id: comm_id,
            });
        } catch (error) {
            console.error("Error adding new channel", error);
        }
    },


};
export default Simulation;