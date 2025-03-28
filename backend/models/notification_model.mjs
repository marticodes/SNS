//0: post react
//1: comment react
//2: msg react
//3: send fren req
//4: fren req accept
//5: comment added

export default function Notification(notif_id, content, notif_type, sender_id, receiver_id, timestamp){
    this.notif_id = notif_id;
    this.content = content;
    this.notif_type = notif_type;
    this.sender_id = sender_id;
    this.receiver_id = receiver_id;
    this.timestamp = timestamp;
}