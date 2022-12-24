'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Patent({ name, id }) {
    const router = useRouter()

    return <div className="bg-slate-200 p-4 rounded-lg flex flex-row gap-4 min-w-[20rem]">
        <h2 className='grow'>{name}</h2>
        <button
            onClick={() => fetch(`/api/patent/${id}`, { method: 'DELETE' }).then(() => router.refresh())}
            className='px-4 py-2 text-red-500 border border-red-500 hover:bg-red-100 rounded-lg'
        >Delete</button>
        <Link href={`/patents/${id}`} className='btn-secondary'>Edit</Link>
    </div>
}