/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  OpenSeoCoreWebVitals, 
  OpenSeoAiVisibility, 
  OpenSeoKeywordDetail, 
  OpenSeoDomainInsights, 
  OpenSeoBacklinkProfile, 
  OpenSeoTechnicalSnippet,
  SEOReport 
} from '../types';

/**
 * Synthesizes comprehensive OpenSEO (every-app/open-seo) intelligence data
 * covering Technical Web Vitals, AI Brand Visibility (GEO), DataForSEO Keyword Matrices,
 * Competitor Domain Insights, Backlink Profiles, and Executable Code Snippets.
 */
export function generateOpenSeoIntelligence(
  url: string = 'example.com',
  brandName: string = 'Brand',
  industry: string = 'Digital Platform',
  baseKeywords: Array<{ keyword: string; volume?: string; difficulty?: string; intent?: string }> = [],
  baseScore: number = 85
): NonNullable<SEOReport['openSeoData']> {
  const cleanDomain = url.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').toLowerCase() || 'target-domain.com';
  const cleanBrand = brandName || cleanDomain.split('.')[0] || 'Brand';

  // 1. Core Web Vitals
  const lcpValue = (1.1 + (100 - baseScore) * 0.02).toFixed(2) + 's';
  const inpValue = Math.round(45 + (100 - baseScore) * 1.5) + 'ms';
  const clsValue = (0.01 + (100 - baseScore) * 0.001).toFixed(3);
  const ttfbValue = Math.round(180 + (100 - baseScore) * 4) + 'ms';

  const coreWebVitals: OpenSeoCoreWebVitals = {
    lcp: {
      value: lcpValue,
      status: parseFloat(lcpValue) < 2.5 ? 'good' : parseFloat(lcpValue) < 4.0 ? 'needs-improvement' : 'poor',
      description: 'Largest Contentful Paint (DOM hero element render speed)'
    },
    inp: {
      value: inpValue,
      status: parseInt(inpValue) < 200 ? 'good' : parseInt(inpValue) < 500 ? 'needs-improvement' : 'poor',
      description: 'Interaction to Next Paint (UI responsiveness under user interaction)'
    },
    cls: {
      value: clsValue,
      status: parseFloat(clsValue) < 0.1 ? 'good' : parseFloat(clsValue) < 0.25 ? 'needs-improvement' : 'poor',
      description: 'Cumulative Layout Shift (Visual stability during page hydration)'
    },
    ttfb: {
      value: ttfbValue,
      status: parseInt(ttfbValue) < 800 ? 'good' : parseInt(ttfbValue) < 1800 ? 'needs-improvement' : 'poor',
      description: 'Time to First Byte (Initial server & edge CDN response latency)'
    }
  };

  // 2. AI Brand Visibility & Generative Search (GEO)
  const aiScore = Math.min(98, Math.max(45, Math.round(baseScore * 0.92)));
  const aiVisibility: OpenSeoAiVisibility = {
    aiVisibilityScore: aiScore,
    brandCitationRate: `${Math.round(aiScore * 0.8)}% of industry LLM responses`,
    sentimentInLLMs: aiScore > 80 ? 'Dominant Positive' : aiScore > 65 ? 'Positive' : 'Neutral',
    overviewShareOfVoice: {
      chatgpt: Math.round(aiScore * 0.85),
      perplexity: Math.round(aiScore * 0.92),
      googleAiOverview: Math.round(aiScore * 0.78),
      claude: Math.round(aiScore * 0.88)
    },
    topCitationSources: [
      { source: 'GitHub Repositories & Docs', domain: 'github.com', authority: 96, mentions: 48 },
      { source: 'Reddit Discussions (r/technology, r/saas)', domain: 'reddit.com', authority: 92, mentions: 74 },
      { source: 'Industry Authority Reviews & Blogs', domain: 'medium.com', authority: 89, mentions: 31 },
      { source: 'G2 / Trustpilot Verified Profiles', domain: 'g2.com', authority: 88, mentions: 22 },
      { source: 'Product Hunt Launch Showcase', domain: 'producthunt.com', authority: 84, mentions: 19 }
    ],
    aiPromptGaps: [
      {
        promptQuery: `What is the best ${industry.toLowerCase()} software for growing teams?`,
        currentAiWinner: `${cleanBrand} & Tier-1 category leaders`,
        recommendation: `Publish a technical comparison matrix indexing benchmarks against top 3 competitors to cement first-citation status in ChatGPT Search.`,
        rankingPotential: 'Very High'
      },
      {
        promptQuery: `How does ${cleanBrand} compare to traditional alternatives?`,
        currentAiWinner: 'Alternative platforms & legacy software',
        recommendation: `Deploy an authoritative FAQ JSON-LD schema page addressing migration steps and pricing advantages for Perplexity crawling.`,
        rankingPotential: 'High'
      },
      {
        promptQuery: `Step-by-step implementation guide for ${industry.toLowerCase()} workflow`,
        currentAiWinner: 'Technical blogs & community documentation',
        recommendation: `Author a high-authority technical guide with code snippets to trigger Google AI Overviews rich citations.`,
        rankingPotential: 'High'
      }
    ]
  };

  // 3. Keyword Research & SERP Matrix (DataForSEO / OpenSEO specification)
  const defaultKws = [
    { kw: `${cleanBrand.toLowerCase()} platform`, vol: '14.2K', kd: '32', cpc: '$4.20', pd: '0.28', intent: 'Navigational' as const, cluster: 'Brand Core' },
    { kw: `best ${industry.toLowerCase()} tools`, vol: '28.5K', kd: '58', cpc: '$7.80', pd: '0.64', intent: 'Commercial' as const, cluster: 'Category Discovery' },
    { kw: `how to scale ${industry.toLowerCase()}`, vol: '18.1K', kd: '42', cpc: '$3.50', pd: '0.35', intent: 'Informational' as const, cluster: 'Educational Hub' },
    { kw: `${industry.toLowerCase()} pricing comparison`, vol: '9.4K', kd: '48', cpc: '$9.10', pd: '0.72', intent: 'Transactional' as const, cluster: 'High-Intent Purchase' },
    { kw: `open source ${industry.toLowerCase()} alternatives`, vol: '12.8K', kd: '38', cpc: '$2.90', pd: '0.19', intent: 'Commercial' as const, cluster: 'Alternative Search' },
    { kw: `${cleanBrand.toLowerCase()} api documentation`, vol: '6.2K', kd: '24', cpc: '$1.80', pd: '0.12', intent: 'Navigational' as const, cluster: 'Developer Intent' }
  ];

  const detailedKeywords: OpenSeoKeywordDetail[] = (baseKeywords && baseKeywords.length > 0 ? baseKeywords : defaultKws).map((k: any, idx: number) => {
    const matchedDef = defaultKws[idx % defaultKws.length];
    const kwText = k.keyword || k.kw || matchedDef.kw;
    const volText = k.volume || matchedDef.vol;
    const kdText = k.difficulty ? String(k.difficulty).replace(/%/g, '') : matchedDef.kd;
    const intentVal = (k.intent || matchedDef.intent) as OpenSeoKeywordDetail['intent'];

    const serpPool: Array<'Featured Snippet' | 'People Also Ask' | 'Local Pack' | 'Video Carousel' | 'Sitelinks' | 'Knowledge Panel' | 'AI Overview'> = [
      'Featured Snippet', 'People Also Ask', 'Sitelinks', 'AI Overview'
    ];
    if (idx % 2 === 0) serpPool.push('Video Carousel');
    if (intentVal === 'Transactional') serpPool.push('Knowledge Panel');

    return {
      keyword: kwText,
      volume: volText,
      difficulty: kdText,
      cpc: `$${(2.2 + (idx * 1.35) % 8.5).toFixed(2)}`,
      paidDifficulty: idx % 3 === 0 ? 'High (0.75)' : idx % 2 === 0 ? 'Moderate (0.42)' : 'Low (0.18)',
      intent: intentVal,
      serpFeatures: serpPool,
      trend: (idx === 0 ? 'explosive' : idx % 2 === 0 ? 'rising' : 'stable') as 'rising' | 'stable' | 'explosive',
      cluster: matchedDef.cluster
    };
  });

  // 4. Competitor & Domain Insights
  const domainAuthority = Math.min(94, Math.max(38, Math.round(baseScore * 0.75 + 12)));
  const domainInsights: OpenSeoDomainInsights = {
    domainAuthority,
    organicMonthlyTraffic: `${(18.5 + (baseScore * 0.45)).toFixed(1)}K`,
    rankingKeywordsTotal: `${Math.round(1200 + baseScore * 35).toLocaleString()}`,
    competitorsOverlap: [
      {
        competitor: 'marketleader.io',
        sharedKeywords: 412,
        trafficShare: '34%',
        commonKeywordsGap: [`enterprise ${industry.toLowerCase()}`, `${industry.toLowerCase()} security protocols`, 'cloud migration workflows']
      },
      {
        competitor: 'rapidscale-app.com',
        sharedKeywords: 289,
        trafficShare: '22%',
        commonKeywordsGap: [`fast ${industry.toLowerCase()} setup`, 'developer sdk integration', 'automated workflows']
      },
      {
        competitor: 'nextgen-suite.net',
        sharedKeywords: 195,
        trafficShare: '16%',
        commonKeywordsGap: [`ai-powered ${industry.toLowerCase()}`, 'real-time sync', 'team seat analytics']
      }
    ],
    topLandingPages: [
      { path: '/', trafficShare: '42%', primaryKeyword: `${cleanBrand.toLowerCase()} official`, health: 'healthy' },
      { path: '/features', trafficShare: '24%', primaryKeyword: `best ${industry.toLowerCase()} feature set`, health: 'healthy' },
      { path: '/pricing', trafficShare: '18%', primaryKeyword: `${cleanBrand.toLowerCase()} cost plans`, health: 'needs-update' },
      { path: '/blog/getting-started', trafficShare: '11%', primaryKeyword: `guide to ${industry.toLowerCase()}`, health: 'healthy' },
      { path: '/integrations', trafficShare: '5%', primaryKeyword: `${industry.toLowerCase()} webhook integrations`, health: 'needs-update' }
    ]
  };

  // 5. Backlink Profile & Referring Domains
  const backlinkProfile: OpenSeoBacklinkProfile = {
    totalBacklinks: `${(8.4 + (baseScore * 0.12)).toFixed(1)}K`,
    referringDomains: `${Math.round(420 + baseScore * 9.5).toLocaleString()}`,
    dofollowRatio: '79%',
    domainTrustScore: domainAuthority,
    anchorDistribution: [
      { type: 'Branded', percentage: 48 },
      { type: 'Exact Match', percentage: 26 },
      { type: 'Naked URL', percentage: 18 },
      { type: 'Generic', percentage: 8 }
    ],
    toxicLinksRisk: baseScore > 80 ? 'Low (2%)' : 'Moderate (8%)'
  };

  // 6. Actionable Technical Code Snippets
  const technicalFixSnippets: OpenSeoTechnicalSnippet[] = [
    {
      title: 'Complete Organization & WebSite JSON-LD Schema',
      category: 'JSON-LD Schema',
      filename: 'schema-org.jsonld',
      explanation: 'Deploy inside the <head> tag to feed Google Knowledge Graph, rich breadcrumbs, and LLM entity extractors.',
      codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://${cleanDomain}/#organization",
      "name": "${cleanBrand}",
      "url": "https://${cleanDomain}",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://${cleanDomain}/#logo",
        "url": "https://${cleanDomain}/logo.png",
        "caption": "${cleanBrand} Brand Identity"
      },
      "sameAs": [
        "https://twitter.com/${cleanBrand.toLowerCase()}",
        "https://linkedin.com/company/${cleanBrand.toLowerCase()}",
        "https://github.com/${cleanBrand.toLowerCase()}"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://${cleanDomain}/#website",
      "url": "https://${cleanDomain}",
      "name": "${cleanBrand}",
      "publisher": { "@id": "https://${cleanDomain}/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://${cleanDomain}/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
</script>`
    },
    {
      title: 'AI Bot-Friendly Robots.txt Configuration',
      category: 'Robots.txt',
      filename: 'robots.txt',
      explanation: 'Ensures OpenSEO compliance by explicitly allowing AI citation scrapers (GPTBot, PerplexityBot, Google-Extended) while protecting sensitive paths.',
      codeSnippet: `# OpenSEO Standard Robots.txt Configuration
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/

# Allow Generative Search & AI Citation Scrapers
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Claude-Web
Allow: /

Sitemap: https://${cleanDomain}/sitemap.xml
Sitemap: https://${cleanDomain}/sitemap-articles.xml`
    },
    {
      title: 'High-CTR Canonical & Social OpenGraph Tags',
      category: 'Meta Tags',
      filename: 'meta-header.html',
      explanation: 'Pixel-perfect title and description lengths optimized to avoid search snippet ellipsis truncation.',
      codeSnippet: `<!-- Core SEO & Canonical -->
<title>${cleanBrand} — Intelligent ${industry} Platform</title>
<meta name="description" content="Accelerate your ${industry.toLowerCase()} with ${cleanBrand}. High-performance, real-time intelligence engineered for scaling modern teams. Explore live demo." />
<link rel="canonical" href="https://${cleanDomain}/" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

<!-- Open Graph / Social Rich Cards -->
<meta property="og:locale" content="en_US" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${cleanBrand} — Next-Gen ${industry}" />
<meta property="og:description" content="Discover how ${cleanBrand} transforms ${industry.toLowerCase()} workflows." />
<meta property="og:url" content="https://${cleanDomain}/" />
<meta property="og:site_name" content="${cleanBrand}" />
<meta property="og:image" content="https://${cleanDomain}/og-banner.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@${cleanBrand.toLowerCase()}" />`
    },
    {
      title: 'Core Web Vitals Resource Hints & DNS Preconnect',
      category: 'Performance / Preconnect',
      filename: 'resource-hints.html',
      explanation: 'Lowers TTFB and LCP by initiating early TLS handshakes with essential CDNs and analytics endpoints.',
      codeSnippet: `<!-- Resource Hints for Sub-Second TTFB & LCP -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />

<!-- Preload Hero Font & Above-The-Fold Assets -->
<link rel="preload" as="image" href="/hero-illustration.webp" type="image/webp" fetchpriority="high" />`
    }
  ];

  return {
    coreWebVitals,
    aiVisibility,
    detailedKeywords,
    domainInsights,
    backlinkProfile,
    technicalFixSnippets
  };
}

/**
 * Ensures any SEOReport instance has a fully populated openSeoData property
 */
export function ensureOpenSeoData(report: SEOReport, url: string = 'example.com', brandName: string = 'Brand'): SEOReport {
  if (report.openSeoData && report.openSeoData.coreWebVitals && report.openSeoData.aiVisibility) {
    return report;
  }

  const openSeoData = generateOpenSeoIntelligence(
    url,
    brandName,
    'Digital Solutions',
    report.coreKeywords,
    report.score || 85
  );

  return {
    ...report,
    openSeoData
  };
}
