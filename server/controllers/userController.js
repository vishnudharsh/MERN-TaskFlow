import User from "../models/userModel.js";
import { createJWT } from "../utils/connectDB.js";
import Notice from "../models/notiModel.js";
import crypto from "crypto";

export const registerUser = async (req, res) => {
  try {
    const { name, email, isAdmin, role, title } = req.body;
    let { password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        status: false,
        message: "Email address already exists",
      });
    }

    const generatedPassword = password || `Pass${crypto.randomBytes(4).toString('hex')}@`;
    const isPasswordGenerated = !password; 

    const user = await User.create({
      name,
      email,
      password: generatedPassword,
      isAdmin: isAdmin || false,
      role,
      title,
    });

    if (user) {
      if (isAdmin) {
        createJWT(res, user._id);
      }

      user.password = undefined;

      res.status(201).json({
        status: true,
        user,
        message: "User registered successfully",
        ...(isPasswordGenerated ? { generatedPassword } : {}), 
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password.",
      });
    }

    if (!user?.isActive) {
      return res.status(401).json({
        status: false,
        message:
          "User account has been deactivated, contact the administrator",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (user && isMatch) {
      createJWT(res, user._id);

      console.log("Login - User isAdmin field:", user.isAdmin);

      const userResponse = {
        _id: user._id,
        name: user.name,
        title: user.title,
        role: user.role,
        email: user.email,
        isAdmin: user.isAdmin,  
        isActive: user.isActive,
        createdAt: user.createdAt,
      };

      console.log("Login - Sending user response:", userResponse); 

      res.status(200).json({
        status: true,
        user: userResponse,
        message: "Login successful",
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({
      status: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTeamList = async (req, res) => {
  try {
    console.log("Fetching team list..."); // Debug log
    
    const users = await User.find()
      .select("name title role email isActive");
    
    console.log("Found users:", users.length); // Debug log
    
    res.status(200).json({
      status: true,
      users,
    });
  } catch (error) {
    console.log("Error fetching team:", error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;
    
    const notice = await Notice.find({
      team: userId,
      isRead: { $nin: [userId] },
    }).populate("task", "title");

    res.status(201).json({
      status: true,
      notice,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { _id } = req.body;

    const id =
      isAdmin && userId === _id
        ? userId
        : isAdmin && userId !== _id
        ? _id
        : userId;

    const user = await User.findById(id);

    if (user) {
      user.name = req.body.name || user.name;
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: "Profile Updated Successfully.",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;
    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    }
    
    res.status(201).json({ status: true, message: "Done" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (user) {
      user.password = req.body.password;

      await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: `Password changed successfully.`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      user.isActive = req.body.isActive;

      await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: `User account has been ${
          user?.isActive ? "activated" : "disabled"
        }`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
