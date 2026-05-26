import type { Request, Response, NextFunction } from "express";
import { getResultByAssignmentId } from "../services/result.service";
import { sendError, sendSuccess } from "../utils/response";

export async function getResultHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await getResultByAssignmentId(req.params.assignmentId as string);
    if (!result) {
      sendError(res, "Result not found", 404);
      return;
    }
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
