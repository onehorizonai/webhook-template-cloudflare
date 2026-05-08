import { Configuration, DocumentsApi } from '@onehorizon/sdk-js'
import type { WebhookEvent } from '@onehorizon/sdk-js'

export function createOneHorizonDocumentsClient(apiKey?: string): DocumentsApi | undefined {
  if (!apiKey) {
    return undefined
  }

  return new DocumentsApi(new Configuration({ accessToken: apiKey }))
}

export async function fetchFirstAttachedDocument(event: WebhookEvent, apiKey?: string) {
  const resource = event.data.resource
  const taskId = resource.taskId || (resource.type === 'task' ? resource.id || resource.taskIds?.[0] : undefined)
  const documents = createOneHorizonDocumentsClient(apiKey)

  if (!documents || !taskId) {
    return undefined
  }

  const response = await documents.listDocuments({
    workspaceId: 'current',
    taskId,
    includeContent: true,
    limit: 1
  })

  return response.documents?.[0]
}
