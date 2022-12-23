import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.jsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <main className={inter.className + ' bg-slate-100 min-h-screen'}>
          <div className="flex flex-row items-center gap-12 p-4 bg-slate-200">
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
            <Link className='font-medium' href="/patents">Patents</Link>
            <Link className='font-medium' href="/products">Products</Link>
          </div>
          <div className='p-4'>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
