import { NextFunction, Request, Response } from "express";

// Error-handling middleware
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    next();
    return;
  }

  console.error(err); // Log the error for debugging

  // Determine the error type and response structure
  const statusCode = (err as any)?.status || 500; // Default to 500 if no status is provided
  const message = (err as Error).message || "An unexpected error occurred";

  // Check if the error is of a known type (custom error handling)
  if (err instanceof SyntaxError && "body" in err) {
    // Example: Syntax error in JSON body parsing
    res.status(400).json({ message: "Invalid JSON syntax" });
    return;
  }

  // Pass unhandled errors to the next middleware if needed
  if (typeof err !== "object" || !(err instanceof Error)) {
    next(err);
    return;
  }

  // Standard error response
  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === "production" ? undefined : err, // Hide details in production
  });
};
