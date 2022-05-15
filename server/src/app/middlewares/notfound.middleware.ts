import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http.exception";
export function notFoundMiddleware(
  _: Request,
  __: Response,
  next: NextFunction
) {
  next(new HttpException(404, "Not Found"));
}
