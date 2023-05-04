import { setupBlitzServer } from "@blitzjs/next"
import { AuthServerPlugin, PrismaStorage, simpleRolesIsAuthorized } from "@blitzjs/auth"
import { db } from "db"

const { gSSP, gSP, api } = setupBlitzServer({
  plugins: [
    AuthServerPlugin({
      cookiePrefix: "blitz-app",
      storage: PrismaStorage(db),
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
})

export { gSSP, gSP, api }
