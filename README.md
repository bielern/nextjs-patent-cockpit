# Patent Cockpit Demo App with Next.js 13

Find a quick overview in the [NOTES.md](NOTES.md).

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

### Web App

Install the dependencies of the web app with
```
npm install
```

## Running the web app locally

First, run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## [Prisma](prisma.io)

To seed the database run
```
npx prisma db seed
```

To run/generate a migration with

```
npx prisma migrate dev --name <migration_name>
```

After the migration, update the client with

```
npx prisma generate
```


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.


## Notes

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## License

The favicon and the name "Patent Cockpit" belong to [Artemis IPM GmbH](https://artemis-ipm.com).
