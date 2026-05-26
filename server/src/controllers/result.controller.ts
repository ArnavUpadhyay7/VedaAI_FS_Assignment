import type { Request, Response, NextFunction } from "express";
import { getAssignmentById } from "../services/assignment.service";
import {
  getResultByAssignmentId,
  updateResultPdfUrl,
} from "../services/result.service";
import { generateAssessmentPdf } from "../services/pdf.service";
import { sendError, sendSuccess } from "../utils/response";

export async function getResultHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignmentId = req.params.assignmentId as string;
    let result = await getResultByAssignmentId(assignmentId);
    if (!result) {
      sendError(res, "Result not found", 404);
      return;
    }

    if (!result.pdfUrl) {
      const assignment = await getAssignmentById(assignmentId);
      if (assignment) {
        const pdfUrl = await generateAssessmentPdf(result, assignment);
        result = await updateResultPdfUrl(result._id.toString(), pdfUrl);
      }
    }

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
