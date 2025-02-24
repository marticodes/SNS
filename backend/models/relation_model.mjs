//0: friend
//1: close friend
//2: follower 
//3: blocked
//3: ...

export default function Relations(relation_id, user_id_1, user_id_2, relation_type, restricted, closeness){
    this.relation_id = relation_id;
    this.user_id_1 = user_id_1;
    this.user_id_2 = user_id_2;
    this.relation_type = relation_type;
    this.restricted = restricted;
    this.closeness = closeness;
}