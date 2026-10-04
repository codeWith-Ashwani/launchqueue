import api from './axios'
import type { AxiosRequestConfig } from 'axios'
import type { paths } from './generated/schema'

type Stats = paths['/api/waitlists/{id}/stats']['get']
type StatsQuery = NonNullable<Stats['parameters']['query']>
type StatsResponse = Stats['responses'][200]['content']['application/json']
type Discovery = paths['/api/discover/leaderboard']['get']
type DiscoveryQuery = NonNullable<Discovery['parameters']['query']>
type DiscoveryResponse = Discovery['responses'][200]['content']['application/json']
type OverviewResponse = paths['/api/auth/overview']['get']['responses'][200]['content']['application/json']
type FunnelResponse = paths['/api/waitlists/{id}/funnel']['get']['responses'][200]['content']['application/json']
export type MonitoringResponse = paths['/api/admin/monitoring']['get']['responses'][200]['content']['application/json']
export type TracesResponse = paths['/api/admin/traces']['get']['responses'][200]['content']['application/json']
export type TraceResponse = paths['/api/admin/traces/{traceId}']['get']['responses'][200]['content']['application/json']
type ReadOptions = Pick<AxiosRequestConfig, 'signal'>

export const getCampaignStats = (id: string, params: StatsQuery) => api.get<StatsResponse>(`/waitlists/${id}/stats`, { params })
export const getCampaignFunnel = (id: string) => api.get<FunnelResponse>(`/waitlists/${id}/funnel`)
export const getFounderOverview = (options: ReadOptions) => api.get<OverviewResponse>('/auth/overview', options)
export const getDiscovery = (params: DiscoveryQuery, options: ReadOptions) => api.get<DiscoveryResponse>('/discover/leaderboard', { params, ...options })
export const getMonitoring = (hours: number, options: ReadOptions) => api.get<MonitoringResponse>('/admin/monitoring', { params: { hours }, ...options })
export const getTraces = (hours: number, options: ReadOptions) => api.get<TracesResponse>('/admin/traces', { params: { hours }, ...options })
export const getTrace = (traceId: string, options: ReadOptions) => api.get<TraceResponse>(`/admin/traces/${traceId}`, options)
