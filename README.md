# One Horizon Webhook Template for Cloudflare Workers

A minimal TypeScript webhook receiver for One Horizon apps on Cloudflare Workers.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/onehorizonai/webhook-template-cloudflare)

## What You Get

- Worker at `src/worker.ts`
- `/webhook` endpoint
- Webhook key verification
- JSON validation and 256 KB body limit
- Retry-safe event ID handling
- Sample payloads
- Optional SDK helper in `src/sdk.ts`
- `wrangler.jsonc`

## Run Locally

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

`ONE_API_KEY` is optional. Use it only for SDK follow-up calls.

## Production Notes

- Keep `ONE_WEBHOOK_KEY` secret.
- Return `2xx` quickly.
- Store processed event IDs in KV, D1, Durable Objects, or another durable store before doing side effects.
- Queue slow work. One Horizon delivery requests time out after 3 seconds.

## Checks

```bash
yarn typecheck
yarn test
yarn build
yarn deploy --dry-run
```
