import { Configuration, TasksApi } from '@onehorizon/sdk-js'
import type { WebhookEvent } from '@onehorizon/sdk-js'

export function createOneHorizonTasksClient(apiKey?: string): TasksApi | undefined {
  if (!apiKey) {
    return undefined
  }

  return new TasksApi(new Configuration({ accessToken: apiKey }))
}

export async function fetchRelatedTask(event: WebhookEvent, apiKey?: string) {
  const resource = event.data.resource
  const taskId = resource.taskId || (resource.type === 'task' ? resource.id || resource.taskIds?.[0] : undefined)
  const tasks = createOneHorizonTasksClient(apiKey)

  if (!tasks || !taskId) {
    return undefined
  }

  return tasks.fetchTask({
    workspaceId: 'current',
    taskId
  })
}
