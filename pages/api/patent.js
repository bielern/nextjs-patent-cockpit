import {prisma} from 'lib/database'
import { withSessionRoute } from 'lib/withSession'

export default withSessionRoute(async (req, res) => {
    // Get data submitted in request's body.
    const body = req.body

    // Check if the name is present in the request's body.
    if (!body.name) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'Name not found' })
    }

    // TODO check http verb (GET, POST) and with id: POST, DELETE
    await prisma.patents.create({data: {name: body.name, userId: req.session.user.id}})
        .catch(e => console.error(e))

    res.status(200).redirect("/patents") 
  })