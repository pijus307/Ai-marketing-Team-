/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider, Message, ProviderCallOptions, ProviderResponse } from '../provider-types';

export class OllamaProvider implements AIProvider {
  id = 'ollama';
  private endpoint: string = 'http://localhost:11434';

  initialize(endpoint: string): void {
    if (endpoint) {
      this.endpoint = endpoint.replace(/\/$/, ''); // Remove trailing slash
    }
  }

  listModels(): string[] {
    return ['llama3', 'mistral', 'phi3', 'gemma2'];
  }

  async chat(
    model: string,
    messages: Message[],
    options?: ProviderCallOptions
  ): Promise<ProviderResponse> {
    const startTime = Date.now();
    const selectedModel = model || 'llama3';

    try {
      const body = {
        model: selectedModel,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: false,
        options: {
          temperature: options?.temperature ?? 0.2
        }
      };

      const response = await fetch(`${this.endpoint}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Ollama HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      const text = json.message?.content || '';

      const promptTokens = json.prompt_eval_count || Math.ceil(messages.reduce((acc, m) => acc + m.content.length, 0) / 4);
      const completionTokens = json.eval_count || Math.ceil(text.length / 4);

      return {
        provider: 'ollama',
        model: selectedModel,
        text,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens
        },
        latency: Date.now() - startTime,
        finishReason: 'stop',
        success: true
      };
    } catch (err: any) {
      return {
        provider: 'ollama',
        model: selectedModel,
        text: '',
        latency: Date.now() - startTime,
        success: false,
        error: err.message || 'Unknown error occurred in Ollama.'
      };
    }
  }
}
