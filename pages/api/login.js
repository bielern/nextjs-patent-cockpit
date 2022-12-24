import { withSessionRoute } from "lib/withSession";

export default withSessionRoute(async (req, res) => {
  const { email, password } = req.body
  // TODO: get user from db and check password
  const user = { email }
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }
  req.session.user = user
  await req.session.save()

  return res.status(200).redirect("/")
})


// TODO: pages/api/logout.js