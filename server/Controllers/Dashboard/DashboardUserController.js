const User = require("../../Model/User");
const sendToken = require("../../utils/sendToken")
exports.dashboardLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & Password are required",
      });
    }
    const accessor = await User.findOne({ Email: email })
    if (!accessor) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    if (!["admin", "manager", "agent"].includes(accessor.role)) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized to access dashboard.",
      });
    }
    const isMatch = await accessor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    sendToken(accessor, res, "SignIn successful", "access_token_realEstate");
  } catch (err) {
    console.error("Dashboard Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getUsersWithFilter = async (req, res) => {
  try {
    const { customId = "", page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(parseInt(page, 10), 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10), 1), 100);

    const requester = await User.findById(req.user.id).lean();

    // Build base query for list (exclude self)
    const query = {
      _id: { $ne: req.user.id },
    };

    if (customId.trim() !== "") {
      query.customId = { $regex: customId.trim(), $options: "i" };
    }

    // If manager, exclude other managers
    if (requester?.role === "manager") {
      query.role = { $ne: "manager" };
    }

    // Fetch users for the list
    const totalUsers = await User.countDocuments(query);
    const skip = (pageNumber - 1) * limitNumber;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // ✅ Calculate full role counts (includes logged-in user)
    const roleCounts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const roleCountMap = roleCounts.reduce((acc, r) => {
      acc[r._id] = r.count;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      pagination: {
        totalUsers,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalUsers / limitNumber),
        limit: limitNumber,
      },
      count: users.length,
      users,
      roleCountMap, // 👈 includes correct counts (with self)
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params; // Target user ID
    const { role: newRole } = req.body; // Role to assign
    const requester = await User.findById(req.user.id); // Authenticated requester

    if (!requester) {
      return res.status(404).json({
        success: false,
        message: "Requester user not found.",
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found.",
      });
    }

    // --- ROLE HIERARCHY RULES ---
    // Role hierarchy for clarity
    const hierarchy = {
      admin: 3,
      manager: 2,
      agent: 1,
      user: 0, // optional for completeness
    };

    const requesterRole = requester.role;
    const targetRole = targetUser.role;

    // --- Restriction: Prevent modifying higher or equal roles ---
    if (hierarchy[requesterRole] <= hierarchy[targetRole]) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to modify a user with equal or higher privileges (${targetRole}).`,
      });
    }

    // --- Restriction: Prevent assigning roles higher or equal to self ---
    if (hierarchy[requesterRole] <= hierarchy[newRole]) {
      return res.status(403).json({
        success: false,
        message: `You cannot assign a role equal to or higher than your own (${requesterRole}).`,
      });
    }

    // --- Restriction: Admin cannot demote another admin ---
    if (requesterRole === "admin" && targetRole === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins cannot modify other admins.",
      });
    }

    // --- Restriction: Manager cannot modify admin or other managers ---
    if (
      requesterRole === "manager" &&
      (targetRole === "admin" || targetRole === "manager")
    ) {
      return res.status(403).json({
        success: false,
        message: "Managers cannot modify Admins or other Managers.",
      });
    }

    // --- Restriction: Agent cannot modify anyone ---
    if (requesterRole === "agent") {
      return res.status(403).json({
        success: false,
        message: "Agents are not authorized to modify any roles.",
      });
    }

    // --- Proceed with role update ---
    targetUser.role = newRole;
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `User role updated successfully to '${newRole}'.`,
      updatedUser: {
        id: targetUser._id,
        name: targetUser.name,
        role: targetUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Target user ID to delete
    const requester = await User.findById(req.user.id); // Authenticated requester

    if (!requester) {
      return res.status(404).json({
        success: false,
        message: "Requester not found.",
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found.",
      });
    }

    // --- ROLE HIERARCHY ---
    const hierarchy = {
      admin: 3,
      manager: 2,
      agent: 1,
      user: 0,
    };

    const requesterRole = requester.role;
    const targetRole = targetUser.role;

    // --- Restriction: Prevent deleting higher or equal roles ---
    if (hierarchy[requesterRole] <= hierarchy[targetRole]) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to delete a user with equal or higher privileges (${targetRole}).`,
      });
    }

    // --- Restriction: Admin cannot delete other admins ---
    if (requesterRole === "admin" && targetRole === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins cannot delete other admins.",
      });
    }

    // --- Restriction: Manager cannot delete Admins or other Managers ---
    if (
      requesterRole === "manager" &&
      (targetRole === "admin" || targetRole === "manager")
    ) {
      return res.status(403).json({
        success: false,
        message: "Managers cannot delete Admins or other Managers.",
      });
    }

    // --- Restriction: Agents cannot delete anyone ---
    if (requesterRole === "agent") {
      return res.status(403).json({
        success: false,
        message: "Agents are not authorized to delete any users.",
      });
    }

    // --- Prevent self-deletion for safety ---
    if (String(requester._id) === String(targetUser._id)) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    // --- Proceed with deletion ---
    await targetUser.deleteOne();

    return res.status(200).json({
      success: true,
      message: `User '${targetUser.name}' (role: ${targetUser.role}) has been deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.dashboardlogout = (req, res) => {
  const cookieName = "access_token_realEstate";

  res.cookie(cookieName, null, {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};