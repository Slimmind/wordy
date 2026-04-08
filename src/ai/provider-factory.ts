import { AIProvider } from '../ai/types';
import { openaiProvider } from './openai.provider';
import { localAiProvider } from './local-ai.provider';
import { AIProviderType, CURRENT_AI_PROVIDER } from '../config';

const providerMap: Record<AIProviderType, AIProvider> = {
	openai: openaiProvider,
	local: localAiProvider,
};

/**
 * Returns the currently configured AI provider.
 * Change `CURRENT_AI_PROVIDER` in config.ts to switch providers.
 */
export function createAIProvider(): AIProvider {
	return providerMap[CURRENT_AI_PROVIDER];
}
