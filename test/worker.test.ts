import { describe, expect, it } from 'vitest'
import worker from '../src/worker.js'

const payload = {
  id: 'evt_worker_1',
  type: 'task.created',
  schema: 'one.webhook.event.v1',
  workspace_id: 'w_123',
  created_at: '2026-05-05T12:00:00Z',
  resource: { type: 'task', id: 'tsk_123', workspace_id: 'w_123' },
  actor: { type: 'user', id: 'usr_123' },
  data: {}
}

describe('Cloudflare Worker adapter', () => {
  it('serves the webhook path', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/webhook', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-one-webhook-key': 'secret',
          'x-one-event-id': 'evt_worker_post'
        },
        body: JSON.stringify(payload)
      }),
      { ONE_WEBHOOK_KEY: 'secret' }
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      id: 'evt_worker_post',
      type: 'task.created'
    })
  })

  it('supports verification checks', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/webhook', {
        method: 'HEAD',
        headers: { 'x-one-webhook-key': 'secret' }
      }),
      { ONE_WEBHOOK_KEY: 'secret' }
    )

    expect(response.status).toBe(204)
  })

  it('rejects other paths', async () => {
    const response = await worker.fetch(new Request('https://example.com/'), {})

    expect(response.status).toBe(404)
  })
})
