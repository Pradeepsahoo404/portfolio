import { Router } from "express";
import { adminController } from "../../controllers/admin.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

// Secure all admin routes
router.use(authenticate);

// Get dashboard settings & entities
router.get("/data", adminController.getData);

// Settings / Home / About update
router.put("/workspace", adminController.updateWorkspace);

// Projects CRUD
router.post("/projects", adminController.createProject);
router.put("/projects/:id", adminController.updateProject);
router.delete("/projects/:id", adminController.deleteProject);

// Services CRUD
router.post("/services", adminController.createService);
router.put("/services/:id", adminController.updateService);
router.delete("/services/:id", adminController.deleteService);

// Skills CRUD
router.post("/skills", adminController.createSkill);
router.put("/skills/:id", adminController.updateSkill);
router.delete("/skills/:id", adminController.deleteSkill);

// Blogs CRUD
router.post("/blogs", adminController.createBlog);
router.put("/blogs/:id", adminController.updateBlog);
router.delete("/blogs/:id", adminController.deleteBlog);

// Technologies CRUD
router.post("/technologies", adminController.createTechnology);
router.put("/technologies/:id", adminController.updateTechnology);
router.delete("/technologies/:id", adminController.deleteTechnology);

export default router;
