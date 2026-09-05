import nodemailer from "nodemailer";
import { GOOGLE_APP_EMAIL, GOOGLE_APP_PASSWORD } from "../../settings/config";

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GOOGLE_APP_EMAIL,
        pass: GOOGLE_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: "Bloggers platform",
      to: email,
      subject: "Your code is here",
      html: template(code),
    });

    return !!info;
  },
};
