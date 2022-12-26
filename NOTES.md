# A CRUD web app with auth using Next.js 13, iron-session and prisma

[Next.js 13](https://nextjs.org) has been realeased in October 2022.
To judge it, I have created a simple web app with authentication and some
simple database functionality.
I will first go over the big features like the app ([in beta](https://beta.nextjs.org/docs)) directory of this
release. Then, I will have a small code walkthrough highlighting the most important bits and pieces.

Lately, I have become more interested 
in server-sider-rendering web apps.
I have tried [Remix](https://remix.run) and [Ruby on Rails](https://rubyonrails.org) so far.
Remix showed me how easy things can become if we skip the client-side-rendering paradigm.
However, the tooling is a bit rudimentary.
Next, I had a go at Ruby on Rails 7, which I really liked to start with.
Together with Hotwire and Turbo, it seems like it could be a really performant solution.
However, I was a bit uncomfortable with the amount of (impressive) macro magic,
and the fact, that you still need to have two different languages (Ruby and JS).

The vision of where Next.js wants to be (it's not there yet),
really appealed to me (although it still uses JS on the backend).
So I wanted to create a simple web-app to "feel" it.
In the future, I want to run the same experiment listed below also with
with [Elixir](https://elixir-lang.org) and with [Clojure](https://clojure.org).

Next JS seems to have some nice ideas from the framworks mentioned above and some more:
 - The tooling is quite nice (create-next-app, turbopack)
 - You can seamlessly integrate [Tailwind CSS](https://tailwindcss.com).
 - Database integration with [Prisma](prisma.io) is smooth.
 - Layered layouts (beta) help you design your components similar to how Remix/[React Router](https://reactrouter.com) works
 - When several components fetch the same data, the requests are deduped to speed the load up
 - You can keep the major layout parts pre-rendered (static) and serve them instantly
   while the user or route specific content loads.
 - The developer experience is really nice: it runs locally as smooth as distributed.
 - Since it aims to create a lightweight build as possible it's also well-suited for self-hosting.

So, in order to test these promises, 
I wanted to build [a simple CRUD web app](https://github.com/bielern/nextjs-patent-cockpit) 
with authentication to manage patents.
It should have the following features:

 - You can signup, login and signout
 - You should be able to add, edit, delete and read only your patents

As I was trying out the app directory (beta), these were the negative points. 
Some of them will probably be solved in the future or just by using the right libraries.

 - Mutating data is a bit cumbersome. Especially for optimistic updates,
   where you assume that the mutation will be successful and 
   you show the changed state already without confirmation from the server.
 - Creating CRUD endpoints is still quite cumbersome and repetitive
   but there seems to be libraries for this (e.g. [`next-crud`](https://next-crud.js.org)).
 - If your root layout already has to check if you are logged in, 
   there isn't actually much static content to serve.
 - I am afraid that if you want really good performance (like optimistic updates),
   you end up writing a lot of client components that mirror the database locally 
   using something like [React-Query](https://react-query-v3.tanstack.com/).

It might be that there are some easy solutions for those, that I didn't find yet.
It took me about 6 hours or so to build it all and I still want to spend some time
with my family over Christmas.


## The tech stack

As already mentioned, I used `create-next-app` with the experimental turbopack 
and the experimental app directory to get started.
For styiling I am using Tailwind CSS.
To connect to the Postgres database, I am using Prisma.
To handle authentication, I am using [iron-session](https://github.com/vvo/iron-session#readme) 
and [argon](https://www.npmjs.com/package/argon2) to encrypt the passwords.
A nice article about using 
[iron-session with mongoose](https://dev.to/fcpauldiaz/nextjs-full-example-of-next-iron-session-1019) helped me to get started.


## Code Walk through

The code is also published in my [GitHub repo](https://github.com/bielern/nextjs-patent-cockpit).
Feel free to check it out.

### Database

Let's start with the database: I was following 
[Prisma's guide on postgres](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgres).
The schema is pretty simple:
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model users {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  password String
  patents  patents[]
}

model patents {
  id      Int      @id @default(autoincrement())
  name    String   @db.VarChar(255)
  user    users    @relation(fields: [userId], references: [id])
  userId  Int
}
```
It has two tables: one for the users (email and password) and one for the 
patents (just the name).

The prisma client is exposed in `lib/database.js`:
```
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

### Session

I chose the very barebone library `iron-session` for handling sessions
instead of a more extensive library like `NextAuth.js`.
The session helper functions are in `lib/withSession.js`:
```
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { ironConfig } from "lib/config";

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, ironConfig);
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, ironConfig);
}
```
and in `lib/useUser.js`:
```
import { cookies } from "next/headers"
import { unsealData } from "iron-session"
import { ironConfig } from "lib/config"

export default async function useUser() {
  const cookie = cookies().get(ironConfig.cookieName)

  if (cookie?.value) {
    const data = await unsealData(cookie.value, {password: ironConfig.password})
    const user = data?.user
    if (user?.isLoggedIn)
      return { isLoggedIn: true, ...user }
  }

  return { isLoggedIn: false}
}
```
The code for `useUser` is very specific for server components (because of the 
`cookies` function) as they are done in the new (beta) app directory.
Thus, I had to manually decrypt (or "unseal") the data stored in the session cookie.

The `lib/config.js` file contains the iron-session config 
```
export const ironConfig = {
  cookieName: "pc-session-cookie",
  password: process.env.COOKIE_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}
```

The environment variables for prima and iron-session are both in `.env`:
```
DATABASE_URL="postgresql://<username>@localhost:5432/pc?schema=public"
COOKIE_PASSWORD="long_password_at_least_32_characters_long"
```

At last, some helper functions to hash and compare hashed passwords are provided
in `lib/password.js`
```
import argon2 from "argon2";

export async function hashPassword(password) {
    const hashed = await argon2.hash(password);
    return hashed
}

export async function verifyPassword(password, hashedPassword) {
    try {
        const verified = await argon2.verify(hashedPassword, password)
        return verified
    } catch (error) {
        console.error(error)
        return false
    }
}
```


### API routes

The auth API routes are under `pages/api/auth` and handle login, signup and signout.

In `signup.js`, we save the user with his email and hashed password.
A session is created right away (and stored in the cookie).
```
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
```
The advantage of saving the session in the cookie is that it is stateless and 
does not require the server to keep track of the sessions.

The code in `login.js` is similar, except that we don't create the user but look
it up and compare the passwords.
Then, we save all the necessary data in the session user cookie.
```
import { withSessionRoute } from "lib/withSession";
import { prisma } from "lib/database";
import { verifyPassword } from "lib/password";

export default withSessionRoute(async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.users.findUnique({ where: {email}})
  const verified = await verifyPassword(password, user.password)
  if (!user || !verified) {
    res.status(401).redirect(`/login?email=${email}&error=Unauthorized`)
    return;
  }
  // Ensure that password is removed
  req.session.user = {...user, password: undefined, isLoggedIn: true}
  await req.session.save()

  return res.status(200).redirect("/")
})
```

At last, the `signout.js` route destroys the session cookie.
```
import { withSessionRoute } from "lib/withSession";

export default withSessionRoute(async (req, res) => {
    req.session.destroy()
    return res.status(200).send("OK")
})
```


## The GUI

I wanted to try out the new app directory approach (beta) for this GUI.
It is inteded to help you easily create [layered layouts](https://www.youtube.com/watch?v=6mQ3M1CUGnk&t=2s). 
E.g. with a menu bar and then with appearing components as one navigate deeper and the deeper.
The directory tree for this example app looks like the following:
```
app
├── (auth)
│   ├── layout.js
│   ├── login
│   │   └── page.js
│   ├── signout
│   │   └── page.js
│   └── signup
│       └── page.js
├── (web-app)
│   ├── layout.jsx
│   ├── page.jsx
│   └── patents
│       ├── [id]
│       │   └── page.js
│       ├── add
│       │   └── page.js
│       ├── page.js
│       └── patent.js
├── globals.css
└── head.jsx
```
The `(auth)` and `(web-app)` folders group the underlying routes so that they
can share the same basic layout.

The GUIs are pretty simple and you can look at them in detail in the [repo](https://github.com/bielern/nextjs-patent-cockpit).
As an example, the `/patents` route defined under `app/patents/page.jsx`
looks like this
```
import { prisma } from 'lib/database'
import useUser from 'lib/useUser'
import Link from 'next/link'
import Patent from './patent'


export default async function Page({ children }) {
  const user = await useUser()
  const patents = await getPatents(user.id)
  return (
    <div>
      <h1>Patents</h1>
      <div className="flex flex-col gap-4 w-fit">
        <Link href="/patents/add" className='self-end btn-secondary hover:bg-blue-200'>Add Patent</Link>
        {patents.map(patent => <Patent key={patent.id} {...patent} />)}
      </div>
    </div>
  )
}

async function getPatents(userId) {
  const patents = await prisma.patents.findMany({ where: { userId } })
  return patents
}
```
We get the user ID from the session cookie through `useUser`  
and then we use it to get the user's patents.
This page is rendered on the server side. 

On the other hand, the `Patent` component is rendered on the client and looks like this
```
'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Patent({ name, id }) {
    const router = useRouter()

    return <div className="bg-white p-4 rounded-lg flex flex-row gap-4 min-w-[20rem]">
        <h2 className='grow'>{name}</h2>
        <button
            onClick={() => fetch(`/api/patent/${id}`, { method: 'DELETE' }).then(() => router.refresh())}
            className='px-4 py-2 text-red-500 border border-red-500 hover:bg-red-100 rounded-lg'
        >Delete</button>
        <Link href={`/patents/${id}`} className='btn-secondary'>Edit</Link>
    </div>
}
```
It has to be on the client because we need the Javascript defined in the delete button
to run on the client side (when the button is clicked).
You can also see how we have to refresh the page after deleting the patent, 
so that it dissappears from the list of patents.
The [official documentation on data mutation](https://beta.nextjs.org/docs/data-fetching/mutating)
has a bit of a more complicated example for mutating data and animating the transition.

I think here in data mutation is currently the weak spot when comparing with a more
client-side-rendering (CSR) approach to web apps.
With CSR, we could e.g. use [React Query to do optimistic data mutation](https://react-query-v3.tanstack.com/guides/optimistic-updates).
This is possible, because most of the time all the relevant data is mirrored on the client side.

### Middleware for Auth

As an added layer of protection, I have added a middleware layer 
that checks for a valid session and sends the user to `/login` if not. 
It might not be necessary but I wanted to try it anyway:
```
import { getIronSession } from "iron-session/edge";
import { NextResponse } from "next/server"
import { ironConfig } from "lib/config"

export async function middleware(req) {
    const res = NextResponse.next()

    const session = await getIronSession(req, res, ironConfig)
    if (!session?.user?.isLoggedIn) {
        // We need an absolute URL. This makes sure, we get the current host.
        const url = req.nextUrl.clone()
        url.pathname = "/login"
        return NextResponse.rewrite(url)
    }

    return res
}
export const config = {
    matcher: [
        /* Matches all request paths except for the ones starting with: */
        '/((?!api/auth|login|signup|_next/static|favicon).*)',
    ]
}
```


## Conclusion

The new release of nextjs presents an inticing vision of the future of web apps.
It looks like a promising path to provide a nice developer experience to 
build a web app that scales easily from a self-hosted environment to the "state-less edge".
I was amazed to see in which little time I was able to build the scaffold of a web-app.
I did the same exercise a while ago with Ruby on Rails and I wasn't as happy as with Next.js now
-- even though it feels like Ruby on Rails comes with more bells and whistles right out of the box.

I am still wondering how easy it will be to make a server-side rendering web app
as responsive as a client-side rendering one.
But I am sure that a lot of brilliant people will put a lot of effort into it in the near future.

