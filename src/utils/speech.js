/**
 * Web Speech API engine for Kọ́ Yorùbá.
 * Provides computer-generated voice pronunciation for Yoruba words.
 *
 * Looks for Yoruba-specific voices ('yo-NG', 'yo') when available in the browser/OS,
 * and sets an optimal learning pace (rate: 0.85).
 */

export function speakWord(text, options = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return {
      success: false,
      message: 'Speech synthesis is not supported in this browser.',
    };
  }

  try {
    // Cancel any currently playing speech to avoid overlapping
    window.speechSynthesis.cancel();

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.85; // Slightly slower for language learners
    utterance.pitch = options.pitch || 1.0;

    // Search for a voice that supports Yoruba ('yo' or 'yo-NG')
    const voices = window.speechSynthesis.getVoices();
    const yorubaVoice = voices.find((v) =>
      v.lang && v.lang.toLowerCase().startsWith('yo')
    );

    if (yorubaVoice) {
      utterance.voice = yorubaVoice;
      utterance.lang = yorubaVoice.lang;
    } else {
      utterance.lang = 'yo-NG';
    }

    window.speechSynthesis.speak(utterance);

    return {
      success: true,
      hasNativeVoice: !!yorubaVoice,
    };
  } catch (err) {
    console.error('Speech synthesis error:', err);
    return {
      success: false,
      message: 'Could not play computer-generated audio.',
    };
  }
}
