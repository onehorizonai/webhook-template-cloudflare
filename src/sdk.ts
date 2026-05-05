import { Configuration, TasksApi } from '@onehorizon/sdk-js'
import type { OneHorizonWebhookEvent } from './types.js'

export function createOneHorizonTasksClient(apiKey?: string): TasksApi | undefined {
  if (!apiKey) {
    return undefined
  }

  return new TasksApi(new Configuration({ accessToken: apiKey }))
}

export async function fetchRelatedTask(event: OneHorizonWebhookEvent, apiKey?: string) {
  const taskId = event.resource?.task_id || (event.resource?.type === 'task' ? event.resource.id : undefined)
  const tasks = createOneHorizonTasksClient(apiKey)

  if (!tasks || !taskId) {
    return undefined
  }

  return tasks.fetchTask({
    workspaceId: 'current',
    taskId
  })
}
