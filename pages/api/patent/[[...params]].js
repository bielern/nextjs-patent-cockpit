import {prisma} from 'lib/database'
import { withSessionRoute } from 'lib/withSession'

export default withSessionRoute(async (req, res) => {
    const { params } = req.query
    const {method} = req

    const userId = req.session.user.id
    //console.log({method, id: params[0]})
    if (method === 'GET') {
        if (params === undefined || params.length === 0) {
            const patents = await prisma.patents.findMany({ where: { userId } })
            return res.status(200).json(patents)
        } else if (params.length === 1) {
            const patent = await prisma.patents.findUnique({ where: { id: parseInt(params[0]), userId } })
            return res.status(200).json(patent)
        }
    } else if (method === 'POST') {
        const body = req.body
        if (params === undefined || params.length === 0) {
            if (body.name) {
                await prisma.patents.create({ data: { name: body.name, userId } })
                    .catch(e => console.error(e))

                return res.status(200).redirect("/patents")
            }
        } else if (params.length === 1) {
            const id = parseInt(params[0])
            await prisma.patents.updateMany({ data: { ...body, id }, where: { id, userId } })
            return res.status(200).redirect("/patents")
        }
    } else if (method === 'DELETE' && params.length === 1) {
        const id = parseInt(params[0])
        await prisma.patents.deleteMany({ where: { AND: [{id}, {userId}] } })
        return res.status(200).redirect("/patents")
    }

    return res.status(400).redirect("/patents")
  })
