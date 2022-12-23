import {prisma} from '../../app/patents/page'

export default async function handler(req, res) {
    // Get data submitted in request's body.
    const body = req.body
  
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log('body: ', body)
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.name) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'Name not found' })
    }

    await prisma.patents.create({data: {name: body.name}})
        .catch(e => console.error(e))
  
    // Found the name.
    // Sends a HTTP success code
    res.status(200).redirect("/patents") //.json({ data: `${body.first} ${body.last}` })
  }