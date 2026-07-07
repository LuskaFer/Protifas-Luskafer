import { api } from '@/shared/services/http'

interface RawEndpoint {
  method: string
  path: string
  summary: string
}

interface RawEndpointGroup {
  controller: string
  basePath: string
  endpoints: RawEndpoint[]
}

interface RawBlockedEndpoint {
  id: number
  httpMethod: string
  pathPattern: string
  description: string | null
  createdAt: string
}

export interface SystemConfiguration {
  id: string
  title: string
  method: string
  path: string
  enabled: boolean
  controller: string
}

export function fetchEndpointsData(): Promise<SystemConfiguration[]> {
  return Promise.all([
    api.get<RawEndpointGroup[]>('/api/admin/endpoints'),
    api.get<RawBlockedEndpoint[]>('/api/admin/endpoints/blocked'),
  ]).then(([endpointsResponse, blockedResponse]) => {
    const endpointsData = endpointsResponse.data
    const blockedData = blockedResponse.data

    const blockedSet = new Set(blockedData.map(b => `${b.httpMethod}-${b.pathPattern}`))
    const blockedMap = new Map(blockedData.map(b => [`${b.httpMethod}-${b.pathPattern}`, b.id]))

    const loadedConfigurations: SystemConfiguration[] = []

    endpointsData.forEach(group => {
      group.endpoints.forEach(endpoint => {
        const uniqueIdentifier = `${endpoint.method}-${endpoint.path}`
        const isBlocked = blockedSet.has(uniqueIdentifier)
        const dbId = blockedMap.get(uniqueIdentifier)

        loadedConfigurations.push({
          id: isBlocked && dbId ? String(dbId) : uniqueIdentifier,
          title: endpoint.summary || `${endpoint.method} ${endpoint.path}`,
          method: endpoint.method,
          path: endpoint.path,
          enabled: !isBlocked,
          controller: group.controller,
        })
      })
    })

    return loadedConfigurations
  })
}

export function saveEndpointChanges(configsToUpdate: SystemConfiguration[]): Promise<void> {
  const promises = configsToUpdate.map(config => {
    if (config.enabled) {
      if (!Number.isNaN(Number(config.id))) {
        return api.delete(`/api/admin/endpoints/blocked/${config.id}`)
      }
      return Promise.resolve()
    }
    if (Number.isNaN(Number(config.id))) {
      return api.post('/api/admin/endpoints/blocked', {
        httpMethod: config.method,
        pathPattern: config.path,
        description: config.title,
      })
    }
    return Promise.resolve()
  })

  return Promise.all(promises).then(() => {})
}
