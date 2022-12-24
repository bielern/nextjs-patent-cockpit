//import { PrismaClient } from '@prisma/client'
import { prisma } from 'lib/database'
import useUser from 'lib/useUser'
import Link from 'next/link'
import Patent from './patent'


export default async function Page({ children }) {
  const user = await useUser()
  const patents = await getPatents(user.id)
  return (
    <div>
      <h1>Patents</h1>
      <div className='py-4'>
        <Link href="/patents/add" className='px-4 py-2 text-blue-500 border border-blue-500 hover:bg-blue-100 rounded-lg'>Add Patent</Link>
      </div>
      <div className="flex flex-col gap-4 pt-4 w-fit">
        {patents.map(patent => <Patent key={patent.id} {...patent} />)}
      </div>
    </div>
  )
}

async function getPatents(userId) {
  //console.log({userId})
  const patents = await prisma.patents.findMany({ where: { userId } })
  //console.log(patents)
  return patents
}

