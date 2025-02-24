import { authOptions } from "@/common/authOptions";
import NextAuth from "next-auth";

// import { handlers } from "@/auth";


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };