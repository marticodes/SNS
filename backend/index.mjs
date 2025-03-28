import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';

import passport from 'passport';
import LocalStrategy from 'passport-local';

import session from 'express-session';

import ChatDAO from './dao/chat_dao.mjs';
import UserDAO from './dao/user_dao.mjs';
import PostDAO from './dao/post_dao.mjs';
import CommentDAO from './dao/comment_dao.mjs';
import ReactionDAO from './dao/reaction_dao.mjs';
import ViewerDAO from './dao/viewer_dao.mjs';
import RelationDAO from './dao/relation_dao.mjs';
import RequestDAO from './dao/friend_request_dao.mjs';
import UserInterestDAO from './dao/user_interest_dao.mjs';
import MessageDAO from './dao/message_dao.mjs';
import FeedDAO from './dao/feed_dao.mjs';
import CMemberDAO from './dao/community_membership_dao.mjs';
import CommunityDAO from './dao/community_dao.mjs';
import NotificationDAO from './dao/notification_dao.mjs';
import ReceiptsDAO from './dao/read_receipts_dao.mjs';
import ActionLogsDAO from './dao/action_logs_dao.mjs';

const chatDao = ChatDAO;
const userDao = UserDAO;
const postDao = PostDAO;
const commentDao = CommentDAO;
const reactionDao = ReactionDAO;
const viewerDao = ViewerDAO;
const relationDao = RelationDAO;
const requestDao = RequestDAO;
const uiDao = UserInterestDAO;
const messageDao = MessageDAO;
const feedDao = FeedDAO;
const cmemberDao = CMemberDAO;
const communityDao = CommunityDAO;
const notificationDao = NotificationDAO;
const receiptsDAO = ReceiptsDAO;
const logsDAO = ActionLogsDAO;

const SERVER_URL = 'http://localhost:3001/api';

//init express and set up the middlewares
const app = express();

const port = 3001;
app.use(morgan('dev'));
app.use(express.json());

app.use(cors());
app.use(express.static('public'));
  
app.use(session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
  }));
  
app.use(passport.authenticate('session'));
  
// logging Middleware
app.use((req, res, next) => {
    next();
  });

//User API
app.get('/api/user/:id_name/:password',
    async (req, res) => {
        try {
          const logged = await userDao.checkCredentials(req.params.id_name, req.params.password);
          res.status(200).json(logged);
        } catch (err) {
          res.status(500).json({ error: `BE: Error logging in ${err}` });
        }
    }
);

app.get('/api/user/:user_id',
    async (req, res) => {
        try {
          const user = await userDao.getUserInfo(req.params.user_id);
          res.status(200).json(user);
        } catch (err) {
          res.status(500).json({ error: `BE: Error getting user info ${err}` });
        }
    } 
);

app.get('/api/users/active',
    async (req, res) => {
        try {
          const user = await userDao.getActiveUsers();
          res.status(200).json(user);
        } catch (err) {
          res.status(500).json({ error: `BE: Error getting user info ${err}` });
        }
    } 
);

app.get('/api/users/active/info',
  async (req, res) => {
      try {
        const user = await userDao.getActiveUsersInfo();
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json({ error: `BE: Error getting user info ${err}` });
      }
  } 
);

app.get('/api/is/user/active/:user_id',
  async (req, res) => {
      try {
        const user = await userDao.isActiveUser(user_id);
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json({ error: `BE: Error getting user info ${err}` });
      }
  } 
);

app.post('/api/user/update/status',
    async (req, res) => {
        try {
          const set = await userDao.updateUserStatus(req.body.user_id, req.body.status);
          res.status(201).json({set});
        } catch (err) {
          res.status(503).json({ error: `BE: Error updating status ${err}` });
        }
      }
);

app.post('/api/user/add',
    async (req, res) => {
        try {
          const ina = await userDao.insertUser(req.body.id_name, req.body.user_name, req.body.email, req.body.password, req.body.user_bio, req.body.profile_picture);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error inserting user ${err}` });
        }
      }
);

app.post('/api/user/update/bio',
    async (req, res) => {
        try {
          const set = await userDao.updateUserBio(req.body.user_id, req.body.user_bio);
          res.status(201).json({set});
        } catch (err) {
          res.status(503).json({ error: `BE: Error updating bio ${err}` });
        }
      }
);

app.post('/api/user/update/picture',
    async (req, res) => {
        try {
          const set = await userDao.updateProfilePicture(req.body.user_id, req.body.profile_picture);
          res.status(201).json({set});
        } catch (err) {
          res.status(503).json({ error: `BE: Error updating profile picture ${err}` });
        }
      }
);

app.post('/api/user/update/email',
    async (req, res) => {
        try {
          const set = await userDao.updateUserEmail(req.body.user_id, req.body.email);
          res.status(201).json({set});
        } catch (err) {
          res.status(503).json({ error: `BE: Error updating email ${err}` });
        }
      }
);

app.post('/api/user/update/password',
    async (req, res) => {
        try {
          const set = await userDao.updateUserPassword(req.body.user_id, req.body.password);
          res.status(201).json({set});
        } catch (err) {
          res.status(503).json({ error: `BE: Error updating password ${err}` });
        }
      }
);

app.post('/api/user/remove/picture',
    async (req, res) => {
        try {
          const set = await userDao.removeProfilePicture(req.body.user_id);
          res.status(201).json({set});
        } catch (err) {
          res.status(503).json({ error: `BE: Error removing profile picture ${err}` });
        }
      }
);

app.post('/api/user/update/visibility',
    async (req, res) => {
        try {
          const set = await userDao.updateAccountVisibility(req.body.user_id, req.body.visibility);
          res.status(201).json({set});
        } catch (err) {
          res.status(503).json({ error: `BE: Error updating visibility ${err}` });
        }
      }
);




//POSTS API
app.get('/api/posts/all/:user_id',
    async (req, res) => {
        try {
          const posts = await postDao.getAllPosts(req.params.user_id);
          res.status(200).json(posts);
        } catch (err) {
          res.status(500).json({ error: `BE: Error listing all posts ${err}` });
        }
      }
);

app.get('/api/posts/id/:post_id',
    async (req, res) => {
        try {
          const posts = await postDao.getPostByPostId(req.params.post_id);
          res.status(200).json(posts);
        } catch (err) {
          res.status(500).json({ error: `BE: Error listing all posts ${err}` });
        }
      }
);


app.get('/api/posts/topic/:topic',
    async (req, res) => {
        try {
          const posts = await postDao.searchPostByTopic(req.params.topic);
          res.status(200).json(posts);
        } catch (err) {
          res.status(500).json({ error: `BE: Error listing posts ${err}` });
        }
      }
);

app.get('/api/posts/keyword/:keyword',
    async (req, res) => {
        try {
          const posts = await postDao.searchPostByWord(req.params.keyword);
          res.status(200).json(posts);
        } catch (err) {
          res.status(500).json({ error: `BE: Error listing posts ${err}` });
        }
      }
);

app.get('/api/posts/combined/search/:keyword',
  async (req, res) => {
      try {
        const posts = await postDao.searchCombined(req.params.keyword);
        res.status(200).json(posts);
      } catch (err) {
        res.status(500).json({ error: `BE: Error listing posts ${err}` });
      }
    }
);

app.get('/api/posts/combined/search/comm/:keyword/:comm_id',
  async (req, res) => {
      try {
        const posts = await postDao.searchinComminity(req.params.keyword, req.params.comm_id);
        res.status(200).json(posts);
      } catch (err) {
        res.status(500).json({ error: `BE: Error listing posts ${err}` });
      }
    }
);

app.post('/api/post/add',
    async (req, res) => {
        try {
          const ina = await postDao.insertPost(req.body.parent_id, req.body.user_id, req.body.content, req.body.topic, req.body.media_type, req.body.media_url, req.body.timestamp, req.body.duration, req.body.visibility, req.body.comm_id);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error inserting post ${err}` });
        }
      }
);

app.post('/api/posts/visibility',
    async (req, res) => {
        try {
          const set = await postDao.updatePostVisibility(req.body.post_id, req.body.visibility, req.body.user_id);
          res.status(201).json({set});
        } catch (err) {
          res.status(503).json({ error: `BE: Error updating visibility ${err}` });
        }
      }
);

app.post('/api/posts/content',
    async (req, res) => {
        try {
          const set = await postDao.updatePost(req.body.post_id, req.body.content);
          res.status(201).json({set});
        } catch (err) {
          res.status(503).json({ error: `BE: Error updating post content ${err}` });
        }
      }
);

//Hashtag API

app.get('/api/hashtags/count/:content',
  async (req, res) => {
      try {
        const count = await postDao.countHashtag(req.params.content);
        res.status(200).json(count);
      } catch (err) {
        res.status(500).json({ error: `BE: Error retriving count ${err}` });
      }
    }
);

app.get('/api/hashtags/post/:content',
  async (req, res) => {
      try {
        const ids = await postDao.getPostIdsWithHashtag(req.params.content);
        res.status(200).json(ids);
      } catch (err) {
        res.status(500).json({ error: `BE: Error retriving post ids ${err}` });
      }
    }
);

//Ephemeral Contents API
app.get('/api/viewers/:post_id',
    async (req, res) => {
        try {
          const viewers = await viewerDao.getAllViewers(req.params.post_id);
          res.status(200).json(viewers);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining viewers ${err}` });
        }
      }
);

app.post('/api/viewers/post/add',
    async (req, res) => {
        try {
          const ina = await viewerDao.addPostViewer(req.body.user_id, req.body.post_id);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error adding viewer ${err}` });
        }
      }
);

//Comments API
app.get('/api/comments/all/:parent_id/:post',
    async (req, res) => {
        try {
          const comments = await commentDao.getAllComments(req.params.parent_id, req.params.post);
          res.status(200).json(comments);
        } catch (err) {
          res.status(500).json({ error: `BE: Error listing all comments ${err}` });
        }
      }
);

app.post('/api/post/comment/add',
    async (req, res) => {
        try {
          const ina = await commentDao.insertComment(req.body.parent_id, req.body.user_id, req.body.content, req.body.media_type, req.body.media_url, req.body.timestamp, req.body.visibility, req.body.post);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error inserting comment ${err}` });
        }
      }
);

//Reactions API
app.get('/api/reactions/posts/:post_id',
    async (req, res) => {
        try {
          const reactions = await reactionDao.getPostReactions(req.params.post_id);
          res.status(200).json(reactions);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining post reactions ${err}` });
        }
      }
);

app.get('/api/reactions/comments/:comment_id',
    async (req, res) => {
        try {
          const reactions = await reactionDao.getCommentReactions(req.params.comment_id);
          res.status(200).json(reactions);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining comment reactions ${err}` });
        }
      }
);

app.get('/api/reactions/messages/:chat_id/:message_id',
    async (req, res) => {
        try {
          const reactions = await reactionDao.getMessageReactions(req.params.chat_id, req.params.message_id);
          res.status(200).json(reactions);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining message reactions ${err}` });
        }
      }
);

app.post('/api/reactions/post/add',
    async (req, res) => {
        try {
          const ina = await reactionDao.insertPostReaction(req.body.reaction_type, req.body.emote_type, req.body.post_id, req.body.user_id, req.body.timestamp);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error inserting post reaction ${err}` });
        }
      }
);

app.post('/api/reactions/comment/add',
    async (req, res) => {
        try {
          const ina = await reactionDao.insertCommentReaction(req.body.reaction_type, req.body.emote_type, req.body.comment_id, req.body.user_id, req.body.timestamp);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error inserting comment reaction ${err}` });
        }
      }
);

app.post('/api/reactions/message/add',
    async (req, res) => {
        try {
          const ina = await reactionDao.insertMessageReaction(req.body.reaction_type, req.body.emote_type, req.body.chat_id, req.body.message_id, req.body.user_id, req.body.timestamp);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error inserting message reaction ${err}` });
        }
      }
);

//Friends API
app.get('/api/relations/all/:user_id/:relation_type',
    async (req, res) => {
        try {
          const user_ids = await relationDao.getUsersByRelation(req.params.user_id, req.params.relation_type);
          res.status(200).json(user_ids);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining relation list ${err}` });
        }
      }
);

app.get('/api/with/relations/:user_id/:relation_type',
  async (req, res) => {
      try {
        const user_ids = await relationDao.getUsersWithRelation(req.params.user_id, req.params.relation_type);
        res.status(200).json(user_ids);
      } catch (err) {
        res.status(500).json({ error: `BE: Error obtaining relation list ${err}` });
      }
    }
);

app.get('/api/restricted/:user_id',
    async (req, res) => {
        try {
          const user_ids = await relationDao.getRestrictedUsers(req.params.user_id);
          res.status(200).json(user_ids);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining relation list ${err}` });
        }
      }
);

app.get('/api/relations/:user_id_1/:user_id_2',
  async (req, res) => {
      try {
        const rln = await relationDao.getRelation(req.params.user_id_1, req.params.user_id_2);
        res.status(200).json(rln);
      } catch (err) {
        res.status(500).json({ error: `BE: Error obtaining relation list ${err}` });
      }
    }
);

app.get('/api/relations/mutuals/:user_id_1/:user_id_2',
    async (req, res) => {
        try {
          const user_ids = await relationDao.getMutualFollowers(req.params.user_id_1,req.params.user_id_2);
          res.status(200).json(user_ids);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining mutuals list ${err}` });
        }
      }
);

app.post('/api/relations/add',
    async (req, res) => {
        try {
          const ina = await relationDao.addRelation(req.body.user_id_1, req.body.user_id_2, req.body.relation_type, req.body.restricted, req.body.closeness);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error creating relation between users ${err}` });
        }
      }
);

app.post('/api/relations/update',
    async (req, res) => {
        try {
          const ina = await relationDao.updateRelation(req.body.user_id_1, req.body.user_id_2, req.body.relation_type);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error updating relation ${err}` });
        }
      }
);

app.post('/api/relations/restriction/update',
    async (req, res) => {
        try {
          const ina = await relationDao.updateRestriction(req.body.user_id_1, req.body.user_id_2, req.body.restricted);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error updating restriction ${err}` });
        }
      }
);

app.delete('/api/relations/delete/',
  async (req, res) => {
      try {
        const ina = await relationDao.deleteRelation(req.body.user_id_1, req.body.user_id_2);
        res.status(200).json({ina});
      } catch (err) {
        res.status(503).json({ error: `BE: Error deleting relation ${err}` });
      }
    }
);



//// Requests Api

app.get('/api/requests/:user_id/',
    async (req, res) => {
        try {
          const user_ids = await requestDao.getRequests(req.params.user_id);
          res.status(200).json(user_ids);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining requests list ${err}` });
        }
      }
);

app.post('/api/requests/add',
    async (req, res) => {
        try {
          const ina = await requestDao.addRequest(req.body.user_id_1, req.body.user_id_2);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error sending friend request ${err}` });
        }
      }
);

app.delete('/api/requests/delete',
    async (req, res) => {
        try {
          const ina = await requestDao.deleteRequest(req.body.user_id_1, req.body.user_id_2);
          res.status(200).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error deleting friend request ${err}` });
        }
      }
);

//Chats and Messages
app.delete('/api/read/receipts/delete',
  async (req, res) => {
      try {
        const ina = await receiptsDAO.deleteReceipts(req.body.chat_id, req.body.user_id);
        res.status(200).json({ina});
      } catch (err) {
        res.status(503).json({ error: `BE: Error deleting read receipts ${err}` });
      }
    }
);

app.delete('/api/chat/delete/',
  async (req, res) => {
      try {
        const ina = await chatDao.deleteChat();
        res.status(200).json({ina});
      } catch (err) {
        res.status(503).json({ error: `BE: Error deleting chat ${err}` });
      }
    }
);

app.get('/api/chats/unread/all/:user_id',
  async (req, res) => {
      try {
        const chats = await receiptsDAO.getUnreadChats(req.params.user_id);
        res.status(200).json(chats);
      } catch (err) {
        res.status(500).json({ error: `BE: Error obtaining chats ${err}` });
      }
    }
);

app.get('/api/chats/exist/:user_id_1/:user_id_2',
  async (req, res) => {
      try {
        const chats = await chatDao.isExistingChat(req.params.user_id_1, req.params.user_id_2);
        res.status(200).json(chats);
      } catch (err) {
        res.status(500).json({ error: `BE: Error obtaining chats ${err}` });
      }
    }
);

app.get('/api/chats/all/:user_id',
    async (req, res) => {
        try {
          const chats = await chatDao.getAllUserChats(req.params.user_id);
          res.status(200).json(chats);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining chats ${err}` });
        }
      }
);

app.get('/api/chats/all/ids/:user_id',
  async (req, res) => {
      try {
        const chats = await chatDao.getAllChatIds(req.params.user_id);
        res.status(200).json(chats);
      } catch (err) {
        res.status(500).json({ error: `BE: Error obtaining chat ids ${err}` });
      }
    }
);

app.get('/api/chat/:chat_id',
  async (req, res) => {
      try {
        const chats = await chatDao.getChatFromChatId(req.params.chat_id);
        res.status(200).json(chats);
      } catch (err) {
        res.status(500).json({ error: `BE: Error obtaining chat ${err}` });
      }
    }
);

app.get('/api/members/chat/:chat_id',
  async (req, res) => {
      try {
        const mems = await chatDao.getChatMembers(req.params.chat_id);
        res.status(200).json(mems);
      } catch (err) {
        res.status(500).json({ error: `BE: Error obtaining members ${err}` });
      }
    }
);

app.get('/api/members/channel/:comm_id',
  async (req, res) => {
      try {
        const mems = await cmemberDao.getChannelMembers(req.params.comm_id);
        res.status(200).json(mems);
      } catch (err) {
        res.status(500).json({ error: `BE: Error obtaining members ${err}` });
      }
    }
);

app.post('/api/chats/add',
    async (req, res) => {
        try {
          const ina = await chatDao.insertDM(req.body.user_id_1, req.body.user_id_2, req.body.chat_name, req.body.chat_image);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error inserting chat ${err}` });
        }
      }
);

app.post('/api/chats/group/add',
  async (req, res) => {
      try {
        const ina = await chatDao.insertGroupChat(req.body.user_ids, req.body.chat_name, req.body.chat_image, req.body.creator);
        res.status(201).json({ina});
      } catch (err) {
        res.status(503).json({ error: `BE: Error inserting group chat ${err}` });
      }
    }
);

app.get('/api/user/messages/all/:chat_id',
    async (req, res) => {
        try {
          const messages = await messageDao.getMessagesByChatId(req.params.chat_id);
          res.status(200).json(messages);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining messages ${err}` });
        }
      }
);

app.get('/api/user/message/id/:message_id',
  async (req, res) => {
      try {
        const messages = await messageDao.getMessageByMessageId(req.params.message_id);
        res.status(200).json(messages);
      } catch (err) {
        res.status(500).json({ error: `BE: Error obtaining messages ${err}` });
      }
    }
);

app.get('/api/messages/sender/:message_id',
    async (req, res) => {
        try {
          const sender = await messageDao.getSenderByMessageId(req.params.message_id);
          res.status(200).json(sender);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining sender id ${err}` });
        }
      }
);

app.post('/api/messages/add',
    async (req, res) => {
        try {
          const ina = await messageDao.insertMessage(req.body.chat_id, req.body.sender_id, req.body.reply_id, req.body.content, req.body.media_type, req.body.media_url, req.body.timestamp);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error sending message ${err}` });
        }
      }
);

app.post('/api/user/update/chat/time',
  async (req, res) => {
      try {
        const set = await chatDao.updateChatTime(req.body.chat_id, req.body.timestamp);
        res.status(201).json({set});
      } catch (err) {
        res.status(503).json({ error: `BE: Error updating chat time ${err}` });
      }
    }
);

//Interests and Recommendations
app.get('/api/interests/:user_id/',
    async (req, res) => {
        try {
          const interest_name = await uiDao.getUserInterests(req.params.user_id);
          res.status(200).json(interest_name);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining interests list ${err}` });
        }
      }
);

app.post('/api/interest/add',
  async (req, res) => {
      try {
        const ina = await uiDao.insertUserInterest(req.body.interest_name, req.body.user_id);
        res.status(201).json({ina});
      } catch (err) {
        res.status(503).json({ error: `BE: Error inserting user ${err}` });
      }
    }
);

app.get('/api/recomm/friends/interests/:user_id',
    async (req, res) => {
        try {
          const user_ids = await uiDao.getUsersWithSimilarInterest(req.params.user_id);
          res.status(200).json(user_ids);
        } catch (err) {
          res.status(500).json({ error: `BE: Error obtaining friend recommendations ${err}` });
        }
      }
);

app.get('/api/recomm/feed/friends/:user_id/',
    async (req, res) => {
        try {
          const posts = await feedDao.getFeedFromFriends(req.params.user_id);
          res.status(200).json(posts);
        } catch (err) {
          res.status(500).json({ error: `BE: Error populating feed (friends) ${err}` });
        }
      }
);

app.get('/api/recomm/feed/channel/:comm_id/',
  async (req, res) => {
      try {
        const posts = await feedDao.getChannelFeed(req.params.comm_id);
        res.status(200).json(posts);
      } catch (err) {
        res.status(500).json({ error: `BE: Error populating feed (channel) ${err}` });
      }
    }
);

app.get('/api/recomm/feed/combined/:user_id/',
  async (req, res) => {
      try {
        const posts = await feedDao.getcombinedFeed(req.params.user_id);
        res.status(200).json(posts);
      } catch (err) {
        res.status(500).json({ error: `BE: Error populating feed combined ${err}` });
      }
    }
);

app.get('/api/recomm/feed/interests/:user_id/',
    async (req, res) => {
        try {
          const posts = await feedDao.getInterestBasedFeed(req.params.user_id);
          res.status(200).json(posts);
        } catch (err) {
          res.status(500).json({ error: `BE: Error populating feed (interests) ${err}` });
        }
      }
);


//Channels API
app.get('/api/channels/:user_id/',
    async (req, res) => {
        try {
          const comm = await cmemberDao.getCommunitiesByUserID(req.params.user_id);
          res.status(200).json(comm);
        } catch (err) {
          res.status(500).json({ error: `BE: Error retriving communities ${err}` });
        }
      }
);

app.post('/api/channels/create',
    async (req, res) => {
        try {
          const ina = await communityDao.createNewChannel(req.body.comm_name, req.body.comm_image, req.body.comm_bio, req.body.user_id);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error creating channel ${err}` });
        }
      }
);


app.post('/api/channels/add',
    async (req, res) => {
        try {
          const ina = await cmemberDao.addChannel(req.body.user_id, req.body.comm_id);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error adding channel ${err}` });
        }
      }
);

app.get('/api/channels/post/:comm_id/',
    async (req, res) => {
        try {
          const posts = await cmemberDao.getChannelPost(req.params.comm_id);
          res.status(200).json(posts);
        } catch (err) {
          res.status(500).json({ error: `BE: Error retriving community posts ${err}` });
        }
      }
);


app.get('/api/channels/info/:comm_id/',
    async (req, res) => {
        try {
          const comm = await communityDao.getCommunityInfo(req.params.comm_id);
          res.status(200).json(comm);
        } catch (err) {
          res.status(500).json({ error: `BE: Error retriving community info ${err}` });
        }
      }
);

//Notification API

app.post('/api/notifs/add',
    async (req, res) => {
        try {
          const ina = await notificationDao.addSingularNotification(req.body.content, req.body.notif_type, req.body.sender_id, req.body.receiver_id, req.body.timestamp);
          res.status(201).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error adding notification ${err}` });
        }
      }
);

app.get('/api/notifs/id/:user_id/',
    async (req, res) => {
        try {
          const notifs = await notificationDao.getNotificationByUserId(req.params.user_id);
          res.status(200).json(notifs);
        } catch (err) {
          res.status(500).json({ error: `BE: Error retriving notifs by id ${err}` });
        }
      }
);

app.get('/api/notifs/type/:notif_type/:receiver_id',
    async (req, res) => {
        try {
          const notifs = await notificationDao.getNotificationByType(req.params.notif_type, req.params.receiver_id);
          res.status(200).json(notifs);
        } catch (err) {
          res.status(500).json({ error: `BE: Error retriving notifs by type ${err}` });
        }
      }
);

app.delete('/api/notifs/delete',
    async (req, res) => {
        try {
          const ina = await notificationDao.removeNotification(req.body.notif_id, req.body.user_id);
          res.status(200).json({ina});
        } catch (err) {
          res.status(503).json({ error: `BE: Error deleting notification ${err}` });
        }
      }
);

app.get('/api/notifs/:sender_id/:notif_type/:receiver_id/',
  async (req, res) => {
      try {
        const notif_id = await notificationDao.getSpecificNotification(req.params.sender_id, req.params.notif_type, req.params.receiver_id);
        res.status(200).json(notif_id);
      } catch (err) {
        res.status(500).json({ error: `BE: Error obtaining notif list ${err}` });
      }
    }
);

//Logs API

app.post('/api/logs/add',
  async (req, res) => {
      try {
        const ina = await logsDAO.insertActionLog(req.body.user_id, req.body.action_type, req.body.content, req.body.timestamp);
        res.status(201).json({ina});
      } catch (err) {
        res.status(503).json({ error: `BE: Error inserting logs ${err}` });
      }
    }
);

app.get('/api/logs/all/',
  async (req, res) => {
      try {
        const logs = await logsDAO.getAllActionLogs();
        res.status(200).json(logs);
      } catch (err) {
        res.status(500).json({ error: `BE: Error listing all logs ${err}` });
      }
    }
);

app.get('/api/logs/user/all/:user_id',
  async (req, res) => {
      try {
        const logs = await logsDAO.getUserActionLogs(req.params.user_id);
        res.status(200).json(logs);
      } catch (err) {
        res.status(500).json({ error: `BE: Error listing all user logs ${err}` });
      }
    }
);

app.delete('/api/logs/delete/all',
  async (req, res) => {
      try {
        const ina = await logsDAO.deleteAllActionLogs();
        res.status(200).json({ina});
      } catch (err) {
        res.status(503).json({ error: `BE: Error deleting logs ${err}` });
      }
    }
);

app.delete('/api/logs/delete/user/',
  async (req, res) => {
      try {
        const ina = await logsDAO.deleteUserActionLogs(req.body.user_id);
        res.status(200).json({ina});
      } catch (err) {
        res.status(503).json({ error: `BE: Error deleting user logs ${err}` });
      }
    }
);


app.listen(port, ()=> {
  console.log(`API server started at http://localhost:${port}`);
});
(async () => {
await Simulation.startSimulation();
})();
import Simulation from './simulation.mjs';






