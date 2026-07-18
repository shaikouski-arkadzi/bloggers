import { NextFunction, Request, Response } from "express";
import { ADMIN_LOGIN, ADMIN_PASSWORD } from "../../settings/config";

export const superAdminGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Ожидаем строке в authorization заголовке вида 'Basic xxxx'
  const auth = req.headers["authorization"] as string;

  if (!auth) {
    res.sendStatus(401);
    return;
  }

  const [authType, token] = auth.split(" ");

  if (authType !== "Basic") {
    res.sendStatus(401);
    return;
  }

  const credentials = Buffer.from(token, "base64").toString("utf-8");
  const [username, password] = credentials.split(":");

  if (username !== ADMIN_LOGIN || password !== ADMIN_PASSWORD) {
    res.sendStatus(401);
    return;
  }

  next();
};
