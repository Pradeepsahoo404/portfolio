import { Router } from "express";
import { publicController } from "../../controllers/public.controller.js";

const router = Router({ mergeParams: true });

router.get("/bootstrap", publicController.getBootstrap);
router.get("/home", publicController.getHome);
router.get("/projects", publicController.getProjects);
router.get("/projects/:slug", publicController.getProjectBySlug);
router.get("/services", publicController.getServices);
router.get("/blog", publicController.getBlogs);
router.get("/blog/:slug", publicController.getBlogBySlug);
router.get("/testimonials", publicController.getTestimonials);

export default router;
