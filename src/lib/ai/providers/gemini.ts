/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { AIProvider, Message, ProviderCallOptions, ProviderResponse } from '../provider-types';

export class GeminiProvider implements AIProvider {
  id = 'gemini';
  private client: GoogleGenAI | null = null;
  private apiKey: string = '';

  initialize(apiKey: string): void {
    this.apiKey = apiKey;
    this.client = new GoogleGenAI({ apiKey });
  }

  listModels(): string[] {
    return ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-3.1-pro-preview'];
  }

  async chat(
    model: string,
    messages: Message[],
    options?: ProviderCallOptions
  ): Promise<ProviderResponse> {
    const startTime = Date.now();
    if (!this.client) {
      return {
        provider: 'gemini',
        model: model || 'gemini-2.5-flash',
        text: '',
        latency: 0,
        success: false,
        error: 'Gemini provider client has not been initialized with an API Key.'
      };
    }

    // Extract system instructions and convert messages
    let systemInstruction: string | undefined = undefined;
    const contents: any[] = [];

    messages.forEach(msg => {
      if (msg.role === 'system') {
        systemInstruction = msg.content;
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    });

    const config: any = {
      temperature: options?.temperature !== undefined ? options.temperature : 0.2,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    if (options?.responseMimeType) {
      config.responseMimeType = options.responseMimeType;
    }

    if (options?.responseSchema) {
      config.responseSchema = options.responseSchema;
    }

    // Build candidate model list with prioritized failover order
    const primary = model || 'gemini-2.5-flash';
    const fallbackCandidates = ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    const candidateModels = [primary, ...fallbackCandidates.filter(m => m !== primary)];

    let lastError = '';

    for (const candidate of candidateModels) {
      // Attempt up to 2 tries per candidate model (for transient network or brief 503 hiccups)
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await this.client.models.generateContent({
            model: candidate,
            contents,
            config
          });

          const latency = Date.now() - startTime;
          const text = response.text || '';

          const promptChars = messages.reduce((acc, m) => acc + m.content.length, 0);
          const completionChars = text.length;
          const promptTokens = Math.ceil(promptChars / 4);
          const completionTokens = Math.ceil(completionChars / 4);

          return {
            provider: 'gemini',
            model: candidate,
            text,
            usage: {
              promptTokens,
              completionTokens,
              totalTokens: promptTokens + completionTokens
            },
            latency,
            finishReason: 'stop',
            success: true
          };
        } catch (err: any) {
          lastError = err.message || String(err);
          const isTransient = 
            lastError.includes('503') || 
            lastError.includes('high demand') || 
            lastError.includes('UNAVAILABLE') || 
            lastError.includes('429') || 
            lastError.includes('RESOURCE_EXHAUSTED') ||
            lastError.includes('fetch failed');

          if (isTransient) {
            console.warn(`[GEMINI PROVIDER] Model ${candidate} attempt ${attempt} returned transient error: ${lastError.substring(0, 120)}. Retrying or falling over...`);
            if (attempt === 1) {
              // Wait 500ms before second attempt
              await new Promise(resolve => setTimeout(resolve, 500));
              continue;
            }
          }
          // If not transient or second attempt failed, break to next candidate model in pool
          break;
        }
      }
    }

    return {
      provider: 'gemini',
      model: candidateModels[0],
      text: '',
      latency: Date.now() - startTime,
      success: false,
      error: lastError || 'Unknown error occurred in Gemini provider.'
    };
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;
    try {
      const res = await this.chat('gemini-2.5-flash', [{ role: 'user', content: 'ping' }]);
      return res.success;
    } catch {
      return false;
    }
  }
}
