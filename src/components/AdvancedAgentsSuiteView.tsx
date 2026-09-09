/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Search, Video, Award, Users, MapPin, 
  Copy, Check, RefreshCw, Send, Terminal, Play, ArrowRight,
  TrendingUp, Shield, Cpu, Layers, FileCode, Smartphone,
  CheckCircle2, AlertTriangle, MessageSquare, ExternalLink, HelpCircle, Zap
} from 'lucide-react';
import { 
  MarketingAnalysis, GeoReport, VideoStoryboardReport, 
  InfluencerPrReport, PlgCommunityReport, LocalAsoReport 
} from '../types';

interface AdvancedAgentsSuiteProps {
  analysisResult: MarketingAnalysis | null;
  onboardedUrl: string;
  onSelectAgentForChat?: (agentId: string) => void;
  optimizationMode?: string;
}

export default function AdvancedAgentsSuiteView({
  analysisResult,
  onboardedUrl,
  onSelectAgentForChat,
  optimizationMode = 'balanced'
}: AdvancedAgentsSuiteProps) {
  const [activeSpecialist, setActiveSpecialist] = useState<'geo' | 'video' | 'influencer' | 'plg' | 'local'>('geo');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeOutputTab, setActiveOutputTab] = useState<'blueprint' | 'interactive' | 'code'>('blueprint');

  const brandName = analysisResult?.ceo?.brandName || 'Your Brand';
  const url = analysisResult?.url || onboardedUrl || 'https://example.com';
  const industry = analysisResult?.ceo?.industry || 'Modern Digital Business';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Sample or active data for each specialist
  const geoData: GeoReport = analysisResult?.geo || {
    aiSearchEngineReadiness: 92,
    llmBrandPerception: 'High Authority',
    overviewShareOfVoice: {
      chatgpt: 38,
      perplexity: 54,
      googleAiOverview: 46,
      claude: 31
    },
    perplexityGaps: [
      {
        query: `Best autonomous marketing platform for ${industry}`,
        dominantSource: 'Reddit, G2, & TechCrunch',
        recommendedFix: 'Publish an authoritative entity comparison hub with structured Schema.org markup',
        priority: 'Critical'
      },
      {
        query: `How does ${brandName} compare to traditional marketing agencies`,
        dominantSource: 'Product Hunt & Medium',
        recommendedFix: 'Establish verified Knowledge Graph node with sameAs Wikidata references',
        priority: 'High'
      },
      {
        query: `${brandName} pricing, reviews, and ROI benchmarks`,
        dominantSource: 'Trustpilot & Capterra',
        recommendedFix: 'Syndicate structured FAQ schema with verified customer ROI data points',
        priority: 'Medium'
      }
    ],
    entitySchemaMarkup: {
      schemaType: 'SoftwareApplication & Organization',
      jsonLd: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": brandName,
        "url": url,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": analysisResult?.ceo?.positioning || `Autonomous AI marketing operating system for ${industry}.`,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "publisher": {
          "@type": "Organization",
          "name": brandName,
          "url": url,
          "sameAs": [
            `https://twitter.com/${brandName.toLowerCase().replace(/\s+/g, '')}`,
            `https://linkedin.com/company/${brandName.toLowerCase().replace(/\s+/g, '')}`
          ]
        }
      }, null, 2),
      explanation: 'Inject this JSON-LD script into your index.html <head> tag to ensure ChatGPT, Perplexity, and Gemini identify your brand entity with 100% accuracy.'
    },
    digitalPrCitationRoadmap: [
      {
        publication: 'VentureBeat & TechCrunch',
        targetTopic: `The Shift to Multi-Agent Workforces in ${industry}`,
        authorityImpact: '+32% Perplexity & SearchGPT citation share',
        semanticEntity: 'Core Category Pioneer'
      },
      {
        publication: 'Substack Thought Leaders (Lenny / Stratechery)',
        targetTopic: `Deconstructing Unit Economics in Autonomous Marketing`,
        authorityImpact: '+24% Google AI Overview visibility',
        semanticEntity: 'Standard Industry Benchmark'
      },
      {
        publication: 'Hacker News & Product Hunt Reviews',
        targetTopic: 'Architecture breakdown of multi-model routing',
        authorityImpact: '+40% Claude & OpenAI Deep Research citations',
        semanticEntity: 'Technical Reference Architecture'
      }
    ]
  };

  const videoData: VideoStoryboardReport = analysisResult?.video || {
    coreViralThesis: 'Expose the painful bottleneck of legacy 30-day agency retainers and reveal the 60-second autonomous alternative.',
    recommendedPostingSchedule: 'Daily at 12:30 PM & 7:15 PM EST (Peak B2B & Creator engagement windows)',
    scripts: [
      {
        title: 'The 30-Day Agency Scam vs. The 60-Second Reality',
        platform: 'TikTok',
        viralAngle: 'Negative hook + dramatic speed comparison',
        hookSeconds0To3: 'If your marketing agency is still charging you $5k/month and taking 3 weeks to write an email, watch this.',
        scenes: [
          {
            timestamp: '0:00 - 0:03',
            visualCue: 'Fast punch-in zoom onto a person looking at an inflated agency invoice with shock',
            audioVoiceover: 'If your marketing agency is charging you $5,000 a month and taking 3 weeks to write a sequence, stop.',
            onScreenText: 'STOP Paying Agency Retainers 🛑',
            bRollPrompt: 'Close up stressed founder staring at laptop invoice'
          },
          {
            timestamp: '0:03 - 0:14',
            visualCue: 'Split screen: Left side shows slow agency typing; Right side shows AI workforce generating 15 campaigns in 8 seconds',
            audioVoiceover: 'Watch what happens when 15 specialized AI agents build an entire SEO audit, ad campaigns, and video storyboards in 8 seconds.',
            onScreenText: 'Agency (30 Days) ❌ vs AI Workforce (8s) ⚡',
            bRollPrompt: 'Sleek high-tech UI screen recording with rapid terminal activity'
          },
          {
            timestamp: '0:14 - 0:28',
            visualCue: 'Demonstration of 1-click Google Workspace export to Docs, Gmail, and Sheets',
            audioVoiceover: 'Every deliverable exports straight into Google Docs and Gmail with one click.',
            onScreenText: '1-Click Workspace Export 🚀',
            bRollPrompt: 'Seamless workflow UI animation with green success indicators'
          },
          {
            timestamp: '0:28 - 0:35',
            visualCue: 'Founder smiling, holding phone showing live lead alerts',
            audioVoiceover: 'Try it right now for your brand at the link in bio.',
            onScreenText: 'Claim Your Free Campaign 🔗',
            bRollPrompt: 'Clean minimalist home office aesthetic with upward trending graph'
          }
        ],
        callToAction: 'Tap the link in bio to generate your free 15-agent campaign right now.',
        suggestedSoundTrack: 'Trending Synthwave Bassline / Aggressive Phonk (128 BPM)',
        estimatedRetentionRate: '72% Average Watch Time'
      },
      {
        title: '3 Secret Growth Weapons Elite Startups Won\'t Share',
        platform: 'YouTube Shorts',
        viralAngle: 'Curiosity gap + Insider playbook reveal',
        hookSeconds0To3: 'Here are 3 secret growth tools that top 1% startups are using to replace entire marketing teams.',
        scenes: [
          {
            timestamp: '0:00 - 0:04',
            visualCue: 'Futuristic countdown overlay with pulsing neon HUD graphics',
            audioVoiceover: 'Here are 3 secret growth tools that top 1% startups are using to replace entire marketing teams.',
            onScreenText: 'Top 1% Growth Secret 🤫',
            bRollPrompt: 'Futuristic digital wireframe hologram'
          },
          {
            timestamp: '0:04 - 0:18',
            visualCue: 'Rapid 3-point feature highlights with snappy sound effects',
            audioVoiceover: 'Number one: Generative Engine Optimization for Perplexity and SearchGPT. Number two: Omni-model intelligent routing.',
            onScreenText: '1. GEO Citations 2. Smart Routing ⚡',
            bRollPrompt: 'Visual diagrams of AI search citations and LLM neural networks'
          },
          {
            timestamp: '0:18 - 0:30',
            visualCue: 'Live dashboard reveal of ${brandName}',
            audioVoiceover: 'And number three: Deploying ${brandName} to run your multi-agent strategy autonomously.',
            onScreenText: `3. ${brandName} Operating System 🚀`,
            bRollPrompt: 'Interactive dashboard UI scrolling smoothly'
          }
        ],
        callToAction: 'Subscribe and tap the link in the description for the full blueprint.',
        suggestedSoundTrack: 'Cyberpunk Lo-Fi Chillwave',
        estimatedRetentionRate: '78% Average Watch Time'
      }
    ]
  };

  const influencerData: InfluencerPrReport = analysisResult?.influencer || {
    campaignObjective: `Position ${brandName} as the default category benchmark in ${industry} through high-trust creator endorsements and syndicated media coverage.`,
    creatorTiers: [
      {
        tier: 'Micro (10k-50k)',
        niche: 'Tech Reviewers & Startup Builders',
        handleExample: '@buildinpublic_daily / @growthtools_review',
        estimatedCpm: '$25 - $35 CPM',
        expectedEngagementRate: '5.2%',
        fitScore: 98,
        pitchAngle: 'Early VIP lifetime access + 30% recurring affiliate rev-share + audience exclusive free campaign tier.'
      },
      {
        tier: 'Mid (50k-250k)',
        niche: 'B2B SaaS & Productivity Creators',
        handleExample: '@saas_founder_hub / @aitools_unlocked',
        estimatedCpm: '$45 - $60 CPM',
        expectedEngagementRate: '3.8%',
        fitScore: 94,
        pitchAngle: 'Dedicated 60-second native sponsor segment showcasing live AI campaign generation.'
      },
      {
        tier: 'Macro (250k+)',
        niche: 'Enterprise AI & Business Strategy Influencers',
        handleExample: '@the_ai_executive / @future_of_work',
        estimatedCpm: '$70 - $90 CPM',
        expectedEngagementRate: '2.4%',
        fitScore: 89,
        pitchAngle: 'Keynote sponsorship & in-depth co-branded whitepaper case study.'
      }
    ],
    outreachPitchTemplate: {
      subjectLine: `Collab with ${brandName}: Loved your breakdown on growth automation`,
      body: `Hi [Creator Name],\n\nI’ve been following your recent breakdowns on tech and workflow scaling—especially your insights on reducing operational bloat.\n\nWe built ${brandName} (${url}) to solve this exact bottleneck. Our platform allows founders to deploy 15 specialized AI marketing agents in 60 seconds.\n\nWe’d love to partner with you for a dedicated segment on your channel this month. We offer competitive upfront sponsorship rates + a 30% lifetime recurring rev-share for your community.\n\nWould you be open to checking out a complimentary VIP account this week?\n\nBest regards,\nVivienne Sterling\nHead of Partnerships & Brand PR, ${brandName}`,
      followUpSnippet: `Hey [Creator Name], following up on this—we just reserved a dedicated promo code for your audience if you'd like to test the platform first!`,
      sponsorshipContractTerms: [
        '1x Dedicated 60-second video integration or 2x short-form mentions',
        '30-day link in bio discount code exclusivity',
        'Whitelisting permissions for Meta & TikTok Spark Ads for 60 days'
      ]
    },
    pressReleaseDraft: {
      headline: `${brandName} Unveils Autonomous Multi-Agent Marketing Operating System to Transform ${industry}`,
      subheadline: 'New platform coordinates 15 specialized AI agents to deliver full-scale marketing campaigns, SEO audits, and direct Google Workspace publishing in seconds.',
      dateline: 'SAN FRANCISCO, CA',
      leadParagraph: `${brandName}, an innovator in autonomous growth technologies, today announced the public availability of its AI Marketing Operating System. The platform empowers modern teams to orchestrate comprehensive, multi-channel growth campaigns with zero manual agency overhead.`,
      executiveQuote: `"Modern growth teams shouldn't have to juggle fragmented software stacks and bloated retainers to acquire customers," said leadership at ${brandName}. "By uniting 15 specialized agents into an synchronized workflow with direct Google Workspace export, we make enterprise-grade marketing execution instantaneous."`,
      boilerplate: `About ${brandName}: ${brandName} is a next-generation marketing orchestration engine delivering autonomous market analysis, SEO optimization, and omnichannel campaign execution. To learn more, visit ${url}.`
    }
  };

  const plgData: PlgCommunityReport = analysisResult?.plg || {
    kFactorViralityEngine: {
      currentEstimatedK: 0.58,
      targetKFactor: 1.35,
      optimizationVector: 'Double-sided viral referral loop triggered right after the user exports their first successful marketing dossier to Google Workspace (Aha! Milestone).',
      referralIncentiveStructure: 'Give $30 / Get $30 credit or Unlock unlimited multi-model LLM generation for both parties when 2 colleagues join.'
    },
    onboardingFrictionAudit: [
      {
        step: 'Account Creation & Onboarding',
        dropOffRisk: 'Low',
        timeToValue: '< 20 seconds',
        solution: 'Instant Google 1-Tap sign-in with zero mandatory upfront billing friction.'
      },
      {
        step: 'First Campaign Generation (Aha! Moment)',
        dropOffRisk: 'Medium',
        timeToValue: '45 seconds',
        solution: 'Live 3D animated visual agent progress cards keep user engaged during multi-agent synthesis.'
      },
      {
        step: 'Google Workspace Export',
        dropOffRisk: 'Low',
        timeToValue: '15 seconds',
        solution: '1-click OAuth modal with instant direct preview links to generated Google Docs and Sheets.'
      }
    ],
    communityPlaybook: {
      primaryPlatform: 'Discord',
      channelArchitecture: [
        '#welcome-start-here (Automated onboarding bot with custom role selection)',
        '#growth-wins-showcase (Members share real conversion results and ROI screenshots)',
        '#prompt-engineering-vault (Weekly high-performing marketing prompts and formulas)',
        '#feature-requests-board (Upvoted community roadmap items)',
        '#vip-founders-lounge (Exclusive networking for active growth leaders)'
      ],
      weeklyRituals: [
        'Monday: "Metric of the Week" Breakdown & Strategy AMA',
        'Wednesday: Live Campaign Teardowns & Optimization Roast',
        'Friday: Community Wins Celebration & Top Contributor Credit Drops'
      ],
      activation30DayChallenge: 'The 30-Day Growth Sprint: Ship 1 autonomous marketing campaign every week, share live metrics in Discord, and the top-performing brand wins $2,500 in platform credits.'
    },
    churnPreventionTriggers: [
      {
        signal: 'User has not created a new campaign in 14 days',
        riskLevel: 'Warning',
        automatedAction: 'Send automated email from Founder offering tailored strategy review + pre-populated industry prompt template.'
      },
      {
        signal: 'Export frequency drops by >50% over a 30-day window',
        riskLevel: 'Critical',
        automatedAction: 'Trigger in-app notification offering a free 1-on-1 workflow optimization session with Dr. Aris Thorne (GEO Agent).'
      }
    ]
  };

  const localData: LocalAsoReport = analysisResult?.local || {
    googleBusinessOptimization: {
      primaryCategory: `${industry} Software & Marketing Consultant`,
      secondaryCategories: ['Internet Marketing Service', 'Advertising Agency', 'Business Management Consultant'],
      keywordRichBio: `Official verified profile for ${brandName}. Empowering founders and digital businesses with autonomous multi-agent marketing operations, SEO dominance, and high-conversion customer acquisition. Serving clients globally with 24/7 autonomous support.`,
      reviewGenerationStrategy: 'Automated SMS/Email review request sent 24 hours after a customer generates and exports their first campaign, with direct 5-star Google review deep link.'
    },
    appStoreMetadata: {
      appTitle: `${brandName}: AI Marketing Agency`,
      subtitle: 'Autonomous Growth & Ads Suite',
      keywordField: 'marketing,seo,social media,growth,analytics,ads,funnel,email automation,crm,lead gen,ai agent',
      promoText: 'Launch and scale your entire digital marketing strategy in 60 seconds with 15 specialized AI agents.',
      screenshotConcepts: [
        { slide: 1, headline: 'Your 15-Agent Marketing Workforce', visualConcept: 'Live dashboard showing all 15 agents analyzing in parallel' },
        { slide: 2, headline: '1-Click Google Workspace Export', visualConcept: 'Instant export to Google Docs, Gmail, Sheets, and Slides' },
        { slide: 3, headline: 'Predictive ROI & Revenue Models', visualConcept: 'High-contrast chart showing 4.8x ROI projections' }
      ]
    },
    localGeoGridRankings: [
      {
        radiusKm: '5km Core Metro',
        targetNeighborhoods: ['Downtown Financial District', 'Tech Innovation Corridor', 'Creative District'],
        localCitationDirectories: ['Google Maps', 'Apple Maps', 'Yelp for Business', 'Bing Places', 'YellowPages'],
        estimatedLocalPackRanking: 'Rank #1 - #2 in Local 3-Pack'
      },
      {
        radiusKm: '25km Regional Zone',
        targetNeighborhoods: ['Greater Metropolitan Area', 'Suburban Innovation Hubs'],
        localCitationDirectories: ['BBB', 'Foursquare', 'Chamber of Commerce', 'Nextdoor Business'],
        estimatedLocalPackRanking: 'Rank #2 - #4 in Regional Search'
      }
    ]
  };

  const specialists = [
    {
      id: 'geo' as const,
      name: 'Dr. Aris Thorne',
      role: 'GEO & AI Search Director',
      category: 'SEO & Research',
      avatar: '🔬',
      color: 'teal',
      tagline: 'Perplexity, SearchGPT & LLM Citations',
      desc: 'Reverse-engineers conversational AI algorithms for maximum brand visibility in Perplexity, ChatGPT, and Gemini.'
    },
    {
      id: 'video' as const,
      name: 'Jordan Brooks',
      role: 'Short-Form Video Director',
      category: 'Content & Creative',
      avatar: '🎬',
      color: 'rose',
      tagline: 'TikTok, Shorts & Reels Storyboards',
      desc: 'Directs second-by-second viral video scripts with hook psychology, B-roll prompts, and on-screen dynamic text.'
    },
    {
      id: 'influencer' as const,
      name: 'Vivienne Sterling',
      role: 'Influencer & Brand PR Architect',
      category: 'Acquisition & Advertising',
      avatar: '💎',
      color: 'fuchsia',
      tagline: 'Creator Discovery & Press Syndication',
      desc: 'Engineers creator partnership discovery, personalized pitch emails, and AP-style press releases.'
    },
    {
      id: 'plg' as const,
      name: 'Zoe Zhang',
      role: 'PLG & Community Architect',
      category: 'Funnel & CRM Desk',
      avatar: '🚀',
      color: 'emerald',
      tagline: 'K-Factor Virality & Discord Rituals',
      desc: 'Designs product-led viral loops, friction drop-off audits, and 30-day community activation playbooks.'
    },
    {
      id: 'local' as const,
      name: 'Kai Nakamura',
      role: 'Local GEO & ASO Director',
      category: 'SEO & Research',
      avatar: '📍',
      color: 'amber',
      tagline: 'Google Maps 3-Pack & App Store Density',
      desc: 'Dominates local Google Business Profile map packs and optimizes Apple App Store & Google Play metadata.'
    }
  ];

  const currentSpecialist = specialists.find(s => s.id === activeSpecialist)!;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Top Header Card */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Advanced Autonomous Workforce Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Specialist Strategy Workbench
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
              Deep-dive into specialized marketing disciplines: Generative Engine Optimization (GEO), viral short-form video storyboards, creator PR outreach, product-led virality loops, and local ASO.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectAgentForChat && onSelectAgentForChat(activeSpecialist)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              Consult {currentSpecialist.name.split(' ')[0]} in Chat
            </button>
          </div>
        </div>

        {/* Specialist Selector Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8 pt-6 border-t border-slate-800/60">
          {specialists.map(specialist => {
            const isSelected = activeSpecialist === specialist.id;
            return (
              <button
                key={specialist.id}
                onClick={() => setActiveSpecialist(specialist.id)}
                className={`flex flex-col text-left p-3.5 rounded-xl transition-all duration-200 border relative ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-500/5 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700/60'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                )}
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-xl">{specialist.avatar}</span>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {specialist.category.split(' ')[0]}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-100 truncate">
                  {specialist.name}
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">
                  {specialist.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Specialist Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Specialist Identity Card & Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl shadow-inner border border-slate-700/50">
                {currentSpecialist.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {currentSpecialist.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-1 truncate">
                  {currentSpecialist.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {currentSpecialist.role}
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm mt-4 leading-relaxed border-t border-slate-800/60 pt-4">
              {currentSpecialist.desc}
            </p>

            {/* Specialist Quick Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-2">
              <button
                onClick={() => onSelectAgentForChat && onSelectAgentForChat(activeSpecialist)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors border border-slate-700/50"
              >
                <span className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Ask custom {activeSpecialist.toUpperCase()} questions
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Quick Context Summary */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Active Workspace Target
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Brand Name:</span>
                <span className="text-slate-200 font-medium">{brandName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Target Domain:</span>
                <span className="text-cyan-400 font-mono truncate max-w-[160px]">{url}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Industry:</span>
                <span className="text-slate-200">{industry}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Optimization Mode:</span>
                <span className="text-emerald-400 uppercase font-medium">{optimizationMode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Specialist Deliverable View */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Output Mode Switcher */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveOutputTab('blueprint')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeOutputTab === 'blueprint'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                Strategy Blueprint
              </button>
              <button
                onClick={() => setActiveOutputTab('interactive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeOutputTab === 'interactive'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                Interactive Tooling
              </button>
              <button
                onClick={() => setActiveOutputTab('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeOutputTab === 'code'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                Code / Schema Export
              </button>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live AI Model Ready
            </div>
          </div>

          {/* TAB 1: GEO & AI Search Citation Director */}
          {activeSpecialist === 'geo' && (
            <div className="space-y-6">
              
              {/* Top GEO Metric Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
                  <div className="text-xs text-slate-400 font-medium">AI Search Readiness</div>
                  <div className="text-2xl font-bold text-teal-400 mt-1 flex items-baseline gap-2">
                    {geoData.aiSearchEngineReadiness}/100
                    <span className="text-xs text-emerald-400 font-normal">Top 8%</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Perplexity & SearchGPT readiness</div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
                  <div className="text-xs text-slate-400 font-medium">LLM Brand Perception</div>
                  <div className="text-xl font-bold text-slate-100 mt-1">
                    {geoData.llmBrandPerception}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Semantic Knowledge Graph node</div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
                  <div className="text-xs text-slate-400 font-medium">Perplexity Share of Voice</div>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">
                    {geoData.overviewShareOfVoice.perplexity}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Target query presence</div>
                </div>
              </div>

              {/* Perplexity Search Prompt Gaps */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-teal-400" />
                    AI Search Prompt Gap Analysis
                  </h3>
                  <span className="text-xs text-slate-400">Targeting Perplexity & SearchGPT</span>
                </div>

                <div className="space-y-3">
                  {geoData.perplexityGaps.map((gap, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-200">
                          "{gap.query}"
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                          gap.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          gap.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}>
                          {gap.priority}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                        <div>
                          <span className="text-slate-500">Current AI Sources: </span>
                          <span className="text-slate-300 font-medium">{gap.dominantSource}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Action: </span>
                          <span className="text-teal-300">{gap.recommendedFix}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital PR Entity Citations */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-teal-400" />
                  Digital PR & Knowledge Graph Citation Roadmap
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {geoData.digitalPrCitationRoadmap.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
                          {item.semanticEntity}
                        </div>
                        <div className="text-sm font-bold text-slate-100 mb-2">
                          {item.publication}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {item.targetTopic}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs font-medium text-emerald-400">
                        {item.authorityImpact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON-LD Schema.org Generator */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-teal-400" />
                    Schema.org JSON-LD Knowledge Graph Entity
                  </h3>
                  <button
                    onClick={() => copyToClipboard(geoData.entitySchemaMarkup.jsonLd, 'schema')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700/60"
                  >
                    {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'schema' ? 'Copied!' : 'Copy JSON-LD'}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  {geoData.entitySchemaMarkup.explanation}
                </p>
                <pre className="p-4 rounded-xl bg-slate-950 text-teal-300 font-mono text-xs overflow-x-auto border border-slate-800/80 max-h-56">
                  {geoData.entitySchemaMarkup.jsonLd}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: Short-Form Video & Viral Storyboards */}
          {activeSpecialist === 'video' && (
            <div className="space-y-6">
              
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Video className="w-4 h-4 text-rose-400" />
                      Viral Short-Form Video Production Blueprint
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Frame-by-frame retention scripts formatted for TikTok, YouTube Shorts, & Instagram Reels.
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                    {videoData.recommendedPostingSchedule}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 mb-6">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Core Viral Angle:</span>
                  <p className="text-sm text-slate-200 mt-1 italic">
                    "{videoData.coreViralThesis}"
                  </p>
                </div>

                {/* Video Scripts */}
                <div className="space-y-6">
                  {videoData.scripts.map((script, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                              {script.platform}
                            </span>
                            <h4 className="text-base font-bold text-white">
                              {script.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            <span className="text-slate-500">Angle:</span> {script.viralAngle} • <span className="text-emerald-400 font-medium">{script.estimatedRetentionRate}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(script, null, 2), `script-${idx}`)}
                          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700/60"
                        >
                          {copiedKey === `script-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          Copy Script
                        </button>
                      </div>

                      {/* 0-3s Hook */}
                      <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
                        <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          0-3s Scroll-Stopping Hook Formula:
                        </div>
                        <div className="text-sm text-slate-100 font-medium">
                          "{script.hookSeconds0To3}"
                        </div>
                      </div>

                      {/* Scene Breakdown */}
                      <div className="space-y-2.5">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Storyboard Scenes & Prompts:
                        </div>
                        {script.scenes.map((scene, sIdx) => (
                          <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800/40 text-xs">
                            <div className="sm:col-span-2 font-mono font-bold text-rose-400">
                              {scene.timestamp}
                            </div>
                            <div className="sm:col-span-5 space-y-1">
                              <span className="text-slate-500 font-medium">Visual:</span>
                              <p className="text-slate-300">{scene.visualCue}</p>
                              {scene.bRollPrompt && (
                                <p className="text-[11px] text-cyan-400/90 font-mono mt-0.5">🎬 B-Roll: {scene.bRollPrompt}</p>
                              )}
                            </div>
                            <div className="sm:col-span-5 space-y-1">
                              <span className="text-slate-500 font-medium">Voiceover & Text:</span>
                              <p className="text-slate-200 italic">"{scene.audioVoiceover}"</p>
                              <p className="text-[11px] text-amber-400 font-semibold mt-0.5">📝 Overlay: {scene.onScreenText}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/40 gap-2">
                        <div>
                          <span className="text-slate-500">CTA: </span>
                          <span className="text-slate-200 font-medium">{script.callToAction}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Audio Track: </span>
                          <span className="text-rose-400">{script.suggestedSoundTrack}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Influencer Partnerships & Brand PR */}
          {activeSpecialist === 'influencer' && (
            <div className="space-y-6">
              
              {/* Creator Tiers */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-fuchsia-400" />
                  Creator Discovery & Sponsorship Tiers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {influencerData.creatorTiers.map((tier, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-fuchsia-400">{tier.tier}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Fit: {tier.fitScore}%
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-100">
                          {tier.niche}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {tier.handleExample}
                        </div>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {tier.pitchAngle}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-800/60 flex justify-between text-xs text-slate-400">
                        <span>CPM: <strong className="text-slate-200">{tier.estimatedCpm}</strong></span>
                        <span>Eng: <strong className="text-emerald-400">{tier.expectedEngagementRate}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalized Outreach Pitch Email */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-fuchsia-400" />
                      High-Converting Creator Pitch Template
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Subject: <span className="text-fuchsia-300 font-mono">{influencerData.outreachPitchTemplate.subjectLine}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(influencerData.outreachPitchTemplate.body, 'pitch')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700/60"
                  >
                    {copiedKey === 'pitch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Pitch
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 text-slate-300 text-xs leading-relaxed font-sans whitespace-pre-wrap border border-slate-800/80">
                  {influencerData.outreachPitchTemplate.body}
                </div>
              </div>

              {/* Syndication Press Release Draft */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-fuchsia-400" />
                    AP-Style Syndicated Press Release Draft
                  </h3>
                  <button
                    onClick={() => copyToClipboard(
                      `${influencerData.pressReleaseDraft.headline}\n\n${influencerData.pressReleaseDraft.leadParagraph}\n\n${influencerData.pressReleaseDraft.executiveQuote}\n\n${influencerData.pressReleaseDraft.boilerplate}`,
                      'pr'
                    )}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700/60"
                  >
                    {copiedKey === 'pr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Press Release
                  </button>
                </div>
                <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3 text-xs leading-relaxed">
                  <h4 className="text-sm font-bold text-white">
                    {influencerData.pressReleaseDraft.headline}
                  </h4>
                  <p className="text-slate-400 italic">
                    {influencerData.pressReleaseDraft.subheadline}
                  </p>
                  <div className="text-slate-300">
                    <strong className="text-fuchsia-400">{influencerData.pressReleaseDraft.dateline}</strong> — {influencerData.pressReleaseDraft.leadParagraph}
                  </div>
                  <blockquote className="p-3 border-l-2 border-fuchsia-500 bg-slate-900/40 text-slate-200 italic">
                    {influencerData.pressReleaseDraft.executiveQuote}
                  </blockquote>
                  <div className="pt-2 text-slate-500 border-t border-slate-800/60">
                    {influencerData.pressReleaseDraft.boilerplate}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Product-Led Growth & Virality */}
          {activeSpecialist === 'plg' && (
            <div className="space-y-6">
              
              {/* K-Factor Virality Engine */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    K-Factor Virality Coefficient & Referral Loops
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Target K = {plgData.kFactorViralityEngine.targetKFactor} (Super-Viral)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Virality Vector:</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {plgData.kFactorViralityEngine.optimizationVector}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Referral Incentive:</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {plgData.kFactorViralityEngine.referralIncentiveStructure}
                    </p>
                  </div>
                </div>
              </div>

              {/* Onboarding Friction Audit */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Time-to-Value (TTV) Onboarding Friction Audit
                </h3>
                <div className="space-y-3">
                  {plgData.onboardingFrictionAudit.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{step.step}</div>
                        <p className="text-slate-400 mt-0.5">{step.solution}</p>
                      </div>
                      <div className="flex items-center gap-4 text-right self-end sm:self-center shrink-0">
                        <div>
                          <span className="text-slate-500">TTV: </span>
                          <span className="text-emerald-400 font-medium">{step.timeToValue}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          step.dropOffRisk === 'High' ? 'bg-rose-500/20 text-rose-300' :
                          step.dropOffRisk === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {step.dropOffRisk} Risk
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Playbook & Rituals */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-emerald-400" />
                  {plgData.communityPlaybook.primaryPlatform} Community Playbook & Rituals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Channel Architecture:</span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {plgData.communityPlaybook.channelArchitecture.map((ch, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-cyan-400">#</span>
                          {ch}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Weekly Rituals:</span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {plgData.communityPlaybook.weeklyRituals.map((r, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Local GEO & App Store Optimization */}
          {activeSpecialist === 'local' && (
            <div className="space-y-6">
              
              {/* Google Business Profile Optimizer */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Google Business Profile (GBP) Local Map Pack Optimizer
                </h3>
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500">Primary Category: </span>
                    <span className="text-amber-400 font-bold">{localData.googleBusinessOptimization.primaryCategory}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Secondary Categories: </span>
                    <span className="text-slate-300">{localData.googleBusinessOptimization.secondaryCategories.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Optimized Keyword Bio:</span>
                    <p className="text-slate-200 bg-slate-900 p-3 rounded-lg leading-relaxed border border-slate-800/60">
                      {localData.googleBusinessOptimization.keywordRichBio}
                    </p>
                  </div>
                  <div className="text-slate-400 pt-1">
                    <strong className="text-slate-300">5-Star Review Engine: </strong>
                    {localData.googleBusinessOptimization.reviewGenerationStrategy}
                  </div>
                </div>
              </div>

              {/* App Store Metadata Density */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    Apple App Store & Google Play Metadata Suite
                  </h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(localData.appStoreMetadata, null, 2), 'aso')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700/60"
                  >
                    {copiedKey === 'aso' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy ASO Package
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-500">App Title (30 Chars):</span>
                    <div className="text-slate-100 font-bold mt-0.5">{localData.appStoreMetadata.appTitle}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-500">Subtitle (30 Chars):</span>
                    <div className="text-slate-100 font-bold mt-0.5">{localData.appStoreMetadata.subtitle}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs mb-4">
                  <span className="text-slate-500">100-Character Keyword Field:</span>
                  <div className="text-amber-400 font-mono mt-1 break-all">
                    {localData.appStoreMetadata.keywordField}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Screenshot Storyboard Concepts:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {localData.appStoreMetadata.screenshotConcepts.map((slide, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/40 text-xs">
                        <div className="text-amber-400 font-bold mb-1">Slide #{slide.slide}</div>
                        <div className="text-white font-semibold mb-1">{slide.headline}</div>
                        <p className="text-slate-400 text-[11px]">{slide.visualConcept}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Local Geo-Grid Target Rankings */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Local Neighborhood Geo-Grid Map Pack Rankings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {localData.localGeoGridRankings.map((grid, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400">{grid.radiusKm}</span>
                        <span className="text-emerald-400 font-semibold">{grid.estimatedLocalPackRanking}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Target Zones: </span>
                        <span className="text-slate-200">{grid.targetNeighborhoods.join(', ')}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-800/60 text-slate-400">
                        <span className="text-slate-500">Citations: </span>
                        {grid.localCitationDirectories.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
