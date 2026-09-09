/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider, Message, ProviderCallOptions, ProviderResponse } from '../provider-types';

export class AnthropicProvider implements AIProvider {
  id = 'anthropic';
  private apiKey: string = '';

  initialize(apiKey: string): void {
    this.apiKey = apiKey;
  }

  listModels(): string[] {
    return ['claude-3-5-sonnet-latest', 'claude-3-opus-latest', 'claude-3-haiku-latest'];
  }

  async chat(
    model: string,
    messages: Message[],
    options?: ProviderCallOptions
  ): Promise<ProviderResponse> {
    const startTime = Date.now();
    const selectedModel = model || 'claude-3-5-sonnet-latest';

    try {
      if (!this.apiKey) {
        throw new Error('Anthropic Claude API key is not configured.');
      }

      // Extract system instruction and convert user/assistant messages
      let systemInstruction = '';
      const formattedMessages: any[] = [];

      messages.forEach(msg => {
        if (msg.role === 'system') {
          systemInstruction = msg.content;
        } else {
          formattedMessages.push({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          });
        }
      });

      const body: any = {
        model: selectedModel,
        messages: formattedMessages,
        max_tokens: 4000,
        temperature: options?.temperature ?? 0.2
      };

      if (systemInstruction) {
        body.system = systemInstruction;
      }

      // If json response format is required, append a guiding hint for Claude
      if (options?.responseMimeType === 'application/json') {
        body.messages.push({
          role: 'user',
          content: 'IMPORTANT: You must return the response as a strict, valid, parseable JSON payload. Do not include any explanation, markdown, or text outside of the JSON block.'
        });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-html': 'true'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic Claude HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }

      const json = await response.json();
      const text = json.content?.[0]?.text || '';
      const usage = json.usage ? {
        promptTokens: json.usage.input_tokens || 0,
        completionTokens: json.usage.output_tokens || 0,
        totalTokens: (json.usage.input_tokens || 0) + (json.usage.output_tokens || 0)
      } : {
        promptTokens: Math.ceil(messages.reduce((acc, m) => acc + m.content.length, 0) / 4),
        completionTokens: Math.ceil(text.length / 4),
        totalTokens: Math.ceil((messages.reduce((acc, m) => acc + m.content.length, 0) + text.length) / 4)
      };

      return {
        provider: 'anthropic',
        model: selectedModel,
        text,
        usage,
        latency: Date.now() - startTime,
        finishReason: json.stop_reason || 'stop',
        success: true
      };
    } catch (err: any) {
      return {
        provider: 'anthropic',
        model: selectedModel,
        text: '',
        latency: Date.now() - startTime,
        success: false,
        error: err.message || 'Unknown error occurred in Anthropic Claude.'
      };
    }
  }
}
