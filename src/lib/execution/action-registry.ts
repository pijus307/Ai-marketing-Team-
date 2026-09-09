/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProviderManager } from '../ai/provider-manager';

export interface ActionDefinition {
  id: string;
  category: 'Website' | 'SEO' | 'Content' | 'Advertising' | 'Email' | 'Lead Generation' | 'Reporting';
  name: string;
  description: string;
  estimatedTimeSec: number;
}

export const ACTIONS: ActionDefinition[] = [
  // Website
  { id: 'web_publish_blog', category: 'Website', name: 'Publish Blog Article', description: 'Publishes a fully drafted SEO blog post to CMS (e.g., WordPress, Shopify, Webflow)', estimatedTimeSec: 8 },
  { id: 'web_update_landing', category: 'Website', name: 'Update Landing Page Layout', description: 'Overwrites HTML structures and visual blocks of active CTA landing page templates', estimatedTimeSec: 12 },
  { id: 'web_update_metadata', category: 'Website', name: 'Update Site Meta Header Tags', description: 'Pushes semantic keyword title and description tag changes live to CMS config', estimatedTimeSec: 5 },
  { id: 'web_gen_faq', category: 'Website', name: 'Generate Dynamic FAQ Section', description: 'Synthesizes and mounts reactive question-and-answer toggle boxes based on user intent', estimatedTimeSec: 6 },
  { id: 'web_gen_schema', category: 'Website', name: 'Generate JSON-LD Schema Markup', description: 'Creates structured entity tags, LocalBusiness markup, or Article schema descriptors', estimatedTimeSec: 4 },

  // SEO
  { id: 'seo_tech_report', category: 'SEO', name: 'Generate Technical SEO Report', description: 'Crawls active site and creates high-priority technical indexing remediation logs', estimatedTimeSec: 10 },
  { id: 'seo_opt_checklist', category: 'SEO', name: 'Create SEO Optimization Checklist', description: 'Compiles actionable content density, keyword tracking, and tag placement directives', estimatedTimeSec: 6 },
  { id: 'seo_internal_links', category: 'SEO', name: 'Generate Internal Linking Suggestions', description: 'Determines high-equity semantic context pathways to distribute site domain authority', estimatedTimeSec: 8 },
  { id: 'seo_backlink_list', category: 'SEO', name: 'Create Backlink Outreach Pitch List', description: 'Identifies high DA websites in your industry and compiles personalized pitch ideas', estimatedTimeSec: 11 },

  // Content
  { id: 'content_write_blog', category: 'Content', name: 'Generate blog articles', description: 'Drafts highly human-like engaging longform blog articles targeting priority keywords', estimatedTimeSec: 15 },
  { id: 'content_newsletter', category: 'Content', name: 'Generate newsletters', description: 'Creates transactional newsletter updates containing recent sector alerts and deals', estimatedTimeSec: 10 },
  { id: 'content_product_desc', category: 'Content', name: 'Generate product descriptions', description: 'Optimizes e-commerce service descriptors for increased visual appeal and search indexing', estimatedTimeSec: 7 },
  { id: 'content_social_posts', category: 'Content', name: 'Generate social media posts', description: 'Writes scroll-stopping post captions with hashtags and midjourney image prompts', estimatedTimeSec: 9 },

  // Advertising
  { id: 'ads_google', category: 'Advertising', name: 'Create Google Ads Drafts', description: 'Formats responsive Google Search ad copy variants, headlines, and targeted CTR modifiers', estimatedTimeSec: 7 },
  { id: 'ads_meta', category: 'Advertising', name: 'Create Meta Ads Drafts', description: 'Drafts highly engaging PAS ad copy, primary hooks, headlines, and carousel prompts', estimatedTimeSec: 8 },
  { id: 'ads_linkedin', category: 'Advertising', name: 'Create LinkedIn Ads Drafts', description: 'Designs high-conversion b2b sponsored content snippets and headline lead cards', estimatedTimeSec: 9 },
  { id: 'ads_youtube', category: 'Advertising', name: 'Create YouTube Ads Drafts', description: 'Outlines comprehensive 30-second and 15-second visual video script flowboards', estimatedTimeSec: 12 },

  // Email
  { id: 'email_welcome_flow', category: 'Email', name: 'Generate Welcome Autoresponder Sequence', description: 'Writes a 3-part sequence of automated brand greeting and offer emails', estimatedTimeSec: 12 },
  { id: 'email_nurture_flow', category: 'Email', name: 'Generate Nurture Sequence Flow', description: 'Prepares comprehensive lead educational drip sequences to convert cold trials', estimatedTimeSec: 14 },
  { id: 'email_promo_flow', category: 'Email', name: 'Generate Promotional Campaign Copy', description: 'Builds urgent scarcity copy for flash sales, seasonal events, or special coupons', estimatedTimeSec: 10 },

  // Lead Generation
  { id: 'leadgen_landing_page', category: 'Lead Generation', name: 'Generate Landing Page Copy', description: 'Writes direct response headlines, trust signals, and pricing block structures', estimatedTimeSec: 12 },
  { id: 'leadgen_magnet', category: 'Lead Generation', name: 'Generate Lead Magnet Assets', description: 'Drafts value-packed PDF cheat sheets, reference sheets, or calculator specs', estimatedTimeSec: 14 },
  { id: 'leadgen_crm_contact', category: 'Lead Generation', name: 'Create CRM Contact Properties', description: 'Syncs dynamic parameters, tags, custom fields, and lead capture hooks into HubSpot/Salesforce', estimatedTimeSec: 5 },
  { id: 'leadgen_score_report', category: 'Lead Generation', name: 'Create Lead Scoring Framework', description: 'Designs priority tiers, behavior points, and triggers based on user engagement metrics', estimatedTimeSec: 8 },

  // Reporting
  { id: 'reporting_pdf', category: 'Reporting', name: 'Generate PDF Report', description: 'Compiles active specialist campaign statistics into a professional print-ready report', estimatedTimeSec: 8 },
  { id: 'reporting_powerpoint', category: 'Reporting', name: 'Generate PowerPoint Pitch', description: 'Structures executive-level slide guides covering swot, ads, seo, and crm maps', estimatedTimeSec: 11 },
  { id: 'reporting_csv', category: 'Reporting', name: 'Generate CSV Data Export', description: 'Compiles mapped keyword volume datasets, competitors indices, and email drips to CSV', estimatedTimeSec: 4 },
  { id: 'reporting_summary', category: 'Reporting', name: 'Generate Executive Summary Desk', description: 'Assembles a high-level 3-paragraph executive brief forFractional CMO reviews', estimatedTimeSec: 5 }
];

export class ActionRegistry {
  public static getAction(id: string): ActionDefinition | undefined {
    return ACTIONS.find(a => a.id === id);
  }

  public static getActionsByCategory(category: ActionDefinition['category']): ActionDefinition[] {
    return ACTIONS.filter(a => a.category === category);
  }

  /**
   * Performs the actual simulated execution of the action, leveraging AI providers to synthesize genuine outcome data
   */
  public static async executeAction(
    actionId: string, 
    context: any, 
    agentId: string,
    model?: string,
    provider?: string
  ): Promise<any> {
    const action = this.getAction(actionId);
    if (!action) {
      throw new Error(`Action "${actionId}" is not registered in the Marketing Operating System.`);
    }

    const systemPrompt = `
      You are executing a real-world marketing deployment action: "${action.name}" (${action.category}) for website: ${context.url || 'general-niche.com'}.
      Description: ${action.description}

      Context variables:
      - Competitors: ${JSON.stringify(context.competitors || [])}
      - Target Audience: ${context.targetAudience || 'General market'}
      - Goals: ${context.customGoals || 'Optimize traffic, enhance organic capture'}

      Synthesize highly comprehensive, non-trivial, finished deployment copy, scripts, layouts, configurations, or checklists based on the action requested. Do not include any warning comments or placeholder strings. Output final, clean, client-ready content or JSON structures reflecting successful execution.
    `;

    // Fetch live response using the centralized AIProviderManager
    const response = await AIProviderManager.chat(
      [
        { role: 'system', content: 'You are an advanced digital marketing execution node. Synthesize finished marketing deployment code, copy, or config structures.' },
        { role: 'user', content: systemPrompt }
      ],
      {
        agentId: agentId,
        temperature: 0.3,
        optimizationMode: 'balanced'
      }
    );

    if (!response.success || !response.text) {
      throw new Error(response.error || `Execution node failed on action: ${action.name}`);
    }

    return {
      actionId,
      name: action.name,
      category: action.category,
      executedAt: new Date().toISOString(),
      provider: response.provider,
      model: response.model,
      output: response.text
    };
  }
}
