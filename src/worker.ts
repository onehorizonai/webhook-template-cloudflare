import { handleWebhookRequest, jsonResponse, toFetchResponse, type WebhookEnv } from './webhook.js'

interface CloudflareEnv extends WebhookEnv {
  ONE_WEBHOOK_KEY?: string
  ONE_API_KEY?: string
}

export default {
  async fetch(request: Request, env: CloudflareEnv): Promise<Response> {
    const path = new URL(request.url).pathname
    if (path !== '/webhook') {
      return toFetchResponse(jsonResponse(404, { error: 'not found' }), request.method)
    }

    return handleWebhookRequest(request, { env })
  }
}
