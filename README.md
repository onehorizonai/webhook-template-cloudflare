# One Horizon webhooks on Cloudflare Workers

Cloudflare Workers version of the One Horizon webhook starter. Worker entrypoint, Wrangler config, no Node server files.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/onehorizonai/webhook-template-cloudflare)

## Files to look at

- `src/worker.ts`: the Cloudflare Worker
- `src/webhook.ts`: key check, CloudEvents JSON parsing, event validation, idempotency
- `wrangler.jsonc`: local dev and deploy config
- `sample-payloads/`: example One Horizon events
- `src/sdk.ts`: optional API calls after receiving an event

The Worker accepts `HEAD`, `GET`, and CloudEvents JSON `POST` at `/webhook`.

## One Horizon links

- [One Horizon](https://onehorizon.ai)
- [Webhook docs](https://onehorizon.ai/docs/integrations/webhooks)
- [REST API docs](https://onehorizon.ai/docs/reference)
- [JavaScript SDK](https://www.npmjs.com/package/@onehorizon/sdk-js)

```bash
npm i @onehorizon/sdk-js
```

Webhook event and payload types come from `@onehorizon/sdk-js`. `src/types.ts`
only keeps local adapter types for headers, logging, and responses.

## Run it locally

Use Node 24. The repo includes `.nvmrc` and `.node-version`.

```bash
yarn install
cp .dev.vars.example .dev.vars
yarn dev
```

```bash
curl http://localhost:8787/webhook \
  -X POST \
  -H "content-type: application/cloudevents+json; charset=utf-8" \
  -H "x-one-webhook-key: paste-one-horizon-webhook-key-here" \
  -H "x-one-event-id: evt_task_created" \
  -H "x-one-event-type: task.created" \
  --data @sample-payloads/task-created.json
```

## Connect it to One Horizon

1. Deploy this repo to Cloudflare.
2. Set `ONE_WEBHOOK_KEY` as a Worker secret.
3. In One Horizon, open **Settings -> Apps**.
4. Add the deployed `/webhook` URL.
5. Pick the events you want.
6. Click **Verify**.

```bash
npx wrangler secret put ONE_WEBHOOK_KEY
```

`ONE_API_KEY` is not needed for deployment. Add it later only if you call the One Horizon SDK from your handler:

```bash
npx wrangler secret put ONE_API_KEY
```

## Replace before real use

The event store is just memory. Before this does anything real, save processed event IDs in KV, D1, Durable Objects, or another durable store. Keep the handler quick; One Horizon times out after 3 seconds.

## Checks

```bash
yarn typecheck
yarn test
yarn build
yarn deploy --dry-run
```
