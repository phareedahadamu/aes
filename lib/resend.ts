"use server";
import RegisterAccountEmail from "@/components/emails/register";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSingleEmail({
  link,
  email,
  idempotencyKey,
}: {
  link: string;
  email: string;
  idempotencyKey: string;
}) {
  if (!link || !email) {
    throw new Error("Missing required email parameters.");
  }
  const { data, error } = await resend.emails.send(
    {
      from: "Acme <onboarding@resend.dev>",
      //   to: [email],
      to: "phareedahadamu@gmail.com",
      subject: "Hello world",
      react: RegisterAccountEmail({ link: link }),
    },
    { idempotencyKey },
  );

  if (error) {
    console.error("Resend API Error:", error);
    throw new Error(error.message);
  }

  return data;
}
