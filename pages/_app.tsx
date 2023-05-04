import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React from "react"
import { withBlitz } from "app/blitz-client"
import "styles/global.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "antd/dist/antd.css"
import { SessionProvider } from "next-auth/react"

import { wrapper } from "data/store"

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <SessionProvider session={session}>{getLayout(<Component {...pageProps} />)}</SessionProvider>
    </ErrorBoundary>
  )
}

export default withBlitz(wrapper.withRedux(MyApp))
