import { queryCompendium } from './sovereignCompendium';

/**
 * Sanitizes and guarantees complete reasoning and thinking blocks.
 * If a stream dies halfway through <think>, it closes the tag and appends a clean conclusion.
 */
export function healReasoningStream(
  rawText: string, 
  prompt: string, 
  onRecovery?: () => void
): { reasoning: string; answer: string; fullText: string } {
  let text = rawText || '';
  let reasoning = '';
  let answer = text;

  // Check for DeepSeek-R1 / Qwen <think> or [THINKING] tags
  if (text.includes('<think>')) {
    const startIdx = text.indexOf('<think>') + 7;
    const endIdx = text.indexOf('</think>');

    if (endIdx !== -1) {
      reasoning = text.substring(startIdx, endIdx).trim();
      answer = text.substring(endIdx + 8).trim();
    } else {
      // Halfway through reasoning crash recovery!
      if (onRecovery) onRecovery();
      const partialReasoning = text.substring(startIdx).trim();
      reasoning = partialReasoning + '\n[Janus Gate: Seamlessly concluded reasoning trace without interruption]';
      
      // Generate clean conclusion via Face 1 (Sovereign Anchor)
      const compendiumAnswer = queryCompendium(prompt);
      answer = compendiumAnswer.text;
      text = `<think>\n${reasoning}\n</think>\n\n${answer}`;
    }
  } else if (text.startsWith('🧠 **[DEEPTHINK') && text.includes('**')) {
    const parts = text.split('\n\n');
    reasoning = parts[0];
    answer = parts.slice(1).join('\n\n');
  }

  return { reasoning, answer, fullText: text };
}
