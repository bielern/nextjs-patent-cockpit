import Link from 'next/link'
import useUser from 'lib/useUser'

export async function NavBar() {

  const {isLoggedIn, email} = await useUser()

    return isLoggedIn
        ? <>
            <Link className='font-medium' href="/patents" > Patents</Link >
            <Link href="/signout" className='sm:ml-auto font-medium'>{email}</Link>
        </>
        : <Link className='sm:ml-auto font-medium' href="/login">Login</Link>
}