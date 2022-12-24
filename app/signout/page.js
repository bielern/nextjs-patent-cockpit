'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignoutPage() {
    const router = useRouter()

    useEffect(() => {
      if (router) {
          fetch("/api/signout").then(() => {
              router.refresh()
              router.push("/")
          })
      }
    }, [router])
    
    return <div >Signing out...</div>
}