/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider, Message, ProviderCallOptions, ProviderResponse } from '../provider-types';

export class OpenAIProvider implements AIProvider {
  id = 'openai';
  private apiKey: string = '';

  initialize(apiKey: string): void {
    this.apiKey = apiKey;
  }

  listModels(): string[] {
    return ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
  }

  async chat(
    model: string,
    messages: Message[],
    options?: ProviderCallOptions
  ): Promise<ProviderResponse> {
    const startTime = Date.now();
    const selectedModel = model || 'gpt-4o';

    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key is not configured.');
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

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI HTTP error! Status: ${response.status}. Details: ${errorText}`);
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
        provider: 'openai',
        model: selectedModel,
        text,
        usage,
        latency: Date.now() - startTime,
        finishReason: json.choices?.[0]?.finish_reason || 'stop',
        success: true
      };
    } catch (err: any) {
      return {
        provider: 'openai',
        model: selectedModel,
        text: '',
        latency: Date.now() - startTime,
        success: false,
        error: err.message || 'Unknown error occurred in OpenAI.'
      };
    }
  }
}
