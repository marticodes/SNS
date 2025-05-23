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
import FeatureSelectionDAO from "./dao/feature_selection_dao.mjs";

const natural = await import("natural");
const { TfIdf } = natural.default; 

const openai = new OpenAI({ apiKey: OPENAI_API_KEY});
const { JaroWinklerDistance } = natural.default; 

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

async function selectPostForComment(user_id) {
    const feed = await FeedDAO.getcombinedFeedforComment(user_id);
    // console.log(feed);

    if (!feed || feed.length === 0) {
        console.error("No posts found in feed.");
        return null;
    }

    return feed[Math.floor(Math.random() * feed.length)];
}

async function selectPostForReaction(user_id) {
    const feed = await FeedDAO.getcombinedFeedforReaction(user_id);
    // console.log(feed);

    if (!feed || feed.length === 0) {
        console.error("No posts found in feed.");
        return null;
    }

    return feed[Math.floor(Math.random() * feed.length)];
}

async function selectPostFromFeed(user_id) {
    const feed = await FeedDAO.getcombinedFeed(user_id);
    // console.log(feed);

    if (!feed || feed.length === 0) {
        console.error("No posts found in feed.");
        return null;
    }

    return feed[Math.floor(Math.random() * feed.length)];
}

async function selectPostToShare(user_id, receiver) {
    const feed = await FeedDAO.getcombinedFeed(user_id);
    // console.log(feed);

    if (!feed || feed.length === 0) {
        console.error("No posts found in feed.");
        return null;
    }

    const post_ids = feed.map(feed=>feed.post_id);
    const share_feed = await FeedDAO.sharable_feed(post_ids, receiver);

    if (!share_feed || share_feed.length === 0) {
        console.error("No posts found in feed.");
        return null;
    }

    return share_feed[Math.floor(Math.random() * share_feed.length)];
}

async function selectCommentOnPost(post_id, user_id) {
    const feed = await CommentDAO.getAllCommentsForAction(post_id, 1, user_id);
    // console.log(feed);
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
    // async updateAGUserBio(user_id, system_prompt) {
    //     try {
    //         const prev_bio = await UserDAO.getUserInfo(user_id).then(user => user.user_bio);
    //         const user_prompt = `You are about to update your user bio on social media. Your previous bio was: "${prev_bio}". Generate a new bio. Make sure it is within 100 - 120 characters. Change tone in each generation and mimic it to how users on social media like Instagram and TikTok interact.`;
    //         const new_bio = await generateResponse(system_prompt, user_prompt);
            
    //         await makeAPIRequest("http://localhost:3001/api/user/update/bio", "POST", { user_id, user_bio: new_bio });
    //     } catch (error) {
    //         console.error("Error updating user bio:", error);
    //     }
    // },

    async insertAGCommentOnPost(user_id, system_prompt) {
        try {
            const sel_post = await selectPostForComment(user_id);
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

            const sel_comment =  await selectCommentOnPost(sel_post.post_id, user_id);
            if (sel_comment == null) {
                console.log("No comment to reply to");
                return;
            }

            const user_prompt = `You are about to comment on a comment to a post. The content of the post is: "${sel_post.content}". The content of the comment is: "${sel_comment.content}". Generate a comment for the comment "${sel_comment.content}". Change tone in each generation and mimic it to how users on social media like Instagram and TikTok interact.`;
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

    async insertAGMessage(user_id, system_prompt, receiver=null){

        try {
            if(!receiver){
                receiver = await selectChatFromInbox(user_id);
                if (receiver == null) {
                    console.log("No chatrooms found");
                    return;
                }
            }
            const sel_messages =  await MessageDAO.getMessagesByChatId(receiver);

            let last_messages = "";
            let formattedMessages = "";

            if (!sel_messages || sel_messages.length === 0) {
                formattedMessages = "No messages";
            }
            
            else last_messages = sel_messages.slice(-5); 
            // console.log(last_messages);
            
            if(sel_messages.length > 0){
                const lastMessage = last_messages[last_messages.length - 1]; // Get the last message
                if (lastMessage.sender_id === user_id) {
                    console.log("Last message is from the agent. No response generated.");
                    return;
                }
                formattedMessages = last_messages
                .map(msg => `(${msg.sender_id}): "${msg.content}"`) // Format each message
                .join("\n");
            }

            let people = await ChatDAO.getChatMembers(receiver);
            people = people.filter(id => id !== user_id);

            let closeness_levels = await Promise.all(
                people.map(async (person) => {
                    let closeness = await RelationDAO.getCloseness(user_id, person);
                    return closeness;
                })
            );
            let social_groups = await SocialGroupDao.getGroupsByIds(people);

            const user_prompt = `There is a conversation happening in the chatroom.
            The last messages in the chatroom were: "${formattedMessages}"
            The messages provided will give you context. Your user_id is ${user_id}. 
            Please message naturally and be mindful of which messages are sent by you and which are sent by the other members.
            If there is a conversation that is already happening, respond to it instead of starting a new question.
            Excluding you, there are "${people.length}" other people in the chatroom.
            Your closeness levels to the people in the chatroom on a scale of 1 to 10 are "${closeness_levels}". 
            You belong to "${social_groups}" soial groups together.
            Rules:
            1. Limit each message to 1-3 sentences (Vary within this range). 
            2. DO NOT redundantly repeat or reiterate your partner's words.
            3. Choose and reply to the core part of a message than responding to every line.
            4. Make it distinct from the previous messages in phrasings, structure, and length. 
            5. There is no need to speak in full sentences every time. 
            Using the provided information as a premise to adopt a tone and style, generate a message to contribute to the ongoing conversation or start a new conversation as you see fit.`;
            
            const message = await generateResponse(system_prompt, user_prompt);

            const time = new Date().toISOString();
            await makeAPIRequest("http://localhost:3001/api/messages/add", "POST", {
                chat_id: receiver,
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
                 last_posts = sel_posts
                .slice(-3) 
                .map((post, index) => `(${index + 1}) ${post.content}`) 
                .join("\n"); 
            }

            const user_prompt = `You are about to make a new post on social media. While making a post ensure that:
            1. The theme of the post is only one. 
            2. Make sure that your new post is signficantly different in content and context to your old posts. 
            3. **Structure the post clearly.** Avoid adding multiple unrelated ideas in a single post.  
            4. Make sure that the post has newlines and paragraphs to make it more readable.
            1. Focus on one clear theme—avoid mixing multiple ideas.  
            2. Make it distinct from your previous posts in content, structure, storyline, context, and length.  
            3. Do not use the same phrasings as the previous posts.
            4. Keep it engaging while staying within three sentences. 
            5. Do not use bullet points, boldened or italicized text, greetings, headings, or end with a question. 
            The contents of some of your previous posts are:${last_posts}. 
            Now, generate a new post that sticks to a single theme.`;
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
    async addAGReaction(user_id, system_prompt) {
        try {
          // 0) pull in the agent's flags
          const { timeline, reactions: reactionFlag } = await FeatureSelectionDAO.getFeatures(user_id);
      
          const sel = (timeline !== 1)
            ? 3
            : (Math.floor(Math.random() * 3) + 1);
      
          let choice, link, post_id, comment_id, chat_id, message_id;
          switch (sel) {
            case 1: {
              const post = await selectPostForReaction(user_id);
              if (!post) return console.log("No posts to react on.");
              choice  = post;
              post_id = post.post_id;
              link    = "/api/reactions/post/add";
              break;
            }
            case 2: {
              const post = await selectPostForReaction(user_id);
              if (!post) return console.log("No posts to react on.");
              const comment = await selectCommentOnPost(post.post_id);
              if (!comment) return console.log("No comments to react on.");
              choice     = comment;
              comment_id = comment.comment_id;
              link       = "/api/reactions/comment/add";
              break;
            }
            case 3: {
              const chat = await selectChatFromInbox(user_id);
              if (!chat) return console.log("No chats found.");
              const msgs = await MessageDAO.getMessagesByChatId(chat);
              if (!msgs.length) return console.log("No messages to react on.");
              const msg = msgs[msgs.length - 1];
              if (await ReactionDAO.checkIfMessageReact(chat, msg.message_id, user_id)) {
                return;  // already reacted
              }
              choice      = msg;
              chat_id     = chat;
              message_id  = msg.message_id;
              link        = "/api/reactions/message/add";
              break;
            }
            default:
              return console.error("Impossible branch:", sel);
          }
      
          //    LV2.reactions: 1=Like, 2=Upvote/Downvote, 3=Emoji
          let reaction_type, emote_type = 0;
          switch (reactionFlag) {
            case 1:
              reaction_type = 0;
              break;
            case 2:
              // randomly Upvote or Downvote
              reaction_type = (Math.random() < 0.5 ? 1 : 2);
              break;
            case 3:
              reaction_type = 4;     // 4 → EmojiReaction
              emote_type = await generateResponse(
                system_prompt,
                `Which emoji do you pick on: "${choice.content}"? Reply with just the emoji code.`
              );
              break;
            default:
              reaction_type = 0; //fallback? 
          }
      
          const now = new Date().toISOString();
          if (post_id) {
            await ReactionDAO.insertPostReaction(reaction_type, emote_type, post_id, user_id, now);
            return `PostReaction:${reaction_type}`;
          } else if (comment_id) {
            await ReactionDAO.insertCommentReaction(reaction_type, emote_type, comment_id, user_id, now);
            return `CommentReaction:${reaction_type}`;
          } else {
            await ReactionDAO.insertMessageReaction(reaction_type, emote_type, chat_id, message_id, user_id, now);
            return `MessageReaction:${reaction_type}`;
          }
      
        } catch (err) {
          console.error("Error adding new reaction:", err);
          return "Error";
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

    async addAGStory(user_id, system_prompt){
        try {
            const user_prompt = `You are about to make a new ephemeral post on social media. These are time-sensitive posts and will only be up for 24 hours.
            While making an ephemeral post ensure that:
            1. Focus on one clear theme—avoid mixing multiple ideas.  
            2. Make it distinct from your previous posts in content, structure, storyline, context, and length.  
            3. Do not use the same phrasings as the previous posts.
            4. Keep it engaging while staying within three sentences. 
            5. Do not use bullet points, boldened or italicized text, greetings, headings, or end with a question. 
            Now, generate a new post that sticks to a single theme.`;
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
                duration: 1, 
                visibility: await UserDAO.getUserInfo(user_id).then(user => user.visibility), 
                comm_id: null});
        } catch (error) {
            console.error("Error adding new ephemeral post:", error);
        }

    },

    async addChannelStory(user_id, system_prompt){
        try {
            let channels = await CommunityDAO.getAllUserCommunities(user_id);
            // console.log(channels);
    
            if (!channels || channels.length === 0) {
                console.error("No communities found.");
                return null;
            }
            
            let sel_comm = channels[Math.floor(Math.random() * channels.length)];

            const user_prompt = `You are about to make a new ephemeral post on social media. These are time-sensitive posts and will only be up for 24 hours.
            The community name is ${sel_comm.comm_name}. This is a community with likeminded people who are passionate about ${sel_comm.comm_bio}.
            While making an ephemeral post ensure that:
            1. Focus on one clear theme—avoid mixing multiple ideas.  
            2. Make it distinct from your previous posts in content, structure, storyline, context, and length.  
            3. Do not use the same phrasings as the previous posts.
            4. Keep it engaging while staying within three sentences. 
            5. Do not use bullet points, boldened or italicized text, greetings, headings, or end with a question. 
            Now, generate a new post that sticks to a single theme.`;
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
                duration: 1, 
                visibility: await UserDAO.getUserInfo(user_id).then(user => user.visibility), 
                comm_id: sel_comm.comm_id});
        } catch (error) {
            console.error("Error adding new ephemeral post:", error);
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

    async insertDM(user_id, system_prompt){
        let frens = await RelationDAO.getUsersByRelation(user_id, 2);
        if (!frens || frens.length === 0) {
            console.error("No users found.");
            return null;
        }

        let sel_fren = frens[Math.floor(Math.random() * frens.length)];
        let chat = await ChatDAO.checkExistingChat(user_id, sel_fren);
        let chat_id = "";
        if (chat) {
            chat_id = chat.chat_id;
            console.log("Chats exists");

        }
        else{
            console.log("No existing chat found. Creating a new one...");
            let user_info = await UserDAO.getUserInfo(sel_fren);
            try {
                let id = await makeAPIRequest("http://localhost:3001/api/chats/add", "POST", { 
                    user_id_1: user_id,
                    user_id_2: sel_fren,
                    chat_name: user_info.id_name, 
                    chat_image: user_info.profile_picture,
                });
                chat_id = id.ina;
            } catch (error) {
                console.error("Error adding new chat", error);
            }
        
        }
        // console.log(chat_id);
        Simulation.insertAGMessage(user_id, system_prompt, chat_id);
    },

    async insertGroupChat(user_id, system_prompt){
        let frens = await RelationDAO.getUsersByRelation(user_id, 2);
        if (!frens || frens.length === 0) {
            console.error("No users found.");
            return null;
        }

        if (frens.length < 2) return; 

        // Limit to max 3 other participants (4 total including the user)
        let count = Math.min(Math.floor(Math.random() * (frens.length - 1)) + 2, 3);
        let sel_fren = frens.sort(() => Math.random() - 0.5).slice(0, count);

        sel_fren.push(user_id);

        let receiver = await ChatDAO.checkExistingGroupChat(sel_fren);


        if (receiver){
            console.log("Chats exists");
            Simulation.insertAGMessage(user_id, system_prompt, receiver);
        } 

        else{
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
                let id = await makeAPIRequest("http://localhost:3001/api/chats/group/add", "POST", { 
                    user_ids: sel_fren,
                    chat_name: name,
                    chat_image: null,
                    user_id: user_id
                });
                receiver = id.ina;

            } catch (error) {
                console.error("Error adding new chat", error);
            }
            Simulation.insertAGMessage(user_id, system_prompt, receiver);
        }

    },

    async createAGChannel(user_id, system_prompt){
        let user_prompt = `You are about to create a new community channel.
        Using the provided information as a premise, generate a name for the community channel. Be straightforward and reply with just the name`;
        let name = await generateResponse(system_prompt, user_prompt);
        
        user_prompt = `You just created a channel ${name}. Now create a bio for this channel. 
        The bio should be a one-liner that describes the purpose of the channel.`;
        let bio = await generateResponse(system_prompt, user_prompt);

        let current = await CommunityDAO.getAllCommunityBios();

        const tfidf = new TfIdf();
        tfidf.addDocument(bio);

        let similarityThreshold = 0.40;
        for (const existingBio of current) {
            tfidf.addDocument(existingBio);
            let vectorA = [];
            let vectorB = [];

            tfidf.tfidfs(bio, (i, measure) => {
                vectorA.push(measure);
            });

            tfidf.tfidfs(existingBio, (i, measure) => {
                vectorB.push(measure);
            });

            let dotProduct = vectorA.reduce((sum, value, i) => sum + value * vectorB[i], 0);
            let magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
            let magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));

            let similarity = magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;

            if (similarity > similarityThreshold) {
                console.log("Similar community exists: ", existingBio, similarity);
                return;
            }
        }

        let currentNames = await CommunityDAO.getAllCommunityNames();
        const threshold = 0.7;
         for (const existingName of currentNames) {
             const similarity = JaroWinklerDistance(name, existingName);
             if (similarity > threshold) {
                 console.log("Many communities exist with the same name", similarity, name);
                 return ; 
             }
         }
            
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
            if (Math.random() >= 0.5) {
                await makeAPIRequest("http://localhost:3001/api/channels/add", "POST", { 
                    user_id: 1, // randomly add login user to the channels
                    comm_id: id.ina,
                });
            }
        } catch (error) {
            console.error("Error adding new channel", error);
        }
    },

    async addChannelPost(user_id, system_prompt){
        
        let channels = await CommunityDAO.getAllUserCommunities(user_id);
        // console.log(channels);

        
        if (!channels || channels.length === 0) {
            console.error("No communities found.");
            return null;
        }
        
        let sel_comm = channels[Math.floor(Math.random() * channels.length)];
        console.log(user_id, Math.floor(Math.random() * channels.length));
        
        const user_prompt = `You are about to make a new post in a community. 
            The community name is ${sel_comm.comm_name}. This is a community with likeminded people who are passionate about ${sel_comm.comm_bio}.
            While making a post ensure that:
            1. Your post must be aligned with the community topic.
            2. Focus on one clear theme—avoid mixing multiple ideas.  
            3. Keep it engaging while staying within three sentences. 
            4. Do not use bullet points, boldened or italicized text, greetings, headings, or end with a question. 
            Now, generate a new post that sticks to a single theme.`;
            const new_post = await generateResponse(system_prompt, user_prompt);

            const time = new Date().toISOString();
        try{
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
                comm_id: sel_comm.comm_id});
        } catch (error) {
            console.error("Error adding new community post:", error);
        }
    },

    async sharePost(user_id){
        let receiver = await selectChatFromInbox(user_id);
                if (receiver == null) {
                    console.log("No chatrooms found");
                    return;
                }
        
        const sel_post = await selectPostToShare(user_id, receiver);
        if (!sel_post) return;

        
        const time = new Date().toISOString();
        try{
            await makeAPIRequest("http://localhost:3001/api/messages/add", "POST", {
                chat_id: receiver,
                sender_id: user_id,
                reply_id: null,
                content: sel_post,
                media_type:0,
                media_url: null,
                timestamp: time,
                shared_post: 1
            });
        } catch (error) {
            console.error("Error adding new community post:", error);
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
    async logAction(user_id, action_type, content) {
        try {
            const timestamp = new Date().toISOString();
            await ActionLogsDAO.insertActionLog(user_id, action_type, content, timestamp);
        } catch (error) {
            console.error("Error logging action:", error);
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
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    },

    async insertUserPipeline(userData) {
        try {
          // 1. Insert the basic user info into the user table
          const user_id = await UserDAO.insertUser(
            userData.id_name,
            userData.user_name,
            userData.email,
            userData.password,
            userData.user_bio,
            userData.profile_picture
          );
    
          await TraitDAO.insertUserTraits(
            user_id,
            //userData.trait_id,
            userData.posting_trait,
            userData.commenting_trait,
            userData.reacting_trait,
            userData.messaging_trait,
            userData.updating_trait,
            userData.comm_trait,
            userData.notification_trait
        
          );

          //await UserInterestDao.insertUserInterest(userData.interest_name, user_id);
        if (Array.isArray(userData.interests)) {
            for (const interest of userData.interests) {
            await UserInterestDao.insertUserInterest(interest, user_id);
            }
        } else {
            await UserInterestDao.insertUserInterest(userData.interest_name, user_id);
        }

          await PersonaDAO.insertUserPersona(userData.persona_name, user_id);
          await SocialGroupDao.insertUserSocialGroup(userData.social_group_name, user_id);

          console.log(`✅ Created Agent: ${userData.user_name} (ID: ${userData.id_name}) with full details`);
          return user_id;
        } catch (error) {
            console.error("Error inserting user:", error);
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
        let all_communities = await CommunityDAO.getAllCommunities();
        
        if (!all_communities || all_communities.length === 0) {
            console.error("No communities found.");
            return null;
        }
        
        let user_prompt = `You want to join a new community. Based on your personality, choose **one** from the list below.  
        Be direct and reply with **only the community ID** of the selected community.  

        Available communities:  
        ${all_communities.map(comm => `ID: ${comm.comm_id} | Name: ${comm.comm_name} | Bio: ${comm.comm_bio}`).join('\n')}`;

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
    
    async generateAgentFromGroupChats() {
        try {
          // Retrieve all preexisting group chats.
          const groupChats = await ChatDAO.getAllGroupChats();
          if (!groupChats || groupChats.length === 0) {
            console.error("No group chats found for generating agent data.");
            return;
          }
          const randomGroupChat = groupChats[Math.floor(Math.random() * groupChats.length)];
          const chatName = randomGroupChat.chat_name ? String(randomGroupChat.chat_name) : "GroupChat";
          
          // Retrieving messages
          const messages = await MessageDAO.getMessagesByChatId(randomGroupChat.chat_id);
          let chatContents = "";
          if (messages && messages.length > 0) {
            chatContents = messages.map(msg => msg.content).join(" ");
          }
          const chatDescription = chatContents.length > 0 ? chatContents.substring(0, 300) : "lively conversations and diverse topics";
      
          const systemPrompt = "You are an AI that generates random social media user profiles in JSON format.";
          const userPrompt = `
      Generate a random social media user profile in JSON format using the following group chat context:
      Group Chat Name: ${chatName}
      Group Chat Description: ${chatDescription}
      
      The JSON object must include the following keys:
      - "id_name": A unique identifier starting with "ID_".
      - "user_name": A plausible first name.
      - "email": A plausible email address.
      - "password": A sample strong password.
      - "user_bio": A brief description about the user.
      - "profile_picture": A URL using "https://i.pravatar.cc/120?u=" with a random query parameter.
      - "posting_trait": A random floating-point number between 0 and 1 with two decimal places.
      - "commenting_trait": A random floating-point number between 0 and 1 with two decimal places.
      - "reacting_trait": A random floating-point number between 0 and 1 with two decimal places.
      - "messaging_trait": A random floating-point number between 0 and 1 with two decimal places.
      - "updating_trait": A random floating-point number between 0 and 1 with two decimal places.
      - "comm_trait": A random floating-point number between 0 and 1 with two decimal places.
      - "notification_trait": A random floating-point number between 0 and 1 with two decimal places.
      - "interests":  An array of at least three interests chosen from the following list: ["Animals", "Art & Design", "Automobiles", "DIY & Crafting", "Education", "Fashion", "Finance", "Fitness", "Food", "Gaming", "History & Culture", "Lifestyle", "Literature", "Movies", "Music", "Nature", "Personal Development", "Photography", "Psychology", "Religion", "Social", "Sports", "Technology", "Travel", "Wellness"].
      - "persona_name": Derived from the group chat name.
      - "social_group_name": Derived from the group chat name.
      Return only the JSON object.
          `;
      
          const apiResponse = await generateResponse(systemPrompt, userPrompt);
          let cleanResponse = apiResponse.trim();
          if (cleanResponse.startsWith("```")) {
            cleanResponse = cleanResponse.replace(/^```(json)?\s*/, "").replace(/```$/, "").trim();
          }

          let agentData;
          try {
            agentData = JSON.parse(cleanResponse);
          } catch (e) {
            console.error("Failed to parse API response:", e, "Response:", cleanResponse);
            return;
          }
          //
          let existingUser = await UserDAO.findByUserName(agentData.user_name);
          if (existingUser) {
              // Modify the user_name until it is unique.
              let unique = false;
              while (!unique) {
                  agentData.user_name = agentData.user_name + '_' + Math.floor(Math.random() * 10000);
                  existingUser = await UserDAO.findByUserName(agentData.user_name);
                  if (!existingUser) {
                      unique = true;
                  }
              }
          }
          const originalEmail = agentData.email;
          let uniqueEmail = originalEmail;
          let emailCounter = 1;
          let emailExists = await UserDAO.findByEmail(uniqueEmail);
          while (emailExists) {
            // Assumes the email is in the format local@domain.com
            const [local, domain] = originalEmail.split('@');
            uniqueEmail = `${local}_${emailCounter}@${domain}`;
            emailCounter++;
            emailExists = await UserDAO.findByEmail(uniqueEmail);
          }
          agentData.email = uniqueEmail;
          
          let existingIdName = await UserDAO.findByIdName(agentData.id_name);
          if (existingIdName) {
              // Modify the id_name until it is unique
              let unique = false;
              while (!unique) {
                  agentData.id_name = agentData.id_name + '_' + Math.floor(Math.random() * 10000);
                  existingIdName = await UserDAO.findByIdName(agentData.id_name);
                  if (!existingIdName) {
                      unique = true;
                  }
              }
          }
          
          const newUserId = await Simulation.insertUserPipeline(agentData);
          console.log("New agent inserted with ID:", newUserId);
          return newUserId;
      
        } catch (error) {
          console.error("Error generating agent from group chats:", error);
        }
      },
      
    async generateAgentFromMetaphor(existingUserNames = [], existingUserBios = []) {
        try {
            /////////////////// Goal Role ///////////////////
            const goalRoles = [
                { goal: "gain followers", role: "Influencer" },
                { goal: "spread ideas", role: "Spreader" },
                { goal: "seek emotional support", role: "Support-Seeker" },
                { goal: "entertain others", role: "Entertainer" },
                { goal: "moderate discussion", role: "Moderator" },
                { goal: "raise awareness", role: "Activist" },
                { goal: "connect with like-minded people", role: "Networker" },
                { goal: "observe quietly", role: "Lurker" },
                { goal: "write hate comments", role: "Bully" }
            ];
    
            const goalRole = goalRoles[Math.floor(Math.random() * goalRoles.length)];

            const descriptions = await FeatureSelectionDAO.getLvlOneDescriptions();

            /////////////////// Identity Prompt ///////////////////
            const identity_style = await FeatureSelectionDAO.getLvlTwoIdentity();
            let identity_prompt;
            if (identity_style === 1) {
                identity_prompt = "The user is a real person using your real identity. Your name should be realistic and represent your true self. No numbers or special characters.";
            } else if (identity_style === 2) {
                identity_prompt = "The user is using a pseudonym. Create a consistent alternate identity that you maintain, but it's not your real name.";
            } else if (identity_style === 3) {
                identity_prompt = "The user is anonymous. Your identity should be generic and non-identifying, using placeholder-style names.";
            }
            if (!descriptions) {
                console.error("No feature descriptions found.");
                return;
            }

            /////////////////// System Prompt ///////////////////
            const systemPrompt = `You are an AI that generates social media user profiles based on metaphorical descriptions. 
            The user has the goal of "${goalRole.goal}" and plays the role of "${goalRole.role}".
            Create a personality that embodies these metaphorical characteristics:
            LLM Description: ${descriptions.llm_descr}
            IMPORTANT: The username should be generated independently of the metaphorical description, following only the identity style requirements.`;

            // Create the user prompt for profile generation
            const userPrompt = `
            Create a social media user profile that embodies the goal of "${goalRole.goal}" and the role of "${goalRole.role}".

            USERNAME REQUIREMENTS:
            - Strictly follow this identity style: ${identity_prompt}
            - CRUCIAL: The username MUST be completely independent of the metaphorical theme ('${descriptions.keyword}'). It should NOT reflect the metaphor in any way.
            - The username must follow standard social media conventions.
            ${existingUserNames.length > 0 ? `
            - ABSOLUTELY ESSENTIAL: The username MUST be different from these existing names:
              ${existingUserNames.join(', ')}` : ''}
            
            Generate a JSON object with these required fields:
            {
                "id_name": "A unique identifier starting with 'ID_'",
                "user_name": "A username strictly adhering to the USERNAME REQUIREMENTS above. It MUST NOT be related to the metaphorical theme in any way.",
                "email": "A thematic email address, can be related to the metaphor or username strategy",
                "password": "A strong password",
                "user_bio": "A concise (1-3 sentences, approx 150 chars) and engaging social media bio. This bio should NOT weave in the metaphorical theme of '${descriptions.keyword} or metaphor.' ${existingUserBios.length > 0 ? `It MUST be distinct from these existing bios: ${existingUserBios.map(bio => `"${bio}"`).join('; ')}. ` : ''}No emojis.",
                "profile_picture": "A URL using https://i.pravatar.cc/120?u= with a random parameter",
                "posting_trait": "Float between 0-1",
                "commenting_trait": "Float between 0-1",
                "reacting_trait": "Float between 0-1",
                "messaging_trait": "Float between 0-1",
                "updating_trait": "Float between 0-1",
                "comm_trait": "Float between 0-1",
                "notification_trait": "Float between 0-1",
                "interests": ["At least 3 interests from the predefined list"],
                "persona_name": "A name derived from the metaphor",
                "social_group_name": "A group name aligned with the metaphor"
            }

            Ensure the personality traits and interests align with the metaphorical description.
            The predefined interests list: ["Animals", "Art & Design", "Automobiles", "DIY & Crafting", "Education", "Fashion", "Finance", "Fitness", "Food", "Gaming", "History & Culture", "Lifestyle", "Literature", "Movies", "Music", "Nature", "Personal Development", "Photography", "Psychology", "Religion", "Social", "Sports", "Technology", "Travel", "Wellness"]

            Return only the JSON object.`;

            const apiResponse = await generateResponse(systemPrompt, userPrompt);
            let cleanResponse = apiResponse.trim();
            if (cleanResponse.startsWith("```")) {
                cleanResponse = cleanResponse.replace(/^```(json)?\s*/, "").replace(/```$/, "").trim();
            }

            let agentData;
            try {
                agentData = JSON.parse(cleanResponse);
            } catch (e) {
                console.error("Failed to parse API response:", e, "Response:", cleanResponse);
                return;
            }

            let existingUser = await UserDAO.findByUserName(agentData.user_name);
            if (existingUser) {
                let unique = false;
                while (!unique) {
                    agentData.user_name = agentData.user_name + '_' + Math.floor(Math.random() * 10000);
                    existingUser = await UserDAO.findByUserName(agentData.user_name);
                    if (!existingUser) {
                        unique = true;
                    }
                }
            }

            const originalEmail = agentData.email;
            let uniqueEmail = originalEmail;
            let emailCounter = 1;
            let emailExists = await UserDAO.findByEmail(uniqueEmail);
            while (emailExists) {
                const [local, domain] = originalEmail.split('@');
                uniqueEmail = `${local}_${emailCounter}@${domain}`;
                emailCounter++;
                emailExists = await UserDAO.findByEmail(uniqueEmail);
            }
            agentData.email = uniqueEmail;

            // ID randomization
            let existingIdName = await UserDAO.findByIdName(agentData.id_name);
            if (existingIdName) {
                // Modify the id_name until it is unique
                let unique = false;
                while (!unique) {
                    agentData.id_name = agentData.id_name + '_' + Math.floor(Math.random() * 10000);
                    existingIdName = await UserDAO.findByIdName(agentData.id_name);
                    if (!existingIdName) {
                        unique = true;
                    }
                }
            }
            const newUserId = await Simulation.insertUserPipeline(agentData);
            
            console.log("New metaphorical agent inserted with ID:", newUserId);
            return newUserId;

        } catch (error) {
            console.error("Error generating agent from metaphor:", error);
        }
    }, 
}      
export default Simulation;

