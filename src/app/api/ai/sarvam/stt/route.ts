import { NextResponse } from 'next/server';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || 'sk_zf7stjph_eGepvdw7e3wDu3TpIN8HUn40';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('file') as Blob | null;
    const languageCode = (formData.get('language_code') as string) || 'ta-IN';

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const sarvamFormData = new FormData();
    sarvamFormData.append('file', audioFile, 'recording.webm');
    sarvamFormData.append('language_code', languageCode);
    sarvamFormData.append('model', 'saaras:v3');

    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY
      },
      body: sarvamFormData
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Sarvam STT API Error:', data);
      return NextResponse.json({ error: data.error?.message || data.detail || 'STT transcription failed' }, { status: 500 });
    }

    return NextResponse.json({
      transcript: data.transcript || ''
    });

  } catch (error: any) {
    console.error('Sarvam STT route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
