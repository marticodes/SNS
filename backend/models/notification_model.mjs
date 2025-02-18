export default function Notification(notif_id, content, notif_type, sender_id, receiver_id, timestamp){
    this.notif_id = notif_id;
    this.content = content;
    this.notif_type = notif_type;
    this.sender_id = sender_id;
    this.receiver_id = receiver_id;
    this.timestamp = timestamp;
}