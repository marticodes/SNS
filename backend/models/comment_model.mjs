export default function Comment(comment_id, parent_id, user_id, content, media_type, media_url, timestamp, reaction, visibility,post){
    this.comment_id = comment_id;
    this.parent_id = parent_id;
    this.user_id = user_id;
    this.content = content;
    this.media_type = media_type;
    this.media_url = media_url;
    this.timestamp = timestamp;
    this.reaction = reaction;
    this.visibility = visibility;
    this.post = post;
}