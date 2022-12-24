import { cookies } from "next/headers"
import { unsealData } from "iron-session"
import { ironConfig } from "lib/withSession"

export default async function useUser() {
  const cookie = cookies().get("pc-session-cookie")
  //console.log({cookie})

  if (cookie?.value) {
    const data = await unsealData(cookie.value, {password: ironConfig.password})
    //console.log({data})
    const {email} = data?.user
    if (email)
      return { isLoggedIn: true, email }
  }

  return { isLoggedIn: false}
}