const { UserProfile } = require('../../db/models');

const updateProfile = async (req, res) => {
  try {
    const { avatar, gender, trainingExperience, userId } = req.body;

    const [profile, created] = await UserProfile.findOrCreate({
      where: { userId },
      defaults: {
        avatar,
        gender,
        trainingExperience,
      },
    });

    if (!created) {
      await profile.update({
        avatar,
        gender,
        trainingExperience,
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

module.exports = {
  updateProfile,
};
