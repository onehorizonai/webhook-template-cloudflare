# One Horizon Webhook Template for Cloudflare Workers

A small TypeScript webhook receiver for One Horizon apps on Cloudflare Workers. It checks the verification key, validates the event, logs the useful IDs, and returns quickly.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/onehorizonai/webhook-template-cloudflare)

## What's included

- `/webhook` endpoint for One Horizon app events
- Cloudflare Worker in `src/worker.ts`
- `X-One-Webhook-Key` verification
- `HEAD` and `GET` support for endpoint checks
- JSON-only `POST` handling with a 256 KB payload limit
- Basic validation for `one.webhook.event.v1`
- A small idempotency hook so retries do not run the same work twice
- Optional SDK helper in `src/sdk.ts`
- `wrangler.jsonc` for local development and deploys

## Local setup

```bash
yarn install
cp .dev.vars.example .dev.vars
yarn dev
```

Send a sample event:

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

1. Open **Settings -> Apps** in One Horizon.
2. Create or open a custom app.
3. Add your deployed `/webhook` URL.
4. Add the verification key to Cloudflare as the `ONE_WEBHOOK_KEY` secret.
5. Choose the events your app should receive.
6. Click **Verify**.

Add production secrets with Wrangler:

```bash
npx wrangler secret put ONE_WEBHOOK_KEY
npx wrangler secret put ONE_API_KEY
```

`ONE_API_KEY` is optional. Skip it unless you call the SDK from your own handler code.

When you do use the SDK helper, pass `env.ONE_API_KEY` from the Worker:

```ts
const task = await fetchRelatedTask(event, env.ONE_API_KEY)
```

## Handler flow

The Worker only adapts the request. The webhook logic lives in `src/webhook.ts`.

1. Check `X-One-Webhook-Key` with a timing-safe comparison.
2. Accept `HEAD` and `GET` verification requests.
3. Require `POST` requests to use `application/json`.
4. Reject payloads larger than 256 KB.
5. Validate the required event fields and schema.
6. Skip duplicate event IDs with the configured event store.
7. Log the event ID, type, resource, actor, and retry headers. Return `200`.

The default event store is memory. That is fine for local testing. In production, use Workers KV, D1, Durable Objects, or another durable store keyed by event ID.

## Checks

```bash
yarn typecheck
yarn test
yarn build
yarn deploy --dry-run
```
