# study
Source file tree for study.ibaguette.com.

# Frontend
The frontend will be built with Next.js, a React framework - for the most part. The site will be static, with dynamic components (account sign-in, resource upload, search) handled by Cloudflare Workers.

It will be static so there is no need for a complex backend, and the site can be served from an edge cdn. Also has the side effect of (hopefully) being faster and thus more pleasing to use.




# Backend

## Components
- Dynamic components e.g. sign into account to upload resources integrates with the iBaguette accounts database. 
- Cloudflare Workers handle input/user queries etc. - e.g. search DB, upload and stores assets with the following:
    - Database: SQLite on the edge with Cloudflare D1: https://developers.cloudflare.com/d1/platform/pricing/. This will be used to store info about a) the resources uploaded and b) the accounts database.
    - Storage: R2 bucket for assets and data blobs (pdfs, images...)
- Site is built every commit with Cloudflare Pages.

## Schemas
All schemas (including users, json payloads, and more) are in the [schemas.md](./schemas.md) file. Edit that file to update the specifications for the site.

## Building and editing
An automated build process is used to build the backend worker. HOWEVER, to build manually, the command is `npx wrangler build` from directory `src/backend`, if you want to build it manually, with outputs going into the `dist` subdir. 

On every commit, the worker is automatically built with `npx wrangler deploy` on the Cloudflare Workers platform; the status of the build can be seen in the runs next to each commit.

To run locally in development mode, use `npx wrangler dev --env dev` from the `src/backend` directory. This will start a local server on `http://127.0.0.1:8787`. It'll auto reload on changes and display logs in the console.

## Testing

### Database

You can run: 
```sh
npx wrangler d1 execute resources-db-test --local --file=./database/study-schema.sql
```
to create/update the database using the schema in `database/study-schema.sql`. 

> ℹ️ To execute on remote, you can use `npx wrangler d1 execute resources-db-test --remote --file=./database/study-schema.sql` instead.

> ⚠️⚠️⚠️ Do not run this on `resources-db` as this is the production database.

