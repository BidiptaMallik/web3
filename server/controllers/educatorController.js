import { clerkClient } from '@clerk/express';

export const updateRoleToEducator = async (req, res) => {
  try {
    // For Postman testing — get userId from query
    const userId = req.query.userId;

    if (!userId) {
      return res.json({ success: false, message: "userId is required" });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator',
      },
    });

    res.json({ success: true, message: 'You can add courses' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
