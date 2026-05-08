import { handleWebhookRequest, type WebhookEnv } from './webhook.js'

interface CloudflareEnv extends WebhookEnv {
  ONE_WEBHOOK_KEY?: string
  ONE_API_KEY?: string
}

export default {
  async fetch(request: Request, env: CloudflareEnv): Promise<Response> {
    const path = new URL(request.url).pathname
    if (path !== '/webhook') {
      return Response.json({ error: 'not found' }, { status: 404 })
    }

    return handleWebhookRequest(request, { env })
  }
}
