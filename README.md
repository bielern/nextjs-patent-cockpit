# Patent Cockpit Demo App with Next.js 13

## Setup

### Database

Create a postgresql database with

```bash
createdb pc
```

### Environment Variables

Create a file `.env`. Use the following as a starting point

```
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings
DATABASE_URL="postgresql://<username>@localhost:5432/pc?schema=public"
COOKIE_PASSWORD="long_password_at_least_32_characters_long"
```

## Running the web app locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Prisma

Run/Generate migration with

```bash
npx prisma migrate dev --name init
```

Seed the database with

```bash
npx prisma db seed
```

### Client

Install the client with

```
npm install @prisma/client
```

and generate the client (I think after each migration) with 

```
npx prisma generate
```


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Notes

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
