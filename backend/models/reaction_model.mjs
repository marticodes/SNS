export default function Reactions(reaction_id, reaction_type, post_id, comment_id, chat_id, message_id, user_id, timestamp){
    this.reaction_id = reaction_id;
    this.reaction_type = reaction_type;
    this.post_id = post_id;
    this.comment_id = comment_id;
    this.chat_id = chat_id;
    this.message_id = message_id;
    this.user_id = user_id;
    this.timestamp = timestamp;
}