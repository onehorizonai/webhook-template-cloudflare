# One Horizon webhook template for Cloudflare Workers

Use this repo if you want a One Horizon webhook receiver on Cloudflare Workers. No Vercel, Netlify, or Heroku files.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/onehorizonai/webhook-template-cloudflare)

## Included

- Worker at `src/worker.ts`
- `/webhook` endpoint
- webhook key checks
- JSON validation with a 256 KB limit
- retry-safe event ID handling
- Sample payloads
- optional SDK helper in `src/sdk.ts`
- `wrangler.jsonc`

## Run locally

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

## Configure One Horizon

1. Add your deployed `/webhook` URL in **Settings -> Apps**.
2. Set `ONE_WEBHOOK_KEY` as a Cloudflare secret.
3. Choose events.
4. Click **Verify**.

```bash
npx wrangler secret put ONE_WEBHOOK_KEY
npx wrangler secret put ONE_API_KEY
```

`ONE_API_KEY` is optional. Add it only if you use the SDK helper.

## Before production

- Keep `ONE_WEBHOOK_KEY` secret.
- Return `2xx` quickly.
- Store event IDs in KV, D1, Durable Objects, or another durable store before doing side effects.
- Queue slow work. One Horizon delivery requests time out after 3 seconds.

## Checks

```bash
yarn typecheck
yarn test
yarn build
yarn deploy --dry-run
```
