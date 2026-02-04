"use server"

import { auth }  from "./auth";
import { headers } from "next/headers";

export const authSession = async () => {
  const session = auth.api.getSession({ headers: await headers() });
  return session;
};