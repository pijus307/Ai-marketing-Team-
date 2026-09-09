/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ProviderUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ProviderResponse {
  provider: string;
  model: string;
  text: string;
  usage?: ProviderUsage;
  latency: number; // in milliseconds
  finishReason?: string;
  success: boolean;
  error?: string;
}

export type OptimizationMode = 'cheapest' | 'fastest' | 'highest-quality' | 'balanced';

export interface ProviderCallOptions {
  temperature?: number;
  responseSchema?: any; // For structured outputs
  responseMimeType?: string;
  optimizationMode?: OptimizationMode;
  agentId?: string;
  preferredModel?: string;
}

export interface AIProvider {
  id: string;
  initialize(apiKey: string): void;
  chat(
    model: string,
    messages: Message[],
    options?: ProviderCallOptions
  ): Promise<ProviderResponse>;
  generateImage?(prompt: string, options?: any): Promise<{ url: string }>;
  generateEmbedding?(text: string): Promise<number[]>;
  healthCheck?(): Promise<boolean>;
  listModels(): string[];
}
