/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider, Message, ProviderCallOptions, ProviderResponse } from '../provider-types';

export class OpenRouterProvider implements AIProvider {
  id = 'openrouter';
  private apiKey: string = '';

  initialize(apiKey: string): void {
    this.apiKey = apiKey;
  }

  listModels(): string[] {
    return [
      'meta-llama/llama-3-70b-instruct',
      'mistralai/mixtral-8x7b-instruct',
      'anthropic/claude-3.5-sonnet',
      'google/gemini-2.5-flash'
    ];
  }

  async chat(
    model: string,
    messages: Message[],
    options?: ProviderCallOptions
  ): Promise<ProviderResponse> {
    const startTime = Date.now();
    const selectedModel = model || 'meta-llama/llama-3-70b-instruct';

    try {
      if (!this.apiKey) {
        throw new Error('OpenRouter API key is not configured.');
      }

      const body: any = {
        model: selectedModel,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: options?.temperature ?? 0.2
      };

      if (options?.responseMimeType === 'application/json') {
        body.response_format = { type: 'json_object' };
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://ai.studio/build',
          'X-Title': 'Marketing OS Universal Manager'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }

      const json = await response.json();
      const text = json.choices?.[0]?.message?.content || '';
      const usage = json.usage ? {
        promptTokens: json.usage.prompt_tokens || 0,
        completionTokens: json.usage.completion_tokens || 0,
        totalTokens: json.usage.total_tokens || 0
      } : {
        promptTokens: Math.ceil(messages.reduce((acc, m) => acc + m.content.length, 0) / 4),
        completionTokens: Math.ceil(text.length / 4),
        totalTokens: Math.ceil((messages.reduce((acc, m) => acc + m.content.length, 0) + text.length) / 4)
      };

      return {
        provider: 'openrouter',
        model: selectedModel,
        text,
        usage,
        latency: Date.now() - startTime,
        finishReason: json.choices?.[0]?.finish_reason || 'stop',
        success: true
      };
    } catch (err: any) {
      return {
        provider: 'openrouter',
        model: selectedModel,
        text: '',
        latency: Date.now() - startTime,
        success: false,
        error: err.message || 'Unknown error occurred in OpenRouter.'
      };
    }
  }
}
