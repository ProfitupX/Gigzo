import { NextResponse } from 'next/server';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || 'sk_zf7stjph_eGepvdw7e3wDu3TpIN8HUn40';

// In-memory cache to save Free Tier credits for repeated phrases
const audioCache = new Map<string, string>();
const MAX_CACHE_SIZE = 100;

export async function POST(request: Request) {
  try {
    const { text, language_code = 'ta-IN', speaker = 'kavitha' } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Free Tier Optimization 1: Clean text (remove emojis, markdown formatting, symbols)
    const cleanedText = text
      .replace(/[*_#`~>]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '')
      .trim();

    if (!cleanedText) {
      return NextResponse.json({ error: 'Empty text after cleanup' }, { status: 400 });
    }

    // Limit to max 350 chars to preserve credits
    const trimmedText = cleanedText.slice(0, 350);

    // Free Tier Optimization 2: Check in-memory cache
    const cacheKey = `${language_code}_${speaker}_${trimmedText}`;
    if (audioCache.has(cacheKey)) {
      return NextResponse.json({ 
        audio_base64: audioCache.get(cacheKey),
        cached: true 
      });
    }

    // Select speaker based on language if not specified
    let targetSpeaker = speaker;
    if (language_code === 'hi-IN') targetSpeaker = 'priya';
    if (language_code === 'en-IN') targetSpeaker = 'kavitha';

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY
      },
      body: JSON.stringify({
        inputs: [trimmedText],
        target_language_code: language_code,
        speaker: targetSpeaker,
        pace: 1.0,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: 'bulbul:v3'
      })
    });

    const data = await response.json();

    if (!response.ok || !data.audios?.[0]) {
      console.error('Sarvam TTS API Error:', data);
      return NextResponse.json({ error: data.error?.message || 'TTS generation failed' }, { status: 500 });
    }

    const audioBase64 = data.audios[0];

    // Store in cache
    if (audioCache.size >= MAX_CACHE_SIZE) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, audioBase64);

    return NextResponse.json({
      audio_base64: audioBase64,
      cached: false
    });

  } catch (error: any) {
    console.error('Sarvam TTS route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
