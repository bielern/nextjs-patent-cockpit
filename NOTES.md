# A CRUD web app with auth using Next.js 13, iron-session and prisma

I have created a simple web app with authentication and some database functionality 
to evaluate [Next.js 13](https://nextjs.org), which was released in October 2022. 
In this review, I will first discuss the major features of this release, 
including the app (in beta) directory. 
Then, I will provide a brief code walkthrough, highlighting the key aspects of the app.

## Server-side rendering Web-Apps

I have recently been interested in server-side rendering (SSR) for web applications. 
In SSR, the server handles rendering the web page and 
sends it back to the client when the client makes a request. 
This is different from client-side rendering (CSR), 
in which the client's web browser uses JavaScript to render the page. 
While CSR can provide a smooth user experience, 
SSR tends to have a simpler code base and can be more enjoyable for developers to work with.

## SSR Frameworks

I have mostly worked on client-side rendering (CSR) code bases, 
and I have grown increasingly frustrated with the separation of client-side and server-side code. 
I have tried two server-side rendering (SSR) frameworks: 
[Remix](https://remix.run) and [Ruby on Rails](https://rubyonrails.org).
Remix has somewhat limited tooling, while Ruby on Rails has a wealth of libraries and tooling thanks to its long history. 
When combined with Hotwire and Turbo, Ruby on Rails can be quite performant. 
However, I was somewhat discomforted by the extensive use of macro magic and 
the need to work with two different languages (Ruby and JavaScript).

The release of Next.js 13 demonstrates a clear vision for the near future 
(although it is not there yet). 
To get a sense of this future, 
I created a simple web app with authentication and database integration using Next.js. 
I plan to create the same web app 
using [Elixir](https://elixir-lang.org) and [Clojure](https://clojure.org)
to compare the experiences.

## Next.js

Next.js has some appealing features, including:
 - Nice tooling (create-next-app, turbopack)
 - Seamless integration with [Tailwind CSS](https://tailwindcss.com)
 - Smooth database integration with [Prisma](prisma.io)
 - Layered layouts (beta) that allow you to design components in a similar way to Remix/[React Router](https://reactrouter.com)
 - Request deduplication to speed up data loading when multiple components fetch the same data
 - The ability to pre-render and serve static content instantly while user or route-specific content loads
 - A pleasant developer experience, you can get it running locally as easily as distributed on the edge 
 - A focus on creating lightweight builds, making it well-suited for self-hosting

To test these features, I built [a simple CRUD web app](https://github.com/bielern/nextjs-patent-cockpit)
with authentication for managing patents. 
It has the following features:
 - Signup, login, and signout functionality
 - The ability to add, edit, delete, and read patents (restricted to the user's own patents)

While testing the app directory (beta), I encountered some negative points. 
Some of these may be resolved in the future or by using the right libraries:
 - Mutating data can be cumbersome, particularly when using optimistic updates,
   where you assume the mutation will be successful and 
   display the changed state before receiving confirmation from the server.
 - Creating CRUD endpoints is still somewhat repetitive and tedious, 
   although there are libraries like [`next-crud`](https://next-crud.js.org) that may help with this.
 - If the root layout needs to check if the user is logged in, there may not be much static content to serve.
 - I worry that achieving good performance (such as with optimistic updates) 
   may require writing a lot of client components that locally mirror the database 
   using something like [React-Query](https://react-query-v3.tanstack.com/).

It's possible that there are easy solutions for these issues that I have not yet found. 
It took me about 8 hours to build the app, and I still wanted to spend time with my family during Christmas.


## The tech stack

I used `create-next-app` with the experimental turbopack and the experimental app directory to set up my project. 
For styling, I am using [Tailwind CSS](tailwindcss.com). 
I am using [Prisma](prisma.io) to connect to a Postgres database, 
and I am using [iron-session](https://github.com/vvo/iron-session#readme)
and [argon](https://www.npmjs.com/package/argon2) to handle authentication and to encrypt passwords. 
I found [a helpful article about using iron-session with mongoose](https://dev.to/fcpauldiaz/nextjs-full-example-of-next-iron-session-1019)
to get started."


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
patents (just the name). Each patent belongs to one user.

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
The code for useUser is designed specifically for server components 
(due to the cookies function) in the new (beta) app directory. 
As a result, the data stored in the session cookie has to be manually decrypted (or "unsealed") .

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
By saving the session state in the encrypted cookie we obtain stateless session management,
since the server does not need to track the sessions.

The code in `login.js` is similar, except that we don't create the user but look
it up and compare the passwords.
Then, we save again all the necessary data in the session user cookie.
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

I wanted to try out the [new app directory approach (beta)](https://beta.nextjs.org) for this GUI.
It is inteded to help you easily create [layered layouts](https://www.youtube.com/watch?v=6mQ3M1CUGnk&t=2s). 
E.g. with a menu bar and then with appearing components as one navigate deeper and the deeper.
The directory tree for this example app looks like the following:
```
app/
|-- (auth)
|   |-- layout.js
|   |-- login
|   |   `-- page.js
|   |-- signout
|   |   `-- page.js
|   `-- signup
|       `-- page.js
|-- (web-app)
|   |-- layout.jsx
|   |-- page.jsx
|   `-- patents
|       |-- [id]
|       |   `-- page.js
|       |-- add
|       |   `-- page.js
|       |-- page.js
|       `-- patent.js
|-- globals.css
`-- head.jsx
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

On the other hand, the `Patent` component is rendered on the client (`'use client'`) and looks like this
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
It must be located on the client side because the 
delete button's JavaScript code must be executed by the client when clicked.
After deleting a patent, we have to refresh the page to remove it from the list. 
The [official documentation on data mutation](https://beta.nextjs.org/docs/data-fetching/mutating)
 provides a more complex example that demonstrates how to mutate data and animate the transition.

In my opinion, data mutation is currently a weakness of server-side rendering (SSR) 
compared to client-side rendering (CSR). 
With CSR, we can use tools like 
[React Query to perform optimistic data mutation](https://react-query-v3.tanstack.com/guides/optimistic-updates),
since most relevant data is usually mirrored on the client side.


### Middleware for Auth

To further safeguard the system, I have implemented a middleware layer 
that verifies the existence of a valid session. 
If a valid session is not detected, the user will be redirected to the `/login` page. 
While this may not be necessary, I decided to implement it as an additional precaution.
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

The latest version of Next.js offers a promising vision of the future of web applications. 
It appears to be a good choice for developers looking to create scalable web apps 
that can be easily hosted on-premises or in a stateless edge environment. 
I was impressed by how quickly I was able to set up the basic structure of a web app using Next.js. 

While it remains to be seen how easy it will be to 
make a server-side rendering web app as responsive as a client-side rendering one, 
I have confidence that a lot of brilliant developers will work towards this goal in the near future.

