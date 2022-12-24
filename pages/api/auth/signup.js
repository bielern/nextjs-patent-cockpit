import { withSessionRoute } from "lib/withSession";
import { hashPassword } from "lib/password";
import { prisma } from "lib/database";

export default withSessionRoute(async (req, res) => {
  const { email, password } = req.body
  const hashedPassword = await hashPassword(password)
  await prisma.users.create({data: {email, password: hashedPassword}})
  req.session.user = {email, isLoggedIn: true}
  await req.session.save()

  return res.status(200).redirect("/")
})
