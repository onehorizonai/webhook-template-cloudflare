import { describe, expect, it } from 'vitest'
import { WebhookEventToJSON } from '@onehorizon/sdk-js'
import type { WebhookEvent } from '@onehorizon/sdk-js'
import worker from '../src/worker.js'

const payload = WebhookEventToJSON({
  specversion: '1.0',
  id: 'evt_worker_1',
  type: 'task.created',
  source: 'onehorizon/workspaces/w_123',
  time: new Date('2026-05-05T12:00:00Z'),
  datacontenttype: 'application/json',
  subject: 'tsk_123',
  workspaceid: 'w_123',
  data: {
    resource: { type: 'task', id: 'tsk_123', workspaceId: 'w_123' },
    actor: { type: 'user', id: 'usr_123' },
    task: {
      task: {
        taskId: 'tsk_123',
        workspaceId: 'w_123',
        title: 'Review launch checklist',
        status: 'planned',
        visibility: 'team'
      }
    }
  }
} satisfies WebhookEvent)

describe('Cloudflare Worker adapter', () => {
  it('serves the webhook path', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/webhook', {
        method: 'POST',
        headers: {
          'content-type': 'application/cloudevents+json; charset=utf-8',
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

  it('rejects unknown worker paths', async () => {
    const response = await worker.fetch(new Request('https://example.com/missing'), {})

    expect(response.status).toBe(404)
  })
})
