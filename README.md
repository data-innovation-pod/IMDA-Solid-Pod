# App Overview:

- **Framework**: Built on Next.js, which handles both frontend display and acts as an
  API server for backend functionality.
- **Database**: PostgreSQL is used for audit trail purposes and is set up to run in a
  Docker container.
- **Solid Compliance**: App adheres to Solid standards, working with a Community
  Solid Server to store data in Solid pods.

##### Software Requirements:

- **Dependency Installation**: Run ‘npm ci’ to install dependencies.
- **Database**: Install Docker Desktop to run the PostgreSQL database.

##### Starting the App:

1. **Community Solid Server**:

- Ensure there's an instance of the Community Solid Server running.

2. **Docker Desktop**:

- Ensure Docker Desktop running, run `docker-compose -f docker-compose.dev.yml up -d` to setup DB in
  docker.
- There is another _docker-compose.prod.yml_ to set up both the app and database in containers. Run `docker-compose -f docker-compose.prod.yml up -d`. However this means need to stop and rerun the containers whenever there are changes to the app code base.
- Probably should stop whatever containers are running for either dev or prod before running `docker-compose`. To see running containers -> `docker ps -a`. To stop container -> `docker stop [container name]`. To remove container -> `docker remove [container name]`.

3. **Run App**:

- Use `npm run dev` to start the application.

### Environment Variables Setup:

1. **.env Files**
   A typical _.env_ file is used for storing project-specific environment variables.

2. **@t3-oss/env-nextjs**
   However _.env_ variables are imported into _env.mjs_ which uses `@t3-oss/env-nextjs` to enhance the management of environment variables by providing a structured approach using TypeScript and Zod for validation.
   So wherever applicable and possible, use `import { env } from "~/env.mjs"` rather than `process.env`
   Was not able to use `import { env } from "~/env.mjs"` in _knexfile.ts_. Faced ESM and CommonJS syntax compatibility issues.

### PostgreSQL Setup w Docker:

##### Files for setting up PostgreSQL DB:

1. **Docker Compose File (docker-compose.yml):**

- Defines the Docker services, including the PostgreSQL service.
- Specifies environment variables, ports, volumes, etc.

2. **Initialization SQL Script (init.sql):**

- Contains SQL statements to initialize the PostgreSQL database when the container starts.
- Typically includes creating users, databases, setting up initial schemas, etc.

##### Files used after PostgreSQL DB setup:

1. Knex Config File (knexfile.ts):

- Contains configurations for connecting to the PostgreSQL database using Knex.

2. Knex Migration Files (/migrations):

- Typically would use `npx knex migrate:make <migration_name>` to create empty migration files. doing so wld prepend time stamps to the file
- Contain scripts to create and manage database tables using Knex migrations.
- the migrations are run everytime we run `npm run dev` (see _package.json_)

##### Starting up PostgreSQL Docker Container

1. Run `docker-compose up -d` in the directory containing _docker-compose.yml_ the first time
2. Docker containers will typically resume when sytem reboots on computer shutdown and startup. So only need to run the command above once.
3. Will not affect the already running container even if run the command again.

### Frontend/Backend Architecture Overview

##### Server Side Code

1. **Entry Point**

- tRPC server functionality set up in _src/server/api/trpc.ts_ and integrated with Next.js server
  - tRPC server initialised with context
  - 2 critical exports are `createTRPCRouter()` (for route creating as the name suggests) and `publicProcedure` (a type of API endpoint in tRPC parlance)

2. **tRPC Route Setting**

   _Primary Route_

- routes are centralised in _src/server/api/root.ts_ so this can be understood as the ‘primary router'

  - individual routes are created in a separate location \*src/server/api/routers/\*\* and imported here
  - primary router set-up using `createTRPCRouter()` that was created from initialising tRPC

  _Spotify Route_

- individual routes are also set-up using `createTRPCRouter()`
- this route solely interacts with Spotify API to get Spotify data

  _Audit & User Connected Services Routes_

- similarly, these are also set-up using `createTRPCRouter()`
- the only difference are these routes are for interacting with PostgreSQL, so there’s an additional knex import

3. **Next.js Route Setting**

- all tRPC routes are routed through _src/app/api/trpc/[trpc]/route.ts_ for customised error handing

##### Client Side Code

1. **Setting up Clients**

- there are a total of 3 clients set up in \*src/trpc/\*\* to be used in different scenarios
  - _client.ts_ -> for usual tRPC requests
  - _react.tsx_ -> for using tRPC in React components. this exports `TRPCReactProvider()` which is used to wrap around all child components in `RootLayout()`
  - _server.ts_ -> setup for including custom headers in tRPC requests. not used.

##### Working w Solid Pods

- _@inrupt/solid-client_ provides methods to work with solid data pods, so there is no need to set up any backend code

### App Refresh due CSS/Spotify Authorisation & State Management:

Although built as a react app, the app will refresh quite a bit as authorisation process requires redirects to authorisation pages before being re-routed back to app.
_solid-client-authn-browser API_ allows for app to hold onto session on refresh. But that involves another round of 'silent' redirection to CSS for authorization before coming back to the app.
This requires some management of routing and state management so the correct app page is displayed, and required states are not lost on app refresh.

1. **src/app/\_utils/auth.ts**

- By default, the app will be display _/your-data_ page on login. However if user logged in from a page other than the login page, app will be redirected to display that page on successful login.

2. **src/app/\_context/store.tsx**

- The store contains a gobal context that is wrapped around all children in the root layout. This is where `handleIncomingRedirect()` takes place to complete the login process.
- Other than setting state, relevant data are stored in local/session storage so they are not lost on app refresh.
- Store listens out for _sessionRestore_ event in order to redirect app to the correct page on restore.
- If user attempts to key in app url without logging in, store will also commence login process (which will redirect user to CSS authorisation before coming back to app) and on redirect to app, open page to the one user was attempting to key in.
- If app refresh was due to Spotify authorisation flow, store will redirect to the correct spotify callback page when redirected back to app.

### Spotify Data Ingestion:

##### Authorisation Flow:

1. app uses the [Authorization Code with PKCE Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow) for authorisation with Spotify
2. when used together with CSS authorisation flow, the process looks like this:

_Nil Access Token_

- redirects to spotify auth page -> user authorises spotify usage -> spotify redirects to app with auth code in the url -> store spotify auth code -> app silently authenticates to maintain session i.e. refreshes one more time -> after 2nd refresh, redirect to _/callback/spotify_ -> exchange spotify auth code for token -> start process of fetching spotify data and writing to solid pod

_Access Token Avail_

- redirect to _/callback/spotify_ to start process of fetching spotify data and writing to solid pod

##### Code Location:

1. Start process of ingesting Spotify data
   `spotify-modal.tsx: handleImportClick()`
2. Store Spotify auth code and redirect to _/callback/spotify_
   `store.tsx: completeLogin()`
3. Exchange Spotify auth code for token + get Spotify data + write to Solid pod
   `src/app/callback/spotify/page.tsx`
