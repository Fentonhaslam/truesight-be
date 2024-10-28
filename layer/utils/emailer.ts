import nodemailer from 'nodemailer';

let cachedEmailer: nodemailer.Transporter;

const getEmailer = (): nodemailer.Transporter => {
  if (!cachedEmailer) {
    cachedEmailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }, {
      from: process.env.SMTP_FROM,
    });
  }
  return cachedEmailer;
}

export const sendEmail = async (to: string, subject: string, body: string) => {
  console.log("Sending email to:", to, "with subject:", subject);
  const data = await getEmailer().sendMail({
    to,
    subject,
    html: body,
  });
  console.log("Email sent:", data);
}

export type EmailTemplateType = "login" | "loginotp" | "signup" | "signupotp" | "signupexists" | "signupexistsotp";

interface EmailTemplate {
  subject: string;
  body: (props: Record<string, string>) => string;
}

const emailTemplates: Record<EmailTemplateType, EmailTemplate> = {
  login: {
    subject: "MyLeeloo Login",
    body: (props: Record<string, string>) => `<h2>Hello</h2><p>Follow this link to login</p><p><a href="${props.magicLink}">Login</a></p>`
  },
  loginotp: {
    subject: "MyLeeloo Login",
    body: (props: Record<string, string>) => `<h2>Hello</h2><p>${props.otp} is your one-time code</p>`
  },
  signup: {
    subject: "MyLeeloo Signup",
    body: (props: Record<string, string>) => `<h2>Hello</h2><p>Follow this link to sign up</p><p><a href="${props.magicLink}">Sign Up</a></p>`,
  },
  signupotp: {
    subject: "MyLeeloo Signup",
    body: (props: Record<string, string>) => `<h2>Hello</h2><p>${props.otp} is your one-time code</p>`,
  },
  signupexists: {
    subject: "MyLeeloo Login",
    body: (props: Record<string, string>) => `<h2>Hello</h2><p>It looks like you've signed up already, follow this link to login to your existing account</p><p><a href="${props.magicLink}">Login</a></p>`,
  },
  signupexistsotp: {
    subject: "MyLeeloo Login",
    body: (props: Record<string, string>) => `<h2>Hello</h2><p>It looks like you've signed up already, use this otp to login to your existing account<p>${props.otp} is your one-time code</p>`,
  },
};

export const getEmailTemplate = (type: EmailTemplateType, props: Record<string, string>): { subject: string; body: string } => {
  const template = emailTemplates[type];
  if (!template) {
    throw new Error(`Template type "${type}" is not supported.`);
  }
  return {
    subject: template.subject,
    body: template.body(props)
  };
};