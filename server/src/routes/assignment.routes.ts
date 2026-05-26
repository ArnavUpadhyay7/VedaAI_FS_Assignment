import { Router } from "express";
import {
  createAssignmentHandler,
  deleteAssignmentHandler,
  getAssignmentHandler,
  listAssignmentsHandler,
} from "../controllers/assignment.controller";
import { uploadAssignmentFile } from "../middleware/upload";
import { createAssignmentSchema } from "../validators/assignment.validator";
import { sendError } from "../utils/response";

const router = Router();

router.post("/", (req, res, next) => {
  uploadAssignmentFile(req, res, (err) => {
    if (err) {
      sendError(res, err.message, 400);
      return;
    }

    const parsed = createAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((i) => i.message).join(", ");
      sendError(res, message, 400);
      return;
    }

    req.body = parsed.data;
    void createAssignmentHandler(req, res, next);
  });
});

router.get("/", listAssignmentsHandler);
router.get("/:id", getAssignmentHandler);
router.delete("/:id", deleteAssignmentHandler);

export default router;
