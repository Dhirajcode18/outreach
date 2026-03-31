import http from 'node:http'
import { dashboardApi } from './data.js'

const port = Number(process.env.PORT || 4000)

const routeMap = {
  '/api/dashboard': () => dashboardApi.dashboard,
  '/api/campaigns': () => dashboardApi.campaigns,
  '/api/leads': () => dashboardApi.leads,
  '/api/inbox': () => dashboardApi.inbox,
  '/api/approvals': () => dashboardApi.approvals,
  '/api/prospecting': () => dashboardApi.prospecting,
  '/api/visitors': () => dashboardApi.visitors,
  '/api/analytics': () => dashboardApi.analytics,
  '/api/assets': () => dashboardApi.assets,
  '/api/settings': () => dashboardApi.settings,
  '/api/health': () => ({ ok: true, service: 'outreach-dashboard-api' }),
}

function writeJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  })

  response.end(JSON.stringify(payload))
}

const server = http.createServer((request, response) => {
  if (!request.url) {
    writeJson(response, 400, { error: 'Bad request' })
    return
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    response.end()
    return
  }

  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)
  const handler = routeMap[url.pathname]

  if (request.method !== 'GET') {
    writeJson(response, 405, { error: 'Method not allowed' })
    return
  }

  if (!handler) {
    writeJson(response, 404, {
      error: 'Not found',
      availableRoutes: Object.keys(routeMap),
    })
    return
  }

  writeJson(response, 200, {
    generatedAt: new Date().toISOString(),
    data: handler(),
  })
})

server.listen(port, () => {
  console.log(`Outreach dashboard API running on http://localhost:${port}`)
})

