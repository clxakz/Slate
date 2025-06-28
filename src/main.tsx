import './index.css'

import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import GlobalProvider from './components/global-provider.tsx'
import { Toaster } from "@/components/shadcn/sonner"
import { Loader } from 'lucide-react'
import { ThemeProvider } from '@/components/shadcn/theme-provider.tsx'

const Layout = lazy(() => import("./Layout.tsx"));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalProvider>
      <ThemeProvider defaultTheme='light' storageKey='theme'>
        <Toaster/>
        <Suspense fallback={<div className='flex w-screen h-screen items-center justify-center'><Loader className='animate-spin' /></div>}>
          <Layout/>
        </Suspense>
      </ThemeProvider>
    </GlobalProvider>
  </React.StrictMode>,
)
