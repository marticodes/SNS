//0: posting
//1: commenting
//2: reacting
//3: messaging
//4: updating
//5: comm
//6: notification
//7: creation agents

export default function ActionLogs(action_id, user_id, action_type, content, timestamp){
    this.action_id = action_id;
    this.user_id = user_id;
    this.action_type = action_type;
    this.content = content;
    this.timestamp = timestamp;
}