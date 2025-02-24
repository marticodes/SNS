export default class User {
    constructor (user_id, id_name, user_name, email, password, user_bio, profile_picture, status, visibility, activity_level ){
        this.user_id = user_id;
        this.id_name = id_name;
        this.user_name = user_name;
        this.email = email;
        this.password = password;
        this.user_bio = user_bio;
        this.profile_picture = profile_picture;
        this.status = status; // 0: inactive, 1: active; Initially, it's active
        this.visibility = visibility; //0: deactivated; 1: visible to friends; 2: open to everyone. Default is visibile to friends
        this.activity_level = activity_level;
    }
}