export default function Post(post_id, parent_id, user_id, content, topic, media_type, media_url, timestamp, duration, visibility, comm_id, hashtag){
    this.post_id = post_id;
    this.parent_id = parent_id;
    this.user_id = user_id;
    this.content = content;
    this.topic = topic;
    this.media_type = media_type;
    this.media_url = media_url;
    this.timestamp = timestamp;
    this.duration = duration;
    this.visibility = visibility;
    this.comm_id = comm_id;
    this.hashtag = hashtag;
}