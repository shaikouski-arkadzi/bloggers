import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application";

export const jwtValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Ожидаем строке в authorization заголовке вида 'Bearer xxxx'
  const auth = req.headers["authorization"] as string;

  if (!auth) {
    res.sendStatus(401);
    return;
  }

  const [authType, token] = auth.split(" ");

  if (authType !== "Bearer") {
    res.sendStatus(401);
    return;
  }

  const verified = await jwtService.verifyToken(token);

  if (!verified) {
    res.sendStatus(401);
    return;
  }

  next();
};
