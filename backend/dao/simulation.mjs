import db from '../db.mjs';
import UserDAO from '../dao/user_dao.mjs';

const Simulation = {
    async performRandomAction(user_id) {
        const user_status = await UserDAO.isActiveUser(user_id);
        const user_activity_level = await UserDAO.getActivityLevel(user_id);

        if (user_status === 0) {
            if (Math.random() < user_activity_level) {
                return await UserDAO.updateUserStatus(user_id, 1);
            }
            return null;
        }

        // If online, small chance to go offline (inverse of activity_level)
        if (Math.random() < (1 - user_activity_level)) {
            return UserDAO.updateUserStatus(user_id, 0);
        }

        // Perform other actions if still online
        const actions = [
            updateProfilePicture(user_id, profile_picture),
            removeProfilePicture(user_id),
            updateUserBio(user_id, user_bio),
            
        ];
        
        const action = actions[Math.floor(Math.random() * actions.length)];
    },
};


export default Simulation;
