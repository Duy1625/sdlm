import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { db } from './db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'public_profile',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.password) {
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isValid) {
            return null
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          // Check if user exists
          let existingUser = await db.user.findUnique({
            where: {
              provider_providerId: {
                provider: account.provider,
                providerId: account.providerAccountId
              }
            }
          })

          if (!existingUser) {
            // Create new user
            // For Facebook without email permission, use providerId as email
            const email = user.email || `${account.providerAccountId}@${account.provider}.oauth`

            existingUser = await db.user.create({
              data: {
                email: email,
                name: user.name,
                avatar: user.image,
                provider: account.provider,
                providerId: account.providerAccountId,
                role: 'USER'
              }
            })
          }

          user.id = existingUser.id.toString()
          user.role = existingUser.role
          return true
        } catch (error) {
          console.error('OAuth sign in error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET
}
