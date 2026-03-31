import { useDeferredValue, useEffect, useState, useTransition } from 'react'
import './App.css'

const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (import.meta.env.DEV ? 'http://localhost:4000' : window.location.origin)

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', section: null, icon: 'dashboard' },
  { key: 'campaigns', label: 'Campaigns', section: 'Engage', icon: 'send' },
  { key: 'leads', label: 'Leads', section: 'Engage', icon: 'users' },
  { key: 'inbox', label: 'Inbox', section: 'Engage', icon: 'inbox' },
  { key: 'approvals', label: 'Approvals', section: 'Engage', icon: 'check' },
  { key: 'prospecting', label: 'Prospecting', section: 'Find & Enrich', icon: 'search' },
  { key: 'visitors', label: 'Website Visitors', section: 'Find & Enrich', icon: 'eye' },
  { key: 'analytics', label: 'Analytics', section: 'Insights', icon: 'chart' },
  { key: 'assets', label: 'Sales Assets', section: 'Assets', icon: 'folder' },
  { key: 'settings', label: 'Email Health', section: 'Configuration', icon: 'shield' },
]

const SECTION_ORDER = [null, 'Engage', 'Find & Enrich', 'Insights', 'Assets', 'Configuration']

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [tabData, setTabData] = useState({})
  const [loadingTab, setLoadingTab] = useState('dashboard')
  const [error, setError] = useState('')
  const [retryToken, setRetryToken] = useState(0)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const controller = new AbortController()

    if (tabData[activeTab]) {
      setLoadingTab('')
      return () => controller.abort()
    }

    async function loadTab() {
      setLoadingTab(activeTab)
      setError('')

      try {
        const response = await fetch(`${API_BASE}/api/${activeTab}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`)
        }

        const payload = await response.json()
        setTabData((current) => ({
          ...current,
          [activeTab]: payload.data,
        }))
      } catch (loadError) {
        if (controller.signal.aborted) {
          return
        }

        setError(
          `Could not load ${getTab(activeTab).label}. Start the backend in /server and make sure ${API_BASE}/api/health is reachable.`,
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoadingTab((current) => (current === activeTab ? '' : current))
        }
      }
    }

    loadTab()
    return () => controller.abort()
  }, [activeTab, retryToken, tabData])

  const currentTab = getTab(activeTab)
  const currentData = tabData[activeTab]
  const busy = loadingTab === activeTab || isPending
  const breadcrumbs = currentData?.breadcrumbs ?? [currentTab.section || 'Workspace', currentTab.label]

  function handleTabChange(nextTab) {
    startTransition(() => {
      setError('')
      setActiveTab(nextTab)
    })
  }

  function retryActiveTab() {
    setTabData((current) => {
      const next = { ...current }
      delete next[activeTab]
      return next
    })
    setRetryToken((value) => value + 1)
  }

  return (
    <div className='app-shell'>
      <aside className='sidebar'>
        <div className='brand'>
          <div className='brand-mark' aria-hidden='true'>
            <span></span>
            <span></span>
          </div>
          <div>
            <strong>OutreachHQ</strong>
            <p>Pipeline cockpit</p>
          </div>
        </div>

        <div className='nav-stack'>
          {SECTION_ORDER.map((section) => {
            const items = NAV_ITEMS.filter((item) => item.section === section)

            if (!items.length) {
              return null
            }

            return (
              <div className='nav-group' key={section || 'home'}>
                {section ? <p className='nav-heading'>{section}</p> : null}
                <div className='nav-items'>
                  {items.map((item) => {
                    const isActive = item.key === activeTab

                    return (
                      <button
                        key={item.key}
                        type='button'
                        className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
                        onClick={() => handleTabChange(item.key)}
                      >
                        <Icon name={item.icon} />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </aside>

      <main className='main-content'>
        <div className='topbar'>
          <div className='breadcrumbs'>
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb}-${index}`} className={index === breadcrumbs.length - 1 ? 'crumb crumb--active' : 'crumb'}>
                {crumb}
              </span>
            ))}
          </div>
          <div className={`sync-chip ${busy ? 'sync-chip--busy' : ''}`}>{busy ? 'Syncing' : 'Live data'}</div>
        </div>

        {currentData?.warning ? (
          <div className='warning-banner'>
            <div className='warning-copy'>
              <Icon name='warning' />
              <p>{currentData.warning.message}</p>
            </div>
            <button
              type='button'
              className='banner-action'
              onClick={() => handleTabChange(currentData.warning.actionTarget)}
            >
              {currentData.warning.actionLabel}
            </button>
          </div>
        ) : null}

        <section className='hero-row'>
          <div className='hero-copy'>
            <p className='eyebrow'>Outreach control center</p>
            <h1>{currentData?.title || currentTab.label}</h1>
            <p>{currentData?.description || 'Manage campaigns, leads, and account health from one place.'}</p>
          </div>

          <div className='action-row'>
            {(currentData?.actions || []).map((action) => (
              <button
                key={action.label}
                type='button'
                className={`action-button action-button--${action.tone}`}
                onClick={() => handleTabChange(action.target)}
              >
                <Icon name={action.icon} />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {error && !currentData ? (
          <section className='panel error-panel'>
            <div>
              <h2>Backend connection needed</h2>
              <p>{error}</p>
            </div>
            <button type='button' className='retry-button' onClick={retryActiveTab}>
              Retry
            </button>
          </section>
        ) : null}

        {!currentData ? (
          <LoadingState />
        ) : (
          <div className='content-stack'>
            <TabContent tab={activeTab} data={currentData} />
          </div>
        )}
      </main>
    </div>
  )
}

function TabContent({ tab, data }) {
  switch (tab) {
    case 'dashboard':
      return <DashboardView data={data} />
    case 'campaigns':
      return <CampaignsView data={data} />
    case 'leads':
      return <LeadsView data={data} />
    case 'inbox':
      return <InboxView data={data} />
    case 'approvals':
      return <ApprovalsView data={data} />
    case 'prospecting':
      return <ProspectingView data={data} />
    case 'visitors':
      return <VisitorsView data={data} />
    case 'analytics':
      return <AnalyticsView data={data} />
    case 'assets':
      return <AssetsView data={data} />
    case 'settings':
      return <SettingsView data={data} />
    default:
      return null
  }
}

function DashboardView({ data }) {
  return (
    <>
      <div className='metric-grid'>
        {data.summary.map((item) => (
          <SummaryCard key={item.label} item={item} />
        ))}
      </div>

      <div className='dashboard-grid'>
        <Surface
          className='chart-panel'
          title={data.chart.title}
          subtitle={data.chart.subtitle}
          headerRight={
            <div className='panel-tag-row'>
              <span className='panel-tag'>{data.chart.metricLabel}</span>
              <span className='panel-tag'>{data.chart.rangeLabel}</span>
            </div>
          }
        >
          <MetricChart points={data.chart.points} />
        </Surface>

        <Surface title='Top Engaged Leads' subtitle='Contacts showing clear buying intent'>
          <div className='list-stack'>
            {data.engagedLeads.map((lead) => (
              <article className='list-card' key={lead.name}>
                <div>
                  <h3>{lead.name}</h3>
                  <p>{lead.company}</p>
                </div>
                <div className='list-card-meta'>
                  <span className='status-pill status-pill--good'>{lead.channel}</span>
                  <strong>{lead.score}</strong>
                </div>
                <p className='list-card-note'>{lead.touch}</p>
              </article>
            ))}
          </div>
        </Surface>
      </div>

      <Surface title='Recent Activity' subtitle='What changed across the workspace this morning'>
        <div className='activity-list'>
          {data.activity.map((item) => (
            <div className='activity-row' key={item.title}>
              <div className='activity-dot'></div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
              <span>{item.when}</span>
            </div>
          ))}
        </div>
      </Surface>
    </>
  )
}

function CampaignsView({ data }) {
  return (
    <>
      <MetricStrip items={data.overview} />

      <div className='detail-grid'>
        <Surface className='wide-panel' title='Active Sequences' subtitle='Performance snapshot by campaign'>
          <div className='table-wrap'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th>Leads</th>
                  <th>Replies</th>
                  <th>Meetings</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {data.campaigns.map((campaign) => (
                  <tr key={campaign.name}>
                    <td>{campaign.name}</td>
                    <td>{campaign.owner}</td>
                    <td>{campaign.channel}</td>
                    <td>
                      <span className={`status-pill status-pill--${getTone(campaign.status)}`}>{campaign.status}</span>
                    </td>
                    <td>{campaign.leads}</td>
                    <td>{campaign.replies}</td>
                    <td>{campaign.meetings}</td>
                    <td>
                      <div className='progress-track'>
                        <span className='progress-fill' style={{ width: `${campaign.progress}%` }}></span>
                      </div>
                      <small>{campaign.progress}%</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>

        <Surface title='What Is Working' subtitle='Quick reads from the latest experiments'>
          <div className='note-stack'>
            {data.experiments.map((experiment) => (
              <article className='note-card' key={experiment.title}>
                <h3>{experiment.title}</h3>
                <p>{experiment.note}</p>
              </article>
            ))}
          </div>
        </Surface>
      </div>
    </>
  )
}

function LeadsView({ data }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const filteredLeads = data.leads.filter((lead) => {
    const term = deferredQuery.trim().toLowerCase()

    if (!term) {
      return true
    }

    return [lead.name, lead.title, lead.company, lead.owner, lead.status]
      .join(' ')
      .toLowerCase()
      .includes(term)
  })

  return (
    <>
      <MetricStrip items={data.overview} />

      <Surface
        title='Lead Explorer'
        subtitle={`${filteredLeads.length} contacts match the current search.`}
        headerRight={
          <input
            className='search-input'
            type='search'
            placeholder='Search people, companies, or owner'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        }
      >
        <div className='lead-grid'>
          {filteredLeads.map((lead) => (
            <article className='lead-card' key={`${lead.name}-${lead.company}`}>
              <div className='lead-card-top'>
                <div>
                  <h3>{lead.name}</h3>
                  <p>
                    {lead.title} at {lead.company}
                  </p>
                </div>
                <div className='lead-score'>{lead.score}</div>
              </div>
              <div className='lead-card-tags'>
                <span className={`status-pill status-pill--${getTone(lead.status)}`}>{lead.status}</span>
                <span className='status-pill status-pill--neutral'>{lead.owner}</span>
              </div>
              <p className='lead-touch'>{lead.lastTouch}</p>
            </article>
          ))}
        </div>
      </Surface>
    </>
  )
}

function InboxView({ data }) {
  const [selectedThreadName, setSelectedThreadName] = useState(data.threads[0]?.name ?? '')
  const selectedThread = data.threads.find((thread) => thread.name === selectedThreadName) ?? data.threads[0]

  return (
    <>
      <MetricStrip items={data.stats} compact />

      <div className='inbox-grid'>
        <Surface title='Reply Queue' subtitle='Newest conversations first'>
          <div className='thread-list'>
            {data.threads.map((thread) => (
              <button
                key={thread.name}
                type='button'
                className={`thread-card ${selectedThread?.name === thread.name ? 'thread-card--active' : ''}`}
                onClick={() => setSelectedThreadName(thread.name)}
              >
                <div className='thread-card-top'>
                  <strong>{thread.name}</strong>
                  <span>{thread.time}</span>
                </div>
                <p>{thread.company}</p>
                <small>{thread.preview}</small>
              </button>
            ))}
          </div>
        </Surface>

        <Surface
          title={selectedThread?.subject || 'Conversation'}
          subtitle={selectedThread ? `${selectedThread.name} from ${selectedThread.company}` : 'No thread selected'}
        >
          <div className='message-stack'>
            {(selectedThread?.messages || []).map((message, index) => {
              const isSelf = message.role !== 'Lead'

              return (
                <article key={`${message.from}-${index}`} className={`message-bubble ${isSelf ? 'message-bubble--self' : ''}`}>
                  <div className='message-meta'>
                    <strong>{message.from}</strong>
                    <span>
                      {message.role} . {message.time}
                    </span>
                  </div>
                  <p>{message.body}</p>
                </article>
              )
            })}
          </div>
        </Surface>

        <Surface title='Saved Replies' subtitle='High-usage snippets for the team'>
          <div className='note-stack'>
            {data.templates.map((template) => (
              <article className='note-card' key={template.name}>
                <h3>{template.name}</h3>
                <p>{template.note}</p>
              </article>
            ))}
          </div>
        </Surface>
      </div>
    </>
  )
}

function ApprovalsView({ data }) {
  return (
    <div className='detail-grid'>
      <Surface className='wide-panel' title='Pending Review' subtitle='Messages waiting for a human check'>
        <div className='approval-list'>
          {data.queue.map((item) => (
            <article className='approval-card' key={`${item.lead}-${item.campaign}`}>
              <div>
                <h3>{item.lead}</h3>
                <p>{item.campaign}</p>
              </div>
              <p>{item.reason}</p>
              <div className='approval-meta'>
                <span className='status-pill status-pill--warn'>{item.due}</span>
                <span>{item.owner}</span>
              </div>
            </article>
          ))}
        </div>
      </Surface>

      <Surface title='Review Notes' subtitle='Recent approval workflow updates'>
        <div className='note-stack'>
          {data.history.map((item) => (
            <article className='note-card' key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </Surface>
    </div>
  )
}

function ProspectingView({ data }) {
  return (
    <>
      <div className='metric-grid metric-grid--compact'>
        {data.watchlists.map((item) => (
          <article className='metric-card metric-card--compact' key={item.name}>
            <p className='metric-label'>{item.name}</p>
            <strong className='metric-value'>{item.accounts}</strong>
            <span className='metric-helper'>{item.change}</span>
          </article>
        ))}
      </div>

      <div className='detail-grid'>
        <Surface className='wide-panel' title='Target Accounts' subtitle='Signals and fit scores from enrichment'>
          <div className='table-wrap'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Signal</th>
                  <th>Fit</th>
                  <th>Region</th>
                </tr>
              </thead>
              <tbody>
                {data.companies.map((company) => (
                  <tr key={company.company}>
                    <td>{company.company}</td>
                    <td>{company.signal}</td>
                    <td>
                      <span className={`status-pill status-pill--${getTone(company.fit)}`}>{company.fit}</span>
                    </td>
                    <td>{company.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>

        <Surface title='Signals to Watch' subtitle='Buying triggers worth acting on'>
          <div className='note-stack'>
            {data.signals.map((signal) => (
              <article className='note-card' key={signal.title}>
                <h3>{signal.title}</h3>
                <p>{signal.note}</p>
              </article>
            ))}
          </div>
        </Surface>
      </div>
    </>
  )
}

function VisitorsView({ data }) {
  return (
    <>
      <MetricStrip items={data.highlights} />

      <Surface title='Intent Feed' subtitle='Accounts visiting the highest-value pages'>
        <div className='table-wrap'>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Company</th>
                <th>Page</th>
                <th>Visits</th>
                <th>Source</th>
                <th>Intent</th>
              </tr>
            </thead>
            <tbody>
              {data.visitors.map((visitor) => (
                <tr key={`${visitor.company}-${visitor.page}`}>
                  <td>{visitor.company}</td>
                  <td>{visitor.page}</td>
                  <td>{visitor.visits}</td>
                  <td>{visitor.source}</td>
                  <td>
                    <span className={`status-pill status-pill--${getTone(visitor.intent)}`}>{visitor.intent}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </>
  )
}

function AnalyticsView({ data }) {
  const maxFunnelValue = Math.max(...data.funnel.map((item) => item.value), 1)

  return (
    <>
      <MetricStrip items={data.kpis} />

      <div className='detail-grid'>
        <Surface title='Funnel Health' subtitle='Volume by stage across the active quarter'>
          <div className='funnel-list'>
            {data.funnel.map((item) => (
              <div className='funnel-row' key={item.stage}>
                <div>
                  <strong>{item.stage}</strong>
                  <p>{item.value}</p>
                </div>
                <div className='funnel-bar'>
                  <span style={{ width: `${(item.value / maxFunnelValue) * 100}%` }}></span>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface title='Channel Performance' subtitle='Reply rate and lift versus last month'>
          <div className='channel-list'>
            {data.channels.map((channel) => (
              <article className='channel-card' key={channel.name}>
                <h3>{channel.name}</h3>
                <strong>{channel.rate}</strong>
                <span className='status-pill status-pill--good'>{channel.lift}</span>
              </article>
            ))}
          </div>
        </Surface>
      </div>
    </>
  )
}

function AssetsView({ data }) {
  return (
    <>
      <div className='folder-grid'>
        {data.folders.map((folder) => (
          <article className='folder-card' key={folder.name}>
            <div className='folder-icon'>
              <Icon name='folder' />
            </div>
            <h3>{folder.name}</h3>
            <strong>{folder.count}</strong>
            <p>{folder.note}</p>
          </article>
        ))}
      </div>

      <Surface title='Recent Assets' subtitle='The content your team is using most often'>
        <div className='asset-grid'>
          {data.assets.map((asset) => (
            <article className='asset-card' key={asset.title}>
              <span className='status-pill status-pill--neutral'>{asset.type}</span>
              <h3>{asset.title}</h3>
              <p>Updated {asset.updated}</p>
            </article>
          ))}
        </div>
      </Surface>
    </>
  )
}

function SettingsView({ data }) {
  return (
    <>
      <MetricStrip items={data.deliverability} compact />

      <div className='detail-grid'>
        <Surface className='wide-panel' title='Connected Mailboxes' subtitle='Current status for sending accounts'>
          <div className='table-wrap'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Mailbox</th>
                  <th>Status</th>
                  <th>Daily Volume</th>
                  <th>Warm-up</th>
                </tr>
              </thead>
              <tbody>
                {data.connections.map((connection) => (
                  <tr key={connection.mailbox}>
                    <td>{connection.mailbox}</td>
                    <td>
                      <span className={`status-pill status-pill--${getTone(connection.status)}`}>{connection.status}</span>
                    </td>
                    <td>{connection.volume}</td>
                    <td>
                      <span className={`status-pill status-pill--${getTone(connection.warmup)}`}>{connection.warmup}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>

        <Surface title='Automation Guardrails' subtitle='Protections enabled across the workspace'>
          <div className='note-stack'>
            {data.automations.map((item) => (
              <article className='note-card' key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </Surface>
      </div>
    </>
  )
}

function MetricStrip({ items, compact = false }) {
  return (
    <div className={`metric-grid ${compact ? 'metric-grid--compact' : ''}`}>
      {items.map((item) => (
        <article className={`metric-card ${compact ? 'metric-card--compact' : ''}`} key={item.label}>
          <p className='metric-label'>{item.label}</p>
          <strong className='metric-value'>{item.value}</strong>
          {item.helper ? <span className='metric-helper'>{item.helper}</span> : null}
        </article>
      ))}
    </div>
  )
}

function SummaryCard({ item }) {
  return (
    <article className='summary-card'>
      <div className='summary-card-top'>
        <div className='summary-icon'>
          <Icon name={item.icon} />
        </div>
        <span className='metric-label'>{item.label}</span>
      </div>
      <strong className='summary-value'>{item.value}</strong>
      <span className='metric-helper'>{item.helper}</span>
    </article>
  )
}

function Surface({ title, subtitle, headerRight, className = '', children }) {
  return (
    <section className={`panel ${className}`.trim()}>
      <div className='panel-header'>
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {headerRight ? <div>{headerRight}</div> : null}
      </div>
      {children}
    </section>
  )
}

function MetricChart({ points }) {
  const width = 640
  const height = 280
  const padding = 28
  const maxValue = Math.max(...points.map((point) => point.value), 1)
  const stepX = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0
  const coordinates = points.map((point, index) => ({
    ...point,
    x: padding + stepX * index,
    y: height - padding - (point.value / maxValue) * (height - padding * 2),
  }))
  const linePath = coordinates
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
  const areaPath =
    coordinates.length > 0
      ? `M ${coordinates[0].x} ${height - padding} ${coordinates
          .map((point) => `L ${point.x} ${point.y}`)
          .join(' ')} L ${coordinates[coordinates.length - 1].x} ${height - padding} Z`
      : ''

  return (
    <div className='chart-wrap'>
      <svg className='chart-svg' viewBox={`0 0 ${width} ${height}`} role='img' aria-label='Campaign trend'>
        {[0, 1, 2, 3].map((tick) => {
          const ratio = tick / 3
          const y = padding + ratio * (height - padding * 2)
          return <line key={tick} x1={padding} y1={y} x2={width - padding} y2={y} className='chart-grid-line' />
        })}
        <path d={areaPath} className='chart-area' />
        <path d={linePath} className='chart-line' />
        {coordinates.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r='5' className='chart-point' />
            <text x={point.x} y={point.y - 12} textAnchor='middle' className='chart-value'>
              {point.value}
            </text>
          </g>
        ))}
      </svg>
      <div className='chart-axis'>
        {points.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <section className='loading-grid'>
      <div className='panel loading-panel'>
        <span className='skeleton skeleton--title'></span>
        <span className='skeleton'></span>
        <span className='skeleton'></span>
      </div>
      <div className='panel loading-panel'>
        <span className='skeleton skeleton--title'></span>
        <span className='skeleton'></span>
        <span className='skeleton'></span>
      </div>
      <div className='panel loading-panel'>
        <span className='skeleton skeleton--title'></span>
        <span className='skeleton'></span>
        <span className='skeleton'></span>
      </div>
    </section>
  )
}

function getTab(key) {
  return NAV_ITEMS.find((item) => item.key === key) ?? NAV_ITEMS[0]
}

function getTone(value) {
  const normalized = value.toLowerCase()

  if (
    ['running', 'healthy', 'warm', 'high', 'qualified', 'replied', 'on', 'good'].some((token) =>
      normalized.includes(token),
    )
  ) {
    return 'good'
  }

  if (
    ['draft', 'testing', 'medium', 'today', 'needs', 'off', 'warn'].some((token) =>
      normalized.includes(token),
    )
  ) {
    return 'warn'
  }

  return 'neutral'
}

function Icon({ name }) {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className='icon'>
      {name === 'dashboard' ? <path d='M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' /> : null}
      {name === 'send' ? <path d='M4 11.5 20 4l-4.5 16-4-6-7.5-2.5Z M11.5 14 20 4' /> : null}
      {name === 'users' ? <path d='M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 19a4.5 4.5 0 0 1 9 0M13 19a3.5 3.5 0 0 1 7 0' /> : null}
      {name === 'message' ? <path d='M5 6.5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z' /> : null}
      {name === 'calendar' ? <path d='M7 3v4M17 3v4M4 9h16M5 6h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z' /> : null}
      {name === 'inbox' ? <path d='M4 5h16v9h-4l-2 3h-4l-2-3H4zM4 14h5a3 3 0 0 0 6 0h5' /> : null}
      {name === 'check' ? <path d='M9.5 12.5 11.5 14.5 15.5 10.5M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z' /> : null}
      {name === 'search' ? <path d='m20 20-4.2-4.2M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z' /> : null}
      {name === 'eye' ? <path d='M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' /> : null}
      {name === 'chart' ? <path d='M5 19V9M12 19V5M19 19v-8M3 19h18' /> : null}
      {name === 'folder' ? <path d='M3 7.5h6l2 2H21v8.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z' /> : null}
      {name === 'shield' ? <path d='M12 3 5 6v5c0 4.5 2.6 7.7 7 10 4.4-2.3 7-5.5 7-10V6l-7-3Z' /> : null}
      {name === 'warning' ? <path d='M12 4 2.8 19h18.4L12 4Zm0 5.2v4.8m0 3.2h.01' /> : null}
      {name === 'plus' ? <path d='M12 5v14M5 12h14' /> : null}
      {name === 'download' ? <path d='M12 4v10m0 0 4-4m-4 4-4-4M4 19h16' /> : null}
    </svg>
  )
}

export default App

