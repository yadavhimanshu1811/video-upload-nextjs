import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials:{
               email: {label:"Email", type: "text"},
               password: {label:"Password", type: "password"},
            },
            async authorize(credentials){
                //write custom logic
                if(!credentials?.email || !credentials?.password){
                    throw new Error ("Either email or password is missing");
                }
                try {
                    await connectToDatabase();
                    const user = await User.findOne({email: credentials.email})
                    if(!user){
                        throw new Error("No user with this email found");
                    }

                    const isPasswordCorrect =  await bcrypt.compare(
                        credentials.password, user.password
                    )

                    if(!isPasswordCorrect){
                        throw new Error("Wrong password");
                    }

                    return{
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch(error){
                    console.error("Auth error")
                    throw error;
                }
            }
        })
    ],
    callbacks:{ //https://next-auth.js.org/configuration/callbacks
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if(session.user){
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    session: {
        strategy: "jwt",
        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET
};






// export const authOptions: NextAuthOptions = {
//     providers: [
//         GithubProvider({
//         clientId: process.env.GITHUB_ID!,
//         clientSecret: process.env.GITHUB_SECRET!,
//         }),
//         // ...add more providers here
//     ]
// };