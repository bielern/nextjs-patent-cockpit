//import { PrismaClient } from '@prisma/client'
import { prisma } from 'lib/database'
import Link from 'next/link'


export default async function Page({ children }) {
  const patents = await getPatents()
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

async function getPatents() {
    const patents = await prisma.patents.findMany()
    //console.log(patents)
    return patents
}

function Patent({name}) {
    return <div className="bg-slate-200 p-4 rounded-lg">
        <h2>{name}</h2>
    </div>
}