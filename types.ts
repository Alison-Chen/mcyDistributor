import { SimpleRolesIsAuthorized } from "@blitzjs/auth"
import { User } from "db"
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"
import Providers from "next-auth/providers"

export type Role = "ADMIN" | "USER"

declare module "@blitzjs/auth" {
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      role: Role
    }
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Profile {
    email_verified: boolean
  }
  interface Session {
    user: {
      /** The user's postal address. */
      id: number
      email: string
      name: string
      image: string
    }
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
    accessToken?: string
    providerId?: string
  }
}

declare module "next-auth/providers" {
  interface providers {
    provider: provider[]
  }
  interface provider {
    id?: string
    name?: string
  }
}
