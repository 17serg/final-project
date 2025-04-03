const { UserProfile } = require('../../db/models');
const fs = require('fs').promises;
const path = require('path');

class UserProfileController {
  static async getProfile(req, res) {
    try {
      const { id: userId } = res.locals.user;
      const profile = await UserProfile.findOne({ where: { userId } });
      
      if (!profile) {
        return res.status(404).json({ message: 'Профиль не найден' });
      }
      
      return res.json(profile);
    } catch (error) {
      console.error('Error getting profile:', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { id: userId } = res.locals.user;
      const { gender, trainingExperience, avatar } = req.body;

      console.log('Updating profile for user:', userId);

      const [profile, created] = await UserProfile.findOrCreate({
        where: { userId },
        defaults: {
          userId,
          avatar,
          gender,
          trainingExperience,
          personalRecords: 0,
          trainingCount: 0,
        },
      });

      if (!created) {
        profile.avatar = avatar;
        profile.gender = gender;
        profile.trainingExperience = trainingExperience;
        await profile.save();
      }

      return res.json(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}

module.exports = UserProfileController;
