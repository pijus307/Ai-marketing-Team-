/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIProvider } from './provider-types';
import { GeminiProvider } from './providers/gemini';
import { OpenRouterProvider } from './providers/openrouter';
import { NvidiaProvider } from './providers/nvidia';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import { OllamaProvider } from './providers/ollama';

export class ProviderFactory {
  private static instances: Record<string, AIProvider> = {};

  /**
   * Resolves and returns a cached provider instance based on its provider ID
   */
  static getProvider(providerId: string): AIProvider {
    const id = providerId.toLowerCase().trim();
    if (!this.instances[id]) {
      switch (id) {
        case 'gemini':
          this.instances[id] = new GeminiProvider();
          break;
        case 'openrouter':
          this.instances[id] = new OpenRouterProvider();
          break;
        case 'nvidia':
          this.instances[id] = new NvidiaProvider();
          break;
        case 'openai':
          this.instances[id] = new OpenAIProvider();
          break;
        case 'anthropic':
          this.instances[id] = new AnthropicProvider();
          break;
        case 'ollama':
          this.instances[id] = new OllamaProvider();
          break;
        default:
          throw new Error(`Unsupported AI Provider: ${providerId}`);
      }
    }
    return this.instances[id];
  }
}
