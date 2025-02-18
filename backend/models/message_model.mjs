export default function Message(message_id, chat_id, sender_id, reply_id, content, media_type, media_url, timestamp) {
    this.message_id = message_id;
    this.chat_id = chat_id;
    this.sender_id = sender_id;
    this.reply_id = reply_id;
    this.content = content;
    this.media_type = media_type;
    this.media_url = media_url;
    this.timestamp = timestamp;
}