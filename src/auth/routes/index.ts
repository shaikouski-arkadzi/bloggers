import { Router } from "express";
import nodmailer from "nodemailer";
import { resultValidationMiddleware } from "../../common/validation";
import { AUTH_ROUTES } from "../constants";
import { loginUser, userInfo } from "../controllers";
import { loginInputDtoValidation } from "../validation";
import { jwtValidationMiddleware } from "../middleware";
import { GOOGLE_APP_PASSWORD } from "../../settings/config";

const router = Router();

router.post(
  AUTH_ROUTES.LOGIN,
  loginInputDtoValidation,
  resultValidationMiddleware,
  loginUser,
);

router.get(AUTH_ROUTES.ME, jwtValidationMiddleware, userInfo);

router.post("/send", async (req, res) => {
  let transporter = nodmailer.createTransport({
    service: "gmail",
    auth: {
      user: "arkadiy92@gmail.com",
      pass: GOOGLE_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: "A",
    to: "gispeyupso@necub.com",
    subject: "Hello",
    html: "<b>Hello</b>",
  });

  res.send({});
});

export default router;
