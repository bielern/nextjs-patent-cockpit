import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })
import '../globals.css'
import { NavBar } from './navbar'

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent head.jsx. 
        Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <main className={inter.className + ' bg-blue-100 min-h-screen'}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12 p-4 bg-blue-200">
            <Link href="/" className='flex flex-row items-center gap-4 font-medium'>
              <Image
                src="/favicon.svg"
                alt='Patent Cockpit logo'
                width={48}
                height={48}
                priority
              />
              <span>
                Patent Cockpit
              </span>
            </Link>
            <NavBar />
          </div>
          <div className='p-4'>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}