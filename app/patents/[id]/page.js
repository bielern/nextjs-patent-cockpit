import Link from 'next/link'

import {prisma} from 'lib/database'
import useUser from 'lib/useUser'

export default async function EditPatentPage({params}) {
    const {id} = params
    const user = useUser()
    const patent = await getPatent(user.id, parseInt(id))
    return (
        <form className="flex flex-col gap-4 w-fit" method="post" action={`/api/patent/${id}`}>
            <h2>Edit Patent</h2>
            <label>Name<br/>
                <input type="text" name="name" defaultValue={patent.name} required autoFocus/>
            </label>
            <div className="flex flex-row-reverse gap-2">
                <input type="submit" value="Submit" className="btn" />
                <Link href="/patents" className="btn-tertiary">Cancel</Link>
            </div>
        </form>
    )
}

async function getPatent(userId, id) {
  //console.log({userId})
  const patents = await prisma.patents.findMany({ where: { userId, id } })
  //console.log(patents)
  return patents[0]
}