// import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
// import Notice from './../models/notiModel.js';
import Notice from '../models/notiModel.js';
import Task from './../models/taskModel.js';

export const createTask = async(req, res) => {
    try {
        const { userId } = req.user;
        const { title, team, stage, date, priority, assets } = req.body;

        let text = "New task has been assigned to you";
        if (team?.length > 1) {
            text = text + ` and ${team?.length - 1} others.`;
        }

        text =
            text +
            ` The task priority is set a ${priority} priority, so check and act accordingly. The task date is ${new Date(date)
                .toDateString()}. Thank you!!!`;


        const activity = {
            type: "assigned",
            activity: text,
            by: userId,
        };

        const task = await Task.create({
            title,
            team,
            stage: stage.toLowerCase(),
            date,
            priority: priority.toLowerCase(),
            assets,
            activities: activity,
            // links: newLinks || [],
            // description,
        });

        await Notice.create({
            team,
            text,
            task: task._id,
        });

        res.status(200).json({ 
            status: true, 
            task,
            message: "Task created successfully." });

        
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    // Alert users of the task
    let text = "New task has been assigned to you";
    if (task.team?.length > 1) {  // ⬅️ FIXED: Changed from team.team to task.team
      text = text + ` and ${task.team?.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${new Date(
        task.date
      ).toDateString()}. Thank you!!!`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    // Create duplicate task
    const newTask = await Task.create({
      title: "Duplicate - " + task.title,
      team: task.team || [],
      subTasks: task.subTasks || [],
      assets: task.assets || [],
      priority: task.priority,
      stage: task.stage,
      date: task.date,
      activities: [activity],
    });

    // Create notification for team members
    if (newTask.team?.length > 0) {
      await Notice.create({
        team: newTask.team,
        text,
        task: newTask._id,
      });
    }

    res.status(200).json({ 
      status: true, 
      message: "Task duplicated successfully.",
      task: newTask 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      status: false, 
      message: error.message 
    });
  }
};

export const postTaskActivity = async(req, res) => {
    try {
        const { id } = req.params;
        const { userId, isAdmin } = req.user;
        const { type, activity } = req.body;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ 
                status: false, 
                message: "Task not found" 
            });
        }

        // ✅ Permission Check: Allow if user is admin OR part of the task team
        const isTeamMember = task.team.some(
            (memberId) => memberId.toString() === userId.toString()
        );

        if (!isAdmin && !isTeamMember) {
            return res.status(403).json({ 
                status: false, 
                message: "You don't have permission to add activities to this task" 
            });
        }

        const data = {
            type,
            activity,
            by: userId,
        };

        task.activities.push(data);

        await task.save();

        res.status(200).json({ 
            status: true, 
            message: "Activity posted successfully." 
        });
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const dashboardStatistics = async(req, res) => {
    try {
    const { userId, isAdmin } = req.user;

    // Fetch all tasks from the database
    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    console.log("Total tasks found:", allTasks.length);
    console.log("Task priorities:", allTasks.map(t => ({ 
      title: t.title, 
      priority: t.priority 
    })));

    const users = await User.find({ isActive: true })
      .select("name title role isActive createdAt")
      .limit(10)
      .sort({ _id: -1 });

    // Group tasks by stage and calculate counts
    const groupedTasks = allTasks?.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority for chart
    const graphData = Object.entries(
      allTasks?.reduce((result, task) => {
        const { priority } = task;
        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    console.log("Graph data being sent:", graphData);

    // Calculate total tasks
    const totalTasks = allTasks.length;
    const last10Task = allTasks?.slice(0, 10);

    // Combine results into a summary object
    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupedTasks,
      graphData,
    };

    res
      .status(200)
      .json({ status: true, ...summary, message: "Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
}


export const getTasks = async (req, res) => {
    try {
        //   const { userId, isAdmin } = req.user;
  const { stage, isTrashed, search } = req.query;

  let query = { isTrashed: isTrashed ? true : false };

//   if (!isAdmin) {
//     query.team = { $all: [userId] };
//   }
  if (stage) {
    query.stage = stage;
  }

//   if (search) {
//     const searchQuery = {
//       $or: [
//         { title: { $regex: search, $options: "i" } },
//         { stage: { $regex: search, $options: "i" } },
//         { priority: { $regex: search, $options: "i" } },
//       ],
//     };
//     query = { ...query, ...searchQuery };
//   }

  let queryResult = Task.find(query)
    .populate({
      path: "team",
      select: "name title email",
    })
    .sort({ _id: -1 });

  const tasks = await queryResult;

  res.status(200).json({
    status: true,
    tasks,
  });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const getTask = async(req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id)
            .populate({
                path: "team",
                select: "name title role email",
            })
            .populate({
                path: "activities.by",
                select: "name",
            }).sort({ _id: -1 });

        res.status(200).json({
            status: true,
            task,
        });
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: error.message })
    }
}

export const createSubTask = async (req, res) => {
  const { title, tag, date } = req.body;
  const { id } = req.params;

  try {
    const newSubTask = {
      title,
      date,
      tag,
      isCompleted: false,
    };

    const task = await Task.findById(id);

    task.subTasks.push(newSubTask);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, date, team, stage, priority, assets, links, description } =
    req.body;

  try {
    const task = await Task.findById(id);

    // let newLinks = [];

    // if (links) {
    //   newLinks = links.split(",");
    // }

    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.assets = assets;
    task.stage = stage.toLowerCase();
    task.team = team;
    // task.links = newLinks;
    // task.description = description;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const trashTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      // ✅ FIXED: Bulk delete doesn't need id
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      // ✅ FIXED: Added await for save()
      const resp = await Task.findById(id);
      
      if (!resp) {
        return res.status(404).json({
          status: false,
          message: "Task not found",
        });
      }

      resp.isTrashed = false;
      await resp.save(); // ✅ Added await
    } else if (actionType === "restoreAll") {
      // ✅ Bulk restore doesn't need id
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


// // export const logoutUser = async(req, res) => {
// //     try {
        
// //     } catch (error) {
// //         console.log(error)
// //         return res.status(400).json({ status: false, message: error.message })
// //     }
// // }