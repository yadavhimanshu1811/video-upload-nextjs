import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions)
// {} TODO

export{handler as GET, handler as POST};