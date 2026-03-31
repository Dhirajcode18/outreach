export const dashboardApi = {
  dashboard: {
    title: 'Dashboard',
    breadcrumbs: ['Home', 'Dashboard'],
    description: 'Keep outreach execution, replies, and pipeline movement in one view.',
    warning: {
      message:
        "You don't have every sending account configured yet. Connect email, LinkedIn, or a managed inbox to unlock automations.",
      actionLabel: 'Go to Settings',
      actionTarget: 'settings',
    },
    actions: [
      { label: 'Create Campaign', tone: 'primary', target: 'campaigns', icon: 'plus' },
      { label: 'View Leads', tone: 'secondary', target: 'leads', icon: 'users' },
      { label: 'Analytics', tone: 'secondary', target: 'analytics', icon: 'chart' },
    ],
    summary: [
      { label: 'Total Leads', value: '1,248', helper: 'Contacts in active lists', icon: 'users' },
      { label: 'Leads Contacted', value: '912', helper: 'Across 14 live campaigns', icon: 'send' },
      { label: 'Responses', value: '138', helper: '15.1% reply rate', icon: 'message' },
      { label: 'Meetings', value: '27', helper: 'Booked this quarter', icon: 'calendar' },
    ],
    chart: {
      title: 'Campaigns',
      subtitle: 'Email metrics over the last 8 weeks',
      metricLabel: 'Email',
      rangeLabel: 'Week',
      points: [
        { label: 'W1', value: 14 },
        { label: 'W2', value: 20 },
        { label: 'W3', value: 17 },
        { label: 'W4', value: 28 },
        { label: 'W5', value: 31 },
        { label: 'W6', value: 26 },
        { label: 'W7', value: 34 },
        { label: 'W8', value: 41 },
      ],
    },
    engagedLeads: [
      { name: 'Ananya Patel', company: 'Northbeam Labs', score: '92', touch: 'Opened 5 times in 2 days', channel: 'Email' },
      { name: 'Marcus Reed', company: 'Pinecrest AI', score: '87', touch: 'Asked for pricing deck', channel: 'LinkedIn' },
      { name: 'Leah Dawson', company: 'Orbit Commerce', score: '81', touch: 'Replied after demo clip', channel: 'Email' },
    ],
    activity: [
      { title: 'Pricing follow-up sent', detail: 'Nisha sent a case study to Pinecrest AI.', when: '12 min ago' },
      { title: 'Lead moved to warm', detail: 'Northbeam Labs hit the website 3 times this morning.', when: '32 min ago' },
      { title: 'Meeting confirmed', detail: 'Orbit Commerce booked a 30-minute intro for Thursday.', when: '1 hr ago' },
    ],
  },
  campaigns: {
    title: 'Campaigns',
    breadcrumbs: ['Engage', 'Campaigns'],
    description: 'Manage live sequences, owners, and cadence health.',
    actions: [
      { label: 'New Sequence', tone: 'primary', target: 'campaigns', icon: 'plus' },
      { label: 'Review Leads', tone: 'secondary', target: 'leads', icon: 'users' },
    ],
    overview: [
      { label: 'Live Campaigns', value: '14', helper: '3 launching this week' },
      { label: 'Avg Reply Rate', value: '15.1%', helper: 'Up 2.4% vs last month' },
      { label: 'Meetings Booked', value: '27', helper: '7 from outbound email' },
    ],
    campaigns: [
      { name: 'Q2 RevOps Push', owner: 'Nisha', channel: 'Email', status: 'Running', progress: 82, leads: 240, replies: 38, meetings: 9 },
      { name: 'Founder Outreach', owner: 'Dev', channel: 'LinkedIn', status: 'Testing', progress: 61, leads: 120, replies: 14, meetings: 3 },
      { name: 'Mid-Market Re-activation', owner: 'Aman', channel: 'Email', status: 'Running', progress: 74, leads: 186, replies: 25, meetings: 6 },
      { name: 'Website Intent Follow-up', owner: 'Sara', channel: 'Multi-touch', status: 'Draft', progress: 22, leads: 56, replies: 3, meetings: 1 },
    ],
    experiments: [
      { title: 'Subject line test', note: 'ROI-led messaging is winning by 18% opens.' },
      { title: 'CTA experiment', note: 'Shorter CTA increased replies from directors.' },
      { title: 'Send window', note: 'Tuesday 9:30 AM outperforms Friday by 2.1x.' },
    ],
  },
  leads: {
    title: 'Leads',
    breadcrumbs: ['Engage', 'Leads'],
    description: 'Search, segment, and prioritize the people who are most likely to convert.',
    actions: [
      { label: 'Export Segment', tone: 'primary', target: 'leads', icon: 'download' },
      { label: 'Open Inbox', tone: 'secondary', target: 'inbox', icon: 'inbox' },
    ],
    overview: [
      { label: 'Net New', value: '184', helper: 'Added in the last 7 days' },
      { label: 'Warm Leads', value: '63', helper: 'High intent or recent reply' },
      { label: 'Need Enrichment', value: '29', helper: 'Missing phone or role data' },
    ],
    leads: [
      { name: 'Ananya Patel', title: 'VP Revenue', company: 'Northbeam Labs', status: 'Warm', score: 92, lastTouch: 'Viewed pricing page 3x', owner: 'Nisha' },
      { name: 'Marcus Reed', title: 'CEO', company: 'Pinecrest AI', status: 'Replied', score: 87, lastTouch: 'Asked for pricing deck', owner: 'Dev' },
      { name: 'Leah Dawson', title: 'Head of Growth', company: 'Orbit Commerce', status: 'Qualified', score: 81, lastTouch: 'Booked intro call', owner: 'Sara' },
      { name: 'Kevin Joseph', title: 'Sales Ops Lead', company: 'Stackline', status: 'Active', score: 76, lastTouch: 'Clicked calendar CTA', owner: 'Aman' },
      { name: 'Riya Menon', title: 'Founder', company: 'MotiveIQ', status: 'New', score: 73, lastTouch: 'Added from Apollo list', owner: 'Dev' },
      { name: 'Tara Bloom', title: 'Director of RevOps', company: 'Alloy Cloud', status: 'Nurture', score: 69, lastTouch: 'Needs follow-up copy', owner: 'Nisha' },
    ],
  },
  inbox: {
    title: 'Inbox',
    breadcrumbs: ['Engage', 'Inbox'],
    description: 'Stay on top of replies, follow-ups, and handoffs to the team.',
    actions: [
      { label: 'Review Approvals', tone: 'primary', target: 'approvals', icon: 'check' },
      { label: 'Open Leads', tone: 'secondary', target: 'leads', icon: 'users' },
    ],
    stats: [
      { label: 'Unread', value: '18' },
      { label: 'Needs Reply', value: '7' },
      { label: 'Waiting', value: '12' },
    ],
    threads: [
      {
        name: 'Marcus Reed',
        company: 'Pinecrest AI',
        preview: 'Can you send pricing for a five-seat team?',
        time: '9:18 AM',
        subject: 'Pricing for outbound pilot',
        messages: [
          { from: 'Marcus Reed', role: 'Lead', body: 'Can you send pricing for a five-seat team and outline onboarding time?', time: '9:18 AM' },
          { from: 'Dev', role: 'You', body: 'Absolutely. I will send the pricing breakdown and a sample rollout plan shortly.', time: '9:31 AM' },
        ],
      },
      {
        name: 'Ananya Patel',
        company: 'Northbeam Labs',
        preview: 'The case study was helpful. What does implementation look like?',
        time: 'Yesterday',
        subject: 'Implementation timeline',
        messages: [
          { from: 'Ananya Patel', role: 'Lead', body: 'The case study was helpful. What does implementation look like for a lean team?', time: 'Yesterday' },
          { from: 'Nisha', role: 'Owner', body: 'Most teams go live in less than 10 days. I can share the onboarding checklist if helpful.', time: 'Yesterday' },
        ],
      },
      {
        name: 'Tara Bloom',
        company: 'Alloy Cloud',
        preview: 'Looping in our SDR manager.',
        time: 'Yesterday',
        subject: 'Internal handoff',
        messages: [
          { from: 'Tara Bloom', role: 'Lead', body: 'Looping in our SDR manager. Curious if this can work with our current CRM setup.', time: 'Yesterday' },
        ],
      },
    ],
    templates: [
      { name: 'Pricing Follow-up', note: 'Shares seat-based pricing and onboarding.' },
      { name: 'Case Study Reply', note: 'Links to social proof with a short CTA.' },
      { name: 'Meeting Confirmation', note: 'Confirms agenda and attendees.' },
    ],
  },
  approvals: {
    title: 'Approvals',
    breadcrumbs: ['Engage', 'Approvals'],
    description: 'Review AI drafts, sensitive messaging, and escalation items before they send.',
    actions: [
      { label: 'Open Inbox', tone: 'primary', target: 'inbox', icon: 'inbox' },
      { label: 'Go to Campaigns', tone: 'secondary', target: 'campaigns', icon: 'send' },
    ],
    queue: [
      { lead: 'Riya Menon', campaign: 'Founder Outreach', reason: 'Mentions competitor by name', owner: 'Dev', due: 'Today' },
      { lead: 'Kevin Joseph', campaign: 'Q2 RevOps Push', reason: 'Custom ROI numbers inserted', owner: 'Aman', due: 'Today' },
      { lead: 'Tara Bloom', campaign: 'Website Intent Follow-up', reason: 'Escalated after website intent spike', owner: 'Nisha', due: 'Tomorrow' },
    ],
    history: [
      { title: '3 approvals sent', note: 'Morning queue processed in 11 minutes.' },
      { title: '1 message edited', note: 'Pricing language softened before send.' },
    ],
  },
  prospecting: {
    title: 'Prospecting',
    breadcrumbs: ['Find & Enrich', 'Prospecting'],
    description: 'Track target accounts, buyer signals, and fresh list-building ideas.',
    actions: [
      { label: 'Add Watchlist', tone: 'primary', target: 'prospecting', icon: 'plus' },
      { label: 'View Visitors', tone: 'secondary', target: 'visitors', icon: 'eye' },
    ],
    watchlists: [
      { name: 'RevOps SaaS', accounts: 42, change: '+9 this week' },
      { name: 'PLG Fintech', accounts: 18, change: '+4 this week' },
      { name: 'Intent Accounts', accounts: 27, change: '12 hot right now' },
    ],
    companies: [
      { company: 'Northbeam Labs', signal: 'Hiring 4 SDR roles', fit: 'High', region: 'US' },
      { company: 'Orbit Commerce', signal: 'Visited pricing page', fit: 'High', region: 'EU' },
      { company: 'MotiveIQ', signal: 'Raised Seed+', fit: 'Medium', region: 'APAC' },
      { company: 'Alloy Cloud', signal: 'New CRM migration', fit: 'High', region: 'US' },
    ],
    signals: [
      { title: 'Champion movement', note: '2 warm leads changed jobs into ICP accounts.' },
      { title: 'Buying committee growth', note: '3 accounts added RevOps + Marketing contacts this week.' },
      { title: 'Timing trigger', note: '11 accounts visited pricing or integration pages.' },
    ],
  },
  visitors: {
    title: 'Website Visitors',
    breadcrumbs: ['Find & Enrich', 'Website Visitors'],
    description: 'See which accounts are researching your product and where that interest is coming from.',
    actions: [
      { label: 'Start Follow-up', tone: 'primary', target: 'campaigns', icon: 'send' },
      { label: 'Open Analytics', tone: 'secondary', target: 'analytics', icon: 'chart' },
    ],
    highlights: [
      { label: 'Companies Live', value: '9', helper: 'Browsing right now' },
      { label: 'Hot Pages', value: '4', helper: 'Pricing and integrations lead' },
      { label: 'Matched Leads', value: '21', helper: 'Ready for outreach' },
    ],
    visitors: [
      { company: 'Northbeam Labs', page: '/pricing', visits: 7, source: 'Direct', intent: 'High' },
      { company: 'Orbit Commerce', page: '/integrations/salesforce', visits: 4, source: 'Organic', intent: 'High' },
      { company: 'Alloy Cloud', page: '/case-studies/revops', visits: 6, source: 'Paid Search', intent: 'Medium' },
      { company: 'Pinecrest AI', page: '/security', visits: 3, source: 'Direct', intent: 'Medium' },
    ],
  },
  analytics: {
    title: 'Analytics',
    breadcrumbs: ['Insights', 'Analytics'],
    description: 'Break down channel performance, funnel health, and reply efficiency.',
    actions: [
      { label: 'Campaigns', tone: 'primary', target: 'campaigns', icon: 'send' },
      { label: 'Leads', tone: 'secondary', target: 'leads', icon: 'users' },
    ],
    kpis: [
      { label: 'Open Rate', value: '46.8%', helper: 'Email only' },
      { label: 'Reply Rate', value: '15.1%', helper: 'Across all channels' },
      { label: 'Meeting Rate', value: '2.9%', helper: 'From total leads contacted' },
      { label: 'Pipeline Created', value: '$184k', helper: 'Attributed this quarter' },
    ],
    funnel: [
      { stage: 'Delivered', value: 1240 },
      { stage: 'Opened', value: 581 },
      { stage: 'Replied', value: 138 },
      { stage: 'Qualified', value: 63 },
      { stage: 'Meetings', value: 27 },
    ],
    channels: [
      { name: 'Email', rate: '15.1%', lift: '+2.4%' },
      { name: 'LinkedIn', rate: '11.3%', lift: '+1.1%' },
      { name: 'Website Intent', rate: '21.8%', lift: '+5.7%' },
    ],
  },
  assets: {
    title: 'Sales Assets',
    breadcrumbs: ['Assets', 'Sales Assets'],
    description: 'Organize decks, snippets, and proof points the team uses in live outreach.',
    actions: [
      { label: 'Upload Asset', tone: 'primary', target: 'assets', icon: 'plus' },
      { label: 'Review Analytics', tone: 'secondary', target: 'analytics', icon: 'chart' },
    ],
    folders: [
      { name: 'Case Studies', count: 12, note: 'Industry-specific wins and proof.' },
      { name: 'Decks', count: 7, note: 'Discovery, demo, and executive review.' },
      { name: 'Templates', count: 21, note: 'Reply frameworks and follow-up snippets.' },
    ],
    assets: [
      { title: 'RevOps ROI Deck', type: 'Deck', updated: '2 days ago' },
      { title: 'Implementation Checklist', type: 'PDF', updated: 'Yesterday' },
      { title: 'Security FAQ', type: 'Doc', updated: '5 days ago' },
      { title: 'Competitor Battlecard', type: 'Notion', updated: 'Today' },
    ],
  },
  settings: {
    title: 'Email Health',
    breadcrumbs: ['Configuration', 'Email Health'],
    description: 'Monitor connected accounts, warm-up, and sending safeguards.',
    actions: [
      { label: 'Back to Dashboard', tone: 'primary', target: 'dashboard', icon: 'dashboard' },
      { label: 'Inbox', tone: 'secondary', target: 'inbox', icon: 'inbox' },
    ],
    connections: [
      { mailbox: 'growth@outreachhq.com', status: 'Healthy', volume: '38/day', warmup: 'On' },
      { mailbox: 'hello@outreachhq.com', status: 'Needs DNS', volume: '0/day', warmup: 'Off' },
      { mailbox: 'founder@outreachhq.com', status: 'Healthy', volume: '22/day', warmup: 'On' },
    ],
    deliverability: [
      { label: 'Domain Reputation', value: '87/100' },
      { label: 'Spam Rate', value: '0.4%' },
      { label: 'Bounce Rate', value: '1.1%' },
    ],
    automations: [
      { title: 'Warm-up enabled', note: '2 accounts are ramping safely.' },
      { title: 'Reply detection active', note: 'All inboxes sync every 2 minutes.' },
      { title: 'Sending window protected', note: 'No emails outside business hours.' },
    ],
  },
}

