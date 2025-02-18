//g_chat = 1, then user_id_2 is null.
//Members of a group_chat can be obtained through gc__membership class with chat_id 

export default function Chat(chat_id, user_id_1, user_id_2, group_chat, chat_name, chat_image){
    this.chat_id = chat_id;
    this.user_id_1 = user_id_1;
    this.user_id_2 = user_id_2;
    this.group_chat = group_chat;
    this.chat_name = chat_name;
    this.chat_image = chat_image;
}