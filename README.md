# One Horizon webhooks on Cloudflare Workers

Clone this when your One Horizon app needs a webhook endpoint on Cloudflare Workers. It is only the Workers version: one Worker, one shared handler, no Node server or serverless provider config.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/onehorizonai/webhook-template-cloudflare)

## What is inside

- `src/worker.ts`: the Cloudflare Worker
- `src/webhook.ts`: key check, JSON parsing, event validation, idempotency hook
- `wrangler.jsonc`: local dev and deploy config
- `sample-payloads/`: example One Horizon events
- `src/sdk.ts`: optional follow-up API calls

The endpoint accepts `HEAD`, `GET`, and JSON `POST` requests at `/webhook`.

## Run it locally

```bash
yarn install
cp .dev.vars.example .dev.vars
yarn dev
```

```bash
curl http://localhost:8787/webhook \
  -X POST \
  -H "content-type: application/json" \
  -H "x-one-webhook-key: paste-one-horizon-webhook-key-here" \
  -H "x-one-event-id: evt_task_created" \
  -H "x-one-event-type: task.created" \
  --data @sample-payloads/task-created.json
```

## Connect One Horizon

1. Deploy this repo to Cloudflare.
2. Add `ONE_WEBHOOK_KEY` as a Worker secret.
3. In One Horizon, open **Settings -> Apps**.
4. Add the deployed `/webhook` URL.
5. Pick events and click **Verify**.

```bash
npx wrangler secret put ONE_WEBHOOK_KEY
npx wrangler secret put ONE_API_KEY
```

`ONE_API_KEY` is optional. Add it only if you use the SDK helper.

## Before you ship

The in-memory event store is for the template. Replace it with KV, D1, Durable Objects, or another durable store before doing side effects. Keep the response fast; One Horizon waits 3 seconds before timing out.

## Checks

```bash
yarn typecheck
yarn test
yarn build
yarn deploy --dry-run
```
