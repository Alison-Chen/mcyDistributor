import Head from "next/head"
import React, { Suspense } from "react"
import { BlitzLayout, ErrorBoundary, Routes } from "@blitzjs/next"
import Loading from "app/core/components/Loading"

import { backstagesRouters } from "app/configs/routerConfig"

import useGetCookie from "app/backstages/hooks/useGetCookie"
import { useRouter } from "next/router"

interface Props {
  Left?: React.ReactNode
  children: React.ReactNode
  [x: string]: any
}

const BackstagesLayout = ({ title, children, ...props }: Props) => {
  const cookie = useGetCookie()
  const router = useRouter()

  const handleOnNavigate = (path) => {
    void router.push(path)
  }

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
      <div className="flex items-center justify-center">
        <div className="w-1/5 h-screen bg-slate-500 text-white text-center">
          {backstagesRouters[0]?.children?.map((el) => (
            <div
              className="py-4 cursor-pointer border-b-2 border-slate-300 hover:bg-slate-900 duration-300"
              key={el.key}
              onClick={() => handleOnNavigate(el.path)}
            >
              {el.label}
            </div>
          ))}
        </div>
        <div className="w-4/5 h-[calc(100vh-24px)] flex flex-col justify-start items-center p-10 overflow-auto">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  )
}

export default BackstagesLayout
