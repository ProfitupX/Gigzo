/**
 * Sarvam AI Voice Integration Utility
 * Uses Sarvam AI (Bulbul V3) for natural Tamil / Indian voice TTS,
 * with strict singleton audio control and Promise resolution on audio end.
 */

let currentAudio: HTMLAudioElement | null = null;
let currentAbortController: AbortController | null = null;
let lastSpokenText: string = '';
let lastSpokenTime: number = 0;

export async function playSarvamTTS(text: string, languageCode: string = 'ta-IN'): Promise<void> {
  if (!text || typeof window === 'undefined') return;

  const cleanText = text
    .replace(/[*_#`~>]/g, '')
    .replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '')
    .trim();

  if (!cleanText) return;

  // Prevent exact duplicate speech within 1.2 seconds
  const now = Date.now();
  if (cleanText === lastSpokenText && now - lastSpokenTime < 1200) {
    return;
  }
  lastSpokenText = cleanText;
  lastSpokenTime = now;

  // Cancel any ongoing audio & abort pending fetch
  stopSarvamTTS();

  const controller = new AbortController();
  currentAbortController = controller;

  return new Promise(async (resolve) => {
    let resolved = false;
    const finish = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    try {
      const res = await fetch('/api/ai/sarvam/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          language_code: languageCode
        }),
        signal: controller.signal
      });

      if (controller.signal.aborted) {
        return finish();
      }

      const data = await res.json();
      if (res.ok && data.audio_base64 && !controller.signal.aborted) {
        const audioSrc = `data:audio/wav;base64,${data.audio_base64}`;
        const audio = new Audio(audioSrc);
        currentAudio = audio;
        audio.onended = () => finish();
        audio.onerror = () => finish();
        await audio.play();
        return;
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return finish();
      console.warn('Sarvam TTS network error, using native TTS fallback:', err);
    }

    // Graceful native TTS fallback if not aborted
    if (!controller.signal.aborted) {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = languageCode;
          utterance.rate = 1.0;
          utterance.onend = () => finish();
          utterance.onerror = () => finish();
          window.speechSynthesis.speak(utterance);
          return;
        }
      } catch (e) {
        console.error('TTS speech error:', e);
      }
    }

    finish();
  });
}

export function stopSarvamTTS(): void {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
