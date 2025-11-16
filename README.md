# GitHub App Template

Build a minimal GitHub App that responds to webhooks and is easy to run locally.

## Step 1: Create Proxy Webhook Channel 🌐
> GitHub can't send webhook events to a server on localhost, so we'll use a proxy that forwards events to your local server.

- Visit [smee.io](https://smee.io/)
- Create a channel
- Copy the proxy URL

## Step 2: Create a GitHub App ⚙️
- In GitHub, go to Settings → Developer settings → GitHub Apps → New GitHub App
- Name it
- Set any homepage URL
- Set the webhook URL to your Smee channel URL
- Generate a random string (UUID is fine) and set it as the webhook secret
- Set minimal permissions - Issues (Read & write) and subscribe to the Issues event
- Generate and download the private key

## Step 3: Run Local Server 🖥️
- Clone the repo
- Install Node.js - [guide](https://nodejs.org/en/download)
- Install pnpm - [guide](https://pnpm.io/9.x/installation)
- Install dependencies
  ```bash
  pnpm install
  ```
- Copy the private key file into the repo (it's gitignored)
- Create a `.env` file with the following:
  ```bash
  GITHUB_APP_IDENTIFIER=<from GitHub UI>
  PRIVATE_KEY_FILE=./path/to/your.private-key.pem
  GITHUB_WEBHOOK_SECRET=your-webhook-secret
  WEBHOOK_PROXY_URL=https://smee.io/your-channel
  ```
- Start webhook proxy in one terminal
  ```bash
  pnpm start:proxy
  ```
- Start dev server in another
  ```bash
  pnpm start
  ```

## Step 4: Add App to a Repository 🧪
- Visit your GitHub App at Settings → Developer settings → GitHub Apps → <YOUR APP NAME> → Configure
- Under "Repository access", select a repo to test on
- Create a new issue in that repo
- Your bot should leave a comment shortly

## How to Deploy 🚀
When deploying, you don't need the Smee.io channel or the `WEBHOOK_PROXY_URL`.

Deploy to your platform of choice (e.g., AWS Lambda) and provide the same environment variables. Be sure to include the private key.

Set the GitHub webhook URL to the public URL of your deployed server.

## Tooling 🧰
- TypeScript
- Node.js
- PNPM (package manager)
- Biome.js (formatter & linter)
- GitHub Actions (PR checks)
- Winston (logging)
- Envalid (.env parsing)