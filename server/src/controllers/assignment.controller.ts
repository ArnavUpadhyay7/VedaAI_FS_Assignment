import type { Request, Response, NextFunction } from "express";
import {
  createAssignment,
  deleteAssignment,
  getAssignmentById,
  listAssignments,
  renameAssignment,
} from "../services/assignment.service";
import { enqueueAssignmentJob } from "../queue/assignment.queue";
import { emitAssignmentEvent } from "../socket/index";
import { sendError, sendSuccess } from "../utils/response";
import type {
  CreateAssignmentInput,
  RenameAssignmentInput,
} from "../validators/assignment.validator";

export async function createAssignmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as CreateAssignmentInput;
    const file = req.file;

    const uploadedFile = file
      ? {
          originalName: file.originalname,
          path: file.path,
          mimeType: file.mimetype,
        }
      : undefined;

    const assignment = await createAssignment({
      ...body,
      uploadedFile,
    });

    await enqueueAssignmentJob(assignment._id.toString());
    emitAssignmentEvent("assignment:queued", assignment._id.toString());

    sendSuccess(res, assignment, 201);
  } catch (error) {
    next(error);
  }
}

export async function listAssignmentsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignments = await listAssignments();
    sendSuccess(res, assignments);
  } catch (error) {
    next(error);
  }
}

export async function getAssignmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignment = await getAssignmentById(req.params.id as string);
    if (!assignment) {
      sendError(res, "Assignment not found", 404);
      return;
    }
    sendSuccess(res, assignment);
  } catch (error) {
    next(error);
  }
}

export async function deleteAssignmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignment = await deleteAssignment(req.params.id as string);
    if (!assignment) {
      sendError(res, "Assignment not found", 404);
      return;
    }
    sendSuccess(res, { id: req.params.id });
  } catch (error) {
    next(error);
  }
}

export async function renameAssignmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as RenameAssignmentInput;
    const assignment = await renameAssignment(req.params.id as string, body.title);
    if (!assignment) {
      sendError(res, "Assignment not found", 404);
      return;
    }
    sendSuccess(res, assignment);
  } catch (error) {
    next(error);
  }
}
