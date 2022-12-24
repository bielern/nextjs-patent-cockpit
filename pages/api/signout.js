import { withSessionRoute } from "lib/withSession";

export default withSessionRoute(async (req, res) => {
    req.session.destroy()
    return res.status(200).send("OK")
})
