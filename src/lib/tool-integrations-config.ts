/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ToolIntegrationConfig {
  id: string;
  category: 'analytics' | 'cms' | 'crm' | 'advertising' | 'social' | 'seo' | 'automation';
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  color: string;
  badge: string;
  fields: Array<{
    key: string;
    label: string;
    placeholder: string;
    type: 'text' | 'password' | 'url';
    required: boolean;
    helperText?: string;
  }>;
  capabilities: string[];
  docLink: string;
}

export interface ConnectedToolState {
  id: string;
  toolId: string;
  userId: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync?: string;
  config: Record<string, string>; // Masked credentials
  syncedMetrics?: {
    summary: string;
    dataPoints: Array<{ label: string; value: string; change?: string; trend?: 'up' | 'down' | 'neutral' }>;
  };
}

export const SUPPORTED_INTEGRATIONS: ToolIntegrationConfig[] = [
  {
    id: 'google-analytics',
    category: 'analytics',
    name: 'Google Analytics 4 (GA4)',
    tagline: 'Real-time Traffic & Conversion Funnels',
    description: 'Pull live session metrics, user acquisition channels, goal conversions, bounce rates, and top organic landing pages directly into agent reasoning.',
    iconName: 'BarChart2',
    color: 'from-amber-500 to-orange-600',
    badge: 'Traffic & Funnels',
    fields: [
      { key: 'propertyId', label: 'GA4 Property ID', placeholder: 'e.g. 123456789', type: 'text', required: true, helperText: 'Found in Admin > Property Settings' },
      { key: 'measurementId', label: 'Measurement ID (G-XXXXX)', placeholder: 'e.g. G-ABC123XYZ', type: 'text', required: true, helperText: 'Data Streams > Stream details' },
      { key: 'apiKey', label: 'Google Analytics Data API Secret / Service Key', placeholder: 'Paste service account key or API secret', type: 'password', required: true }
    ],
    capabilities: [
      'Real-time traffic anomaly detection',
      'AI keyword to landing page attribution',
      'High-converting audience segment discovery',
      'Automated marketing ROI verification'
    ],
    docLink: 'https://developers.google.com/analytics/devguides/reporting/data/v1'
  },
  {
    id: 'google-search-console',
    category: 'seo',
    name: 'Google Search Console',
    tagline: 'Organic Keywords, Clicks & Indexing',
    description: 'Sync live search query impressions, CTR curves, indexing coverage issues, and position rank tracking for your domain.',
    iconName: 'Search',
    color: 'from-blue-500 to-indigo-600',
    badge: 'Search Vitals',
    fields: [
      { key: 'siteUrl', label: 'Domain / Site URL', placeholder: 'https://example.com', type: 'url', required: true },
      { key: 'apiKey', label: 'GSC Service Account / OAuth Key', placeholder: 'Paste JSON key or API token', type: 'password', required: true }
    ],
    capabilities: [
      'Instant keyword cannibalization audits',
      'Zero-click vs high CTR query classification',
      'Automated sitemap submission & coverage checking',
      'AI-driven metadata title tag split-testing'
    ],
    docLink: 'https://developers.google.com/webmaster-tools'
  },
  {
    id: 'wordpress',
    category: 'cms',
    name: 'WordPress CMS (REST API)',
    tagline: '1-Click Direct AI Article & Schema Publishing',
    description: 'Connect your WordPress site via REST API to automatically push SEO-optimized articles, category assignments, Yoast/RankMath meta tags, and featured images.',
    iconName: 'Globe',
    color: 'from-sky-500 to-blue-700',
    badge: 'Direct CMS Auto-Publish',
    fields: [
      { key: 'siteUrl', label: 'WordPress Site URL', placeholder: 'https://yourblog.com', type: 'url', required: true },
      { key: 'username', label: 'Admin / Author Username', placeholder: 'e.g. marketing_lead', type: 'text', required: true },
      { key: 'appPassword', label: 'Application Password', placeholder: 'Generated from Users > Profile > Application Passwords', type: 'password', required: true, helperText: 'Generate an Application Password in WordPress admin' }
    ],
    capabilities: [
      '1-Click automated blog publishing from Content Strategy Desk',
      'Automatic featured image and alt-tag generation',
      'Yoast / RankMath SEO title & focus keyword injection',
      'Draft staging and executive approval workflow'
    ],
    docLink: 'https://developer.wordpress.org/rest-api/'
  },
  {
    id: 'hubspot',
    category: 'crm',
    name: 'HubSpot CRM & Marketing Hub',
    tagline: 'Lead Ingestion, Contact Enrichment & Lifecycle Sync',
    description: 'Sync inbound leads captured by the Lead Gen agent straight to HubSpot pipelines, enrich lead data, and trigger email sequences.',
    iconName: 'Users',
    color: 'from-orange-500 to-amber-600',
    badge: 'Inbound CRM',
    fields: [
      { key: 'portalId', label: 'HubSpot Hub ID (Portal ID)', placeholder: 'e.g. 8765432', type: 'text', required: true },
      { key: 'accessToken', label: 'Private App Access Token', placeholder: 'pat-na1-xxxxxx', type: 'password', required: true, helperText: 'Settings > Integrations > Private Apps' }
    ],
    capabilities: [
      'Instant sync of calculated lead magnets to contact records',
      'Dynamic deal pipeline progression',
      'Marketing qualification scoring (MQL / SQL)',
      'Automated email nurture sequence triggers'
    ],
    docLink: 'https://developers.hubspot.com/'
  },
  {
    id: 'shopify',
    category: 'cms',
    name: 'Shopify Storefront & Products',
    tagline: 'E-commerce Catalog, Abandoned Cart & Promo Sync',
    description: 'Sync product collections, inventory stock, and historical order data to automatically write high-converting product descriptions, ads, and email campaigns.',
    iconName: 'ShoppingBag',
    color: 'from-emerald-500 to-teal-600',
    badge: 'E-Commerce Store',
    fields: [
      { key: 'shopUrl', label: 'Shopify Store Domain', placeholder: 'your-brand.myshopify.com', type: 'text', required: true },
      { key: 'accessToken', label: 'Storefront Admin API Access Token', placeholder: 'shpat_xxxxxx', type: 'password', required: true }
    ],
    capabilities: [
      'Automated AI product description & FAQ generation',
      'Low-stock and top-seller promo ad generation',
      'Cross-sell email sequence personalization',
      'E-commerce ad ROAS verification'
    ],
    docLink: 'https://shopify.dev/docs/api/admin-rest'
  },
  {
    id: 'meta-ads',
    category: 'advertising',
    name: 'Meta Ads Manager (Facebook & IG)',
    tagline: 'Campaign Deployment & Creative Sync',
    description: 'Deploy ad creative variants, copy hooks, and audience segments directly to Meta Marketing API with automated daily budget caps.',
    iconName: 'Share2',
    color: 'from-blue-600 to-cyan-500',
    badge: 'Paid Social Ads',
    fields: [
      { key: 'adAccountId', label: 'Ad Account ID (act_XXXXX)', placeholder: 'act_1234567890', type: 'text', required: true },
      { key: 'accessToken', label: 'Meta System User / User Access Token', placeholder: 'EAABxxxxxx', type: 'password', required: true }
    ],
    capabilities: [
      '1-Click ad creative deployment to drafts or live campaigns',
      'Real-time CPA & ROAS alert monitoring',
      'Lookalike and retargeting custom audience creation',
      'Creative fatigue auto-refresh alerts'
    ],
    docLink: 'https://developers.facebook.com/docs/marketing-apis'
  },
  {
    id: 'google-ads',
    category: 'advertising',
    name: 'Google Ads (Search & Performance Max)',
    tagline: 'PPC Bidding, RSA Headlines & Keyword Sync',
    description: 'Deploy Responsive Search Ads (RSAs), negative keyword lists, and target CPA bid strategies directly to your Google Ads account.',
    iconName: 'Target',
    color: 'from-red-500 to-amber-500',
    badge: 'Search PPC',
    fields: [
      { key: 'customerId', label: 'Google Ads Customer ID (XXX-XXX-XXXX)', placeholder: '123-456-7890', type: 'text', required: true },
      { key: 'developerToken', label: 'Developer Token / OAuth Token', placeholder: 'Paste developer token or OAuth key', type: 'password', required: true }
    ],
    capabilities: [
      'Deploy 15 headlines + 4 descriptions in seconds',
      'Negative keyword list auto-sync',
      'Search term waste elimination',
      'Quality score diagnostic engine'
    ],
    docLink: 'https://developers.google.com/google-ads/api/docs/first-call/overview'
  },
  {
    id: 'zapier-webhook',
    category: 'automation',
    name: 'Zapier / Make / n8n Webhook Relay',
    tagline: 'Universal Event Dispatcher to 5,000+ Apps',
    description: 'Trigger custom multi-step workflows in Zapier, Make.com, or n8n whenever an agent completes an SEO audit, social calendar, or email campaign.',
    iconName: 'Zap',
    color: 'from-purple-500 to-pink-600',
    badge: '5,000+ App Relay',
    fields: [
      { key: 'webhookUrl', label: 'Catch Hook Webhook URL', placeholder: 'https://hooks.zapier.com/hooks/catch/...', type: 'url', required: true },
      { key: 'authHeader', label: 'Optional Secret Header / Token', placeholder: 'Bearer xxx (Optional)', type: 'password', required: false }
    ],
    capabilities: [
      'Broadcast marketing events to Slack, Discord, or Notion',
      'Sync generated assets to Dropbox or Google Drive',
      'Send SMS alerts via Twilio on critical rank drops',
      'Trigger custom CRM webhooks on lead capture'
    ],
    docLink: 'https://zapier.com/apps/webhook/integrations'
  }
];
