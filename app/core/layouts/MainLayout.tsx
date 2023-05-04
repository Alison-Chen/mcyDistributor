import Head from "next/head"
import React, { Suspense } from "react"
import { BlitzLayout, ErrorBoundary, Routes } from "@blitzjs/next"
import Loading from "app/core/components/Loading"
import Navbar from "app/nav/components/Navbar"

interface Props {
  Left?: React.ReactNode
  children: React.ReactNode
  [x: string]: any
}

const MainLayout = ({ title, children, ...props }: Props) => {
  const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
      <div className="w-full flex justify-center">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{title || "美家園"}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="color-scheme" content="light only" />
      </Head>
      <div>
        <Navbar />
        <div className="flex flex-col w-full">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  )
}

MainLayout.authenticate = { redirectTo: Routes.LoginPage() }

export default MainLayout
