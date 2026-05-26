import { Router } from "express";
import assignmentRoutes from "./assignment.routes";
import resultRoutes from "./result.routes";

const router = Router();

router.use("/assignments", assignmentRoutes);
router.use("/results", resultRoutes);

export default router;
