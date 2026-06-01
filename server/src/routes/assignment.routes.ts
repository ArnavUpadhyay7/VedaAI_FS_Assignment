import { Router } from "express";
import {
  createAssignmentHandler,
  deleteAssignmentHandler,
  getAssignmentHandler,
  listAssignmentsHandler,
  renameAssignmentHandler,
} from "../controllers/assignment.controller";
import { uploadAssignmentFile } from "../middleware/upload";
import {
  createAssignmentSchema,
  renameAssignmentSchema,
} from "../validators/assignment.validator";
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
router.patch("/:id", (req, res, next) => {
  const parsed = renameAssignmentSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(", ");
    sendError(res, message, 400);
    return;
  }

  req.body = parsed.data;
  void renameAssignmentHandler(req, res, next);
});
router.delete("/:id", deleteAssignmentHandler);

export default router;
