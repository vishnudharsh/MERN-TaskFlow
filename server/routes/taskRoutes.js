import express from "express";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddleware.js";
import { createSubTask, createTask, dashboardStatistics, deleteRestoreTask, duplicateTask, getTask, getTasks, postTaskActivity, trashTask, updateTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createTask);
router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);

router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
router.put("/update/:id", protectRoute, isAdminRoute, updateTask);
router.put("/:id", protectRoute, isAdminRoute, trashTask);

// ✅ ADD THIS: Handle restore with PUT method
router.put(
  "/delete-restore/:id",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
);

// ✅ KEEP THIS: Handle delete with DELETE method
router.delete(
  "/delete-restore/:id",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default router;
