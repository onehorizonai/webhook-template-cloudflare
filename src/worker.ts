import { jsonResponse } from './http.js'
import { handleWebhook, type WebhookEnv } from './webhook.js'
import type { WebhookResponse } from './types.js'

interface CloudflareEnv extends WebhookEnv {
  ONE_WEBHOOK_KEY?: string
  ONE_API_KEY?: string
}

export default {
  async fetch(request: Request, env: CloudflareEnv): Promise<Response> {
    const path = new URL(request.url).pathname
    if (path !== '/webhook') {
      return toResponse(jsonResponse(404, { error: 'not found' }), request.method)
    }

    const result = await handleWebhook({
      method: request.method,
      headers: request.headers,
      rawBody: request.method.toUpperCase() === 'POST' ? await request.arrayBuffer() : undefined,
      env
    })

    return toResponse(result, request.method)
  }
}

function toResponse(result: WebhookResponse, method: string): Response {
  const body = method.toUpperCase() === 'HEAD' || result.body === undefined ? null : JSON.stringify(result.body)
  return new Response(body, {
    status: result.status,
    headers: result.headers
  })
}
