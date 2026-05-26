import { Router } from "express";
import { getResultHandler } from "../controllers/result.controller";

const router = Router();

router.get("/:assignmentId", getResultHandler);

export default router;
