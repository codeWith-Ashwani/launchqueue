import { getCampaignStats, getDiscovery, getMonitoring } from './resources'

// Compile-only regression checks: these failures must stay failures as the API evolves.
export async function checkContract() {
  const stats = await getCampaignStats('campaign', { page: 1, limit: 50 })
  const total: number = stats.data.totalSignups
  const pages: number = stats.data.pagination.totalPages
  const rank: number | null = stats.data.signups[0].currentPosition
  // @ts-expect-error Public leaderboard has a closed period enum.
  getDiscovery({ period: 'month' }, {})
  // @ts-expect-error Unknown query parameters must not be accepted.
  getCampaignStats('campaign', { offset: 1 })
  // @ts-expect-error Stats must not expose a private founder password.
  stats.data.password
  const monitoring = await getMonitoring(24, {})
  const status: 'warming' | 'met' | 'breached' = monitoring.data.series[0].status
  return { total, pages, rank, status }
}
