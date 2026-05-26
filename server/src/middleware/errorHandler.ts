import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);
  sendError(res, err.message || "Internal server error", 500);
}

export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, "Route not found", 404);
}
