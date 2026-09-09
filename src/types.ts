/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CEOReport {
  executiveSummary: string;
  brandName: string;
  industry: string;
  targetAudience: string;
  positioning: string;
  majorCompetitors: string[];
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  keyMetrics: Array<{
    label: string;
    value: string;
    description: string;
  }>;
}

export interface OpenSeoCoreWebVitals {
  lcp: { value: string; status: 'good' | 'needs-improvement' | 'poor'; description: string };
  inp: { value: string; status: 'good' | 'needs-improvement' | 'poor'; description: string };
  cls: { value: string; status: 'good' | 'needs-improvement' | 'poor'; description: string };
  ttfb: { value: string; status: 'good' | 'needs-improvement' | 'poor'; description: string };
}

export interface OpenSeoAiVisibility {
  aiVisibilityScore: number;
  brandCitationRate: string;
  sentimentInLLMs: 'Dominant Positive' | 'Positive' | 'Neutral' | 'Mixed';
  overviewShareOfVoice: {
    chatgpt: number;
    perplexity: number;
    googleAiOverview: number;
    claude: number;
  };
  topCitationSources: Array<{
    source: string;
    domain: string;
    authority: number;
    mentions: number;
  }>;
  aiPromptGaps: Array<{
    promptQuery: string;
    currentAiWinner: string;
    recommendation: string;
    rankingPotential: 'High' | 'Very High' | 'Medium';
  }>;
}

export interface OpenSeoKeywordDetail {
  keyword: string;
  volume: string;
  difficulty: string;
  cpc: string;
  paidDifficulty: string;
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  serpFeatures: Array<'Featured Snippet' | 'People Also Ask' | 'Local Pack' | 'Video Carousel' | 'Sitelinks' | 'Knowledge Panel' | 'AI Overview'>;
  trend: 'rising' | 'stable' | 'explosive';
  cluster: string;
}

export interface OpenSeoDomainInsights {
  domainAuthority: number;
  organicMonthlyTraffic: string;
  rankingKeywordsTotal: string;
  competitorsOverlap: Array<{
    competitor: string;
    sharedKeywords: number;
    trafficShare: string;
    commonKeywordsGap: string[];
  }>;
  topLandingPages: Array<{
    path: string;
    trafficShare: string;
    primaryKeyword: string;
    health: 'healthy' | 'needs-update' | 'critical';
  }>;
}

export interface OpenSeoBacklinkProfile {
  totalBacklinks: string;
  referringDomains: string;
  dofollowRatio: string;
  domainTrustScore: number;
  anchorDistribution: Array<{
    type: 'Branded' | 'Exact Match' | 'Naked URL' | 'Generic';
    percentage: number;
  }>;
  toxicLinksRisk: 'Low (2%)' | 'Moderate (8%)' | 'High';
}

export interface OpenSeoTechnicalSnippet {
  title: string;
  category: 'JSON-LD Schema' | 'Robots.txt' | 'Meta Tags' | 'Performance / Preconnect';
  filename: string;
  codeSnippet: string;
  explanation: string;
}

export interface SEOReport {
  score: number;
  siteSpeed: string;
  mobileFriendliness: string;
  technicalIssues: string[];
  coreKeywords: Array<{
    keyword: string;
    volume: string;
    difficulty: string;
    intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  }>;
  seoAuditChecks: Array<{
    check: string;
    status: 'pass' | 'warning' | 'fail';
    detail: string;
  }>;
  onPageOptimizationPlan: string[];
  openSeoData?: {
    coreWebVitals: OpenSeoCoreWebVitals;
    aiVisibility: OpenSeoAiVisibility;
    detailedKeywords: OpenSeoKeywordDetail[];
    domainInsights: OpenSeoDomainInsights;
    backlinkProfile: OpenSeoBacklinkProfile;
    technicalFixSnippets: OpenSeoTechnicalSnippet[];
  };
}

export interface ContentReport {
  corePillar: string;
  targetAudienceIntent: string;
  contentPillars: string[];
  blogArticles: Array<{
    title: string;
    keywords: string[];
    audienceNeed: string;
    headlineHook: string;
    detailedOutline: string[];
    callToAction: string;
  }>;
}

export interface SocialPost {
  channel: 'LinkedIn' | 'Twitter/X' | 'Meta (FB/Insta)' | 'TikTok' | 'YouTube Shorts';
  day: string;
  theme: string;
  caption: string;
  imagePrompt: string;
  hashtags: string[];
}

export interface SocialReport {
  strategy: string;
  recommendedChannels: string[];
  postingFrequency: string;
  posts: SocialPost[];
}

export interface AdCampaign {
  platform: 'Google Search' | 'Meta (FB/Insta) Feed' | 'LinkedIn Sponsored' | 'YouTube Video';
  objective: string;
  headline: string;
  primaryText: string;
  targetAudience: string;
  budgetShare: string;
  visualPrompt?: string;
}

export interface AdReport {
  monthlyBudgetRecommendation: string;
  targetACOSGoal: string;
  campaigns: AdCampaign[];
}

export interface LeadGenReport {
  leadMagnetIdea: string;
  magnetTitle: string;
  valueProposition: string;
  deliveryMethod: string;
  landingPageCopy: {
    heroHeadline: string;
    heroSubheadline: string;
    formCta: string;
    keyBenefits: string[];
    trustSignals: string[];
  };
  funnelSteps: string[];
}

export interface EmailMessage {
  subjectLine: string;
  previewText: string;
  body: string;
  delayDays: number;
  purpose: string;
}

export interface EmailReport {
  campaignName: string;
  sequenceGoal: string;
  estimatedOpenRate: string;
  emails: EmailMessage[];
}

export interface GeoReport {
  aiSearchEngineReadiness: number;
  llmBrandPerception: 'Dominant Leader' | 'High Authority' | 'Emerging Entity' | 'Unindexed';
  overviewShareOfVoice: {
    chatgpt: number;
    perplexity: number;
    googleAiOverview: number;
    claude: number;
  };
  perplexityGaps: Array<{
    query: string;
    dominantSource: string;
    recommendedFix: string;
    priority: 'Critical' | 'High' | 'Medium';
  }>;
  entitySchemaMarkup: {
    schemaType: string;
    jsonLd: string;
    explanation: string;
  };
  digitalPrCitationRoadmap: Array<{
    publication: string;
    targetTopic: string;
    authorityImpact: string;
    semanticEntity: string;
  }>;
}

export interface VideoScene {
  timestamp: string;
  visualCue: string;
  audioVoiceover: string;
  onScreenText: string;
  bRollPrompt?: string;
}

export interface VideoScript {
  title: string;
  platform: 'TikTok' | 'YouTube Shorts' | 'Instagram Reels';
  viralAngle: string;
  hookSeconds0To3: string;
  scenes: VideoScene[];
  callToAction: string;
  suggestedSoundTrack: string;
  estimatedRetentionRate: string;
}

export interface VideoStoryboardReport {
  coreViralThesis: string;
  recommendedPostingSchedule: string;
  scripts: VideoScript[];
}

export interface InfluencerCreatorProfile {
  tier: 'Nano (1k-10k)' | 'Micro (10k-50k)' | 'Mid (50k-250k)' | 'Macro (250k+)';
  niche: string;
  handleExample: string;
  estimatedCpm: string;
  expectedEngagementRate: string;
  fitScore: number;
  pitchAngle: string;
}

export interface InfluencerPrReport {
  campaignObjective: string;
  creatorTiers: InfluencerCreatorProfile[];
  outreachPitchTemplate: {
    subjectLine: string;
    body: string;
    followUpSnippet: string;
    sponsorshipContractTerms: string[];
  };
  pressReleaseDraft: {
    headline: string;
    subheadline: string;
    dateline: string;
    leadParagraph: string;
    executiveQuote: string;
    boilerplate: string;
  };
}

export interface PlgCommunityReport {
  kFactorViralityEngine: {
    currentEstimatedK: number;
    targetKFactor: number;
    optimizationVector: string;
    referralIncentiveStructure: string;
  };
  onboardingFrictionAudit: Array<{
    step: string;
    dropOffRisk: 'High' | 'Medium' | 'Low';
    timeToValue: string;
    solution: string;
  }>;
  communityPlaybook: {
    primaryPlatform: 'Discord' | 'Slack' | 'Circle';
    channelArchitecture: string[];
    weeklyRituals: string[];
    activation30DayChallenge: string;
  };
  churnPreventionTriggers: Array<{
    signal: string;
    riskLevel: 'Critical' | 'Warning';
    automatedAction: string;
  }>;
}

export interface LocalAsoReport {
  googleBusinessOptimization: {
    primaryCategory: string;
    secondaryCategories: string[];
    keywordRichBio: string;
    reviewGenerationStrategy: string;
  };
  appStoreMetadata: {
    appTitle: string;
    subtitle: string;
    keywordField: string;
    promoText: string;
    screenshotConcepts: Array<{ slide: number; headline: string; visualConcept: string }>;
  };
  localGeoGridRankings: Array<{
    radiusKm: string;
    targetNeighborhoods: string[];
    localCitationDirectories: string[];
    estimatedLocalPackRanking: string;
  }>;
}

export interface MarketingAnalysis {
  url: string;
  timestamp: string;
  ceo: CEOReport;
  seo: SEOReport;
  content: ContentReport;
  social: SocialReport;
  ads: AdReport;
  leadgen: LeadGenReport;
  email: EmailReport;
  geo?: GeoReport;
  video?: VideoStoryboardReport;
  influencer?: InfluencerPrReport;
  plg?: PlgCommunityReport;
  local?: LocalAsoReport;
}

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  description: string;
  systemPrompt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentId: string;
  timestamp: string;
}

export interface AgentReachQuery {
  query: string;
  platforms: Array<'twitter' | 'reddit' | 'youtube' | 'github' | 'bilibili'>;
  targetUrl?: string;
  industry?: string;
}

export interface AgentReachRedditPost {
  subreddit: string;
  title: string;
  author: string;
  upvotes: number;
  commentsCount: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  url: string;
  snippet: string;
  keyPainPoints: string[];
}

export interface AgentReachTwitterPost {
  author: string;
  handle: string;
  text: string;
  likes: number;
  retweets: number;
  impressions: string;
  viralScore: number;
  hashtags: string[];
  hookFormula: string;
}

export interface AgentReachYouTubeVideo {
  title: string;
  channel: string;
  views: string;
  published: string;
  duration: string;
  transcriptSummary: string;
  keyTimestamps: Array<{ time: string; topic: string }>;
  topTakeaway: string;
}

export interface AgentReachGitHubRepo {
  name: string;
  stars: string;
  forks: string;
  description: string;
  topIssues: string[];
  techStack: string[];
}

export interface AgentReachResults {
  query: string;
  timestamp: string;
  platformsAudited: string[];
  totalDataPoints: number;
  overallSentiment: {
    positive: number;
    neutral: number;
    negative: number;
    summary: string;
  };
  reddit: AgentReachRedditPost[];
  twitter: AgentReachTwitterPost[];
  youtube: AgentReachYouTubeVideo[];
  github: AgentReachGitHubRepo[];
  actionableHooks: Array<{
    platform: string;
    hook: string;
    targetPersona: string;
    recommendedAgent: 'Elena (Content)' | 'Chloe (Social)' | 'Alex (Ads)' | 'Sarah (Lead Gen)';
  }>;
}

export interface OmniRouteModel {
  id: string;
  name: string;
  provider: 'google' | 'anthropic' | 'openai' | 'deepseek' | 'meta' | 'mistral' | 'qwen' | 'kimi';
  contextWindow: string;
  latencyMs: number;
  costPer1kTokens: string;
  isFreeTier: boolean;
  tierQuotaTokensMonthly: string;
  status: 'active' | 'degraded' | 'rate-limited';
  supportedModalities: string[];
  recommendedUse: string;
}

export interface OmniRouteStrategy {
  id: string;
  name: string;
  description: string;
  badge: string;
  primaryModel: string;
  fallbackModels: string[];
  compressionLevel: 'none' | 'standard' | 'aggressive (Caveman RTK)';
  estLatency: string;
  estCostSavings: string;
}

export interface OmniRouteGatewayStatus {
  activeStrategy: string;
  totalMonthlyTokensRouted: string;
  freeTierTokensUtilized: string;
  costSavingsTotal: string;
  averageLatencyMs: number;
  compressionSavingsRate: string;
  activeFailoverChains: number;
  healthyProviders: number;
  totalProviders: number;
}

export interface RunStep {
  agentId: string;
  agentName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message: string;
  output?: string;
}

// ============================================================================
// SOCIAL MEDIA BRAND AUDIT & WHO/WHAT SPEAKS INTELLIGENCE INTERFACES
// ============================================================================

export interface BrandVoiceSpeaker {
  id: string;
  name: string;
  handle: string;
  platform: 'Twitter/X' | 'LinkedIn' | 'YouTube' | 'Reddit' | 'TikTok' | 'Instagram' | 'Substack';
  avatar: string;
  roleType: 'Superfan Advocate' | 'Industry Influencer' | 'Power Customer' | 'Constructive Critic' | 'Executive Voice' | 'Community Leader';
  influenceTier: 'Nano (1k-10k)' | 'Micro (10k-50k)' | 'Mid-Tier (50k-200k)' | 'Macro (200k+)' | 'Industry Luminary';
  followerCount: string;
  sentimentRating: 'High Positive' | 'Positive' | 'Neutral' | 'Mixed' | 'Critical';
  sentimentScore: number; // 0-100
  affinityScore: number; // 0-100
  keyThemesSpoken: string[];
  recentQuoteOrPost: string;
  reachMonthly: string;
  recommendedEngagementAction: string;
  verified: boolean;
}

export interface BrandNarrativeCluster {
  topic: string;
  volume: string;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  dominantTone: string;
  sampleKeywords: string[];
  topUserQuotes: string[];
  praisePoints: string[];
  frictionOrComplaintPoints: string[];
  actionRecommendation: string;
  velocityTrend: 'Surging (+48%)' | 'Growing (+18%)' | 'Stable' | 'Declining';
}

export interface BrandMentionItem {
  id: string;
  platform: 'Twitter/X' | 'LinkedIn' | 'YouTube' | 'Reddit' | 'TikTok' | 'Instagram' | 'HackerNews';
  author: string;
  authorHandle: string;
  authorAvatar: string;
  authorFollowers: string;
  content: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views: string;
  };
  keyTopics: string[];
  reachEstimated: string;
  url: string;
  aiSuggestedReply: string;
  isAddressed?: boolean;
}

export interface SocialPlatformAuditDetail {
  platform: 'Twitter/X' | 'LinkedIn' | 'Instagram' | 'YouTube' | 'TikTok' | 'Reddit' | 'Facebook';
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'Needs Attention';
  healthScore: number; // 0-100
  brandVoiceConsistency: number; // 0-100
  monthlyReach: string;
  engagementRate: string;
  postingFrequency: string;
  topPerformingContentFormat: string;
  audienceDemographics: string;
  strengths: string[];
  criticalGaps: string[];
  optimizationRoadmap: string[];
}

export interface SocialBrandAuditReport {
  brandName: string;
  url: string;
  timestamp: string;
  timeframeAudited: '7 Days' | '30 Days' | '90 Days';
  brandHealthScore: number; // 0-100
  netBrandSentimentScore: number; // -100 to +100
  totalMentionsAnalyzed: number;
  totalEstimatedReach: string;
  overallSentiment: {
    positive: number;
    neutral: number;
    negative: number;
    executiveSummary: string;
  };
  shareOfVoice: Array<{
    brand: string;
    sharePercentage: number;
    color: string;
    sentimentScore: number;
    isTargetBrand: boolean;
  }>;
  whoSpeaksForUs: {
    totalIdentifiedSpeakers: number;
    topAdvocatesCount: number;
    influencerReach: string;
    advocateList: BrandVoiceSpeaker[];
    criticsAndDetractorsList: BrandVoiceSpeaker[];
    audiencePersonas: Array<{
      personaName: string;
      percentageShare: number;
      coreMotivation: string;
      voiceStyle: string;
      primaryPlatform: string;
    }>;
  };
  whatTheySay: {
    narrativeClusters: BrandNarrativeCluster[];
    topPraiseReasons: Array<{ title: string; count: string; description: string }>;
    topComplaintReasons: Array<{ title: string; count: string; severity: 'High' | 'Medium' | 'Low'; remedy: string }>;
    trendingHashtags: Array<{ tag: string; mentions: string; sentiment: 'Positive' | 'Neutral' }>;
  };
  platformAudits: SocialPlatformAuditDetail[];
  riskAndCrisisAudit: {
    riskLevel: 'Low (Safe)' | 'Moderate' | 'Elevated' | 'Critical';
    activeRiskAlerts: Array<{
      title: string;
      riskFactor: string;
      severity: 'high' | 'medium' | 'low';
      mitigationStrategy: string;
    }>;
    brandSafetyScore: number;
  };
  liveMentionsFeed: BrandMentionItem[];
  actionPlan30Days: Array<{
    week: string;
    focus: string;
    tasks: string[];
    kpiTarget: string;
    assignedAgent: string;
  }>;
}
