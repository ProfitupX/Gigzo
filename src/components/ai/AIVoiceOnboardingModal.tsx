'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import imageCompression from 'browser-image-compression';
import { playSarvamTTS, stopSarvamTTS } from '@/lib/sarvamVoice';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Store, 
  CheckCircle2, 
  ArrowRight, 
  UploadCloud, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Radio
} from 'lucide-react';

interface AIVoiceOnboardingModalProps {
  creatorId: string;
  initialBrandName?: string;
  initialStoreLink?: string;
  onComplete: () => void;
}

const LANGUAGES = [
  { id: 'tanglish', name: 'Tanglish / தமிழ்', sttCode: 'ta-IN', ttsCode: 'ta-IN' },
  { id: 'tamil', name: 'தமிழ் (Tamil)', sttCode: 'ta-IN', ttsCode: 'ta-IN' },
  { id: 'english', name: 'English (India)', sttCode: 'en-IN', ttsCode: 'en-IN' },
  { id: 'hindi', name: 'हिन्दी (Hindi)', sttCode: 'hi-IN', ttsCode: 'hi-IN' },
];

export default function AIVoiceOnboardingModal({
  creatorId,
  initialBrandName = 'My Store',
  initialStoreLink = '',
  onComplete
}: AIVoiceOnboardingModalProps) {
  const [step, setStep] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState('tanglish');
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  
  const [isListening, setIsListening] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  // Profile data
  const [brandName, setBrandName] = useState(initialBrandName);
  const [storeLink, setStoreLink] = useState(initialStoreLink || creatorId.slice(0, 8));
  const [bio, setBio] = useState('');
  const [upiId, setUpiId] = useState('');
  
  // First product
  const [productTitle, setProductTitle] = useState('');
  const [productPrice, setProductPrice] = useState('499');
  const [createdProduct, setCreatedProduct] = useState<any>(null);

  const [aiSpokenMessage, setAiSpokenMessage] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const supabase = createClient();

  const speak = async (text: string) => {
    if (!voiceOutputEnabled) return;
    setIsAiSpeaking(true);
    const langObj = LANGUAGES.find(l => l.id === selectedLanguage);
    await playSarvamTTS(text, langObj?.ttsCode || 'ta-IN');
    setIsAiSpeaking(false);
  };

  useEffect(() => {
    let isCancelled = false;

    async function runStepAudio() {
      let msg = '';
      let shouldListen = false;

      if (step === 0) {
        msg = `Congratulations! Unga ProfitupX store create aaiduchu! Vaanga, 1 minute-la store setup pannidalam!`;
      } else if (step === 1) {
        msg = `Vanakkam! Unga business or store name enna? Sollunga!`;
        shouldListen = true;
      } else if (step === 2) {
        msg = `Super! Unga store-la enna sell panreenga? Oru chinna description sollunga!`;
        shouldListen = true;
      } else if (step === 3) {
        msg = `Customer buy pannum podhu ungalukku instant-aa 95% payout vara, unga GPay or PhonePe UPI ID sollunga!`;
        shouldListen = true;
      } else if (step === 4) {
        msg = `Awesome! Unga first product add panlaama? Product name, price and stock sollunga!`;
        shouldListen = true;
      } else if (step === 5) {
        msg = `Super! Unga website store completely ready aaiduchu! Dashboard-ku povom!`;
      }

      if (msg) {
        setAiSpokenMessage(msg);
        await speak(msg);
      }

      // ONLY AFTER AI FINISHES SPEAKING FULL SENTENCE:
      if (!isCancelled && shouldListen && voiceOutputEnabled) {
        startListening();
      }
    }

    runStepAudio();

    return () => {
      isCancelled = true;
      stopListening();
      stopSarvamTTS();
    };
  }, [step]);

  // Real-time live streaming STT with extended 2.8s think time & auto-send
  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (isListening) stopListening();

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      const langObj = LANGUAGES.find(l => l.id === selectedLanguage);
      recognition.lang = langObj?.sttCode || 'ta-IN';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }

        const trimmed = currentTranscript.trim();
        if (trimmed) {
          setInputVal(trimmed);

          // Clear existing silence timer
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

          // Give the seller 2.8 seconds of silence to think and speak all details!
          silenceTimerRef.current = setTimeout(() => {
            stopListening();
            handleAutoSubmit(trimmed);
          }, 2800);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleAutoSubmit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    stopListening();
    setLoading(true);

    if (step === 1) {
      const cleanName = trimmed.replace(/my store is|en store name|business name|store name is/gi, '').trim();
      setBrandName(cleanName);
      const generatedLink = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 6);
      setStoreLink(generatedLink);

      await supabase.from('creators').update({
        brand_name: cleanName,
        store_link: generatedLink
      }).eq('id', creatorId);

      setInputVal('');
      setLoading(false);
      setStep(2);

    } else if (step === 2) {
      setBio(trimmed);
      await supabase.from('creators').update({
        bio: trimmed
      }).eq('id', creatorId);

      setInputVal('');
      setLoading(false);
      setStep(3);

    } else if (step === 3) {
      const cleanUpi = trimmed.toLowerCase()
        .replace(/\s+at\s+the\s+rate\s+|\s+at\s+/g, '@')
        .replace(/\s+/g, '')
        .trim();

      setUpiId(cleanUpi);
      await supabase.from('creators').update({
        upi_id: cleanUpi
      }).eq('id', creatorId);

      setInputVal('');
      setLoading(false);
      setStep(4);

    } else if (step === 4) {
      try {
        const res = await fetch('/api/ai/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            language: selectedLanguage,
            creator_id: creatorId,
            execute_action: true
          })
        });
        const data = await res.json();
        if (data.execution?.product) {
          setCreatedProduct(data.execution.product);
        } else {
          const { data: prod } = await supabase.from('products').insert({
            creator_id: creatorId,
            title: trimmed,
            price: 499,
            description: `${trimmed} available on ${brandName}`,
            category: 'General',
            is_physical: true,
            stock: 10
          }).select().single();
          setCreatedProduct(prod);
        }
      } catch (e) {
        console.error(e);
      }

      setInputVal('');
      setLoading(false);
      setStep(5);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!createdProduct) return;
    setLoading(true);
    try {
      const options = { maxSizeMB: 0.15, maxWidthOrHeight: 1024, useWebWorker: true };
      const compressed = await imageCompression(file, options);
      const fileExt = compressed.name.split('.').pop();
      const fileName = `${creatorId}-${createdProduct.id}-${Math.random()}.${fileExt}`;

      const { error } = await supabase.storage.from('product-images').upload(fileName, compressed);
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        await supabase.from('products').update({ image_url: publicUrl }).eq('id', createdProduct.id);
        setCreatedProduct((prev: any) => ({ ...prev, image_url: publicUrl }));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: 'rgba(10, 10, 10, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '32px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        position: 'relative',
        animation: 'modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        
        {/* Top Bar */}
        <div style={{
          padding: '18px 24px',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#c8f135', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <span style={{ fontWeight: 900, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>ProfitupX AI Setup</span>
              <span style={{ marginLeft: '8px', fontSize: '0.68rem', backgroundColor: 'rgba(200,241,53,0.2)', color: '#c8f135', padding: '2px 8px', borderRadius: '100px', fontWeight: 800 }}>
                VOICE AUTO-PILOT
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '100px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {LANGUAGES.map(l => (
                <option key={l.id} value={l.id} style={{ color: '#000' }}>{l.name}</option>
              ))}
            </select>

            <button
              onClick={() => {
                if (voiceOutputEnabled) stopSarvamTTS();
                setVoiceOutputEnabled(!voiceOutputEnabled);
              }}
              style={{ background: 'none', border: 'none', color: voiceOutputEnabled ? '#c8f135' : '#9ca3af', cursor: 'pointer', padding: '4px' }}
            >
              {voiceOutputEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '6px', padding: '12px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          {[0, 1, 2, 3, 4, 5].map(s => (
            <div 
              key={s} 
              style={{ 
                flex: 1, 
                height: 4, 
                borderRadius: 4, 
                backgroundColor: step >= s ? '#0a0a0a' : '#e2e8f0',
                transition: 'all 0.3s ease'
              }} 
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* STEP 0: CELEBRATION */}
          {step === 0 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#f0ffd4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #c8f135', boxShadow: '0 8px 24px rgba(200,241,53,0.3)' }}>
                <CheckCircle2 size={42} />
              </div>

              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                  🎉 Congratulations!
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                  Unga store link ready aaiduchu:
                </p>
                <div style={{ display: 'inline-block', backgroundColor: '#f1f5f9', padding: '6px 16px', borderRadius: '100px', fontWeight: 800, fontSize: '0.88rem', color: '#0a0a0a', marginTop: '8px' }}>
                  profitupx.com/{storeLink}
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#f0ffd4', borderRadius: '18px', border: '1.5px solid #c8f135', textAlign: 'left', width: '100%' }}>
                <p style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700, margin: 0, lineHeight: 1.6 }}>
                  🎙️ <strong>24/7 AI Voice Assistant:</strong> Unga kitta voice-la business details kettu store-ai instant-aa configure panrom!
                </p>
              </div>

              <button
                onClick={() => setStep(1)}
                className="btn-lime"
                style={{ width: '100%', padding: '16px', borderRadius: '100px', fontSize: '1rem', fontWeight: 800, justifyContent: 'center', gap: '8px', marginTop: '10px' }}
              >
                <span>Start Voice Setup</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEPS 1 to 4 */}
          {step >= 1 && step <= 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div style={{
                padding: '20px',
                backgroundColor: '#0a0a0a',
                color: '#ffffff',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c8f135', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <Radio size={14} className="animate-pulse" /> AI Voice Assistant
                </div>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.5, margin: 0 }}>
                  {aiSpokenMessage}
                </p>
              </div>

              {isAiSpeaking && (
                <div style={{
                  padding: '12px 18px',
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Volume2 size={18} color="#16a34a" className="animate-pulse" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534' }}>
                    AI is speaking... Please listen! (Mic will turn on automatically)
                  </span>
                </div>
              )}

              {isListening && !isAiSpeaking && (
                <div style={{
                  padding: '14px 20px',
                  backgroundColor: '#fef2f2',
                  border: '1.5px solid #f87171',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  animation: 'pulse 1.5s infinite'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 0.6s infinite' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b' }}>
                      Listening live... Speak in Tanglish/Tamil (Auto-sends on pause!)
                    </span>
                  </div>
                  <button onClick={stopListening} style={{ padding: '4px 10px', fontSize: '0.72rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '100px', fontWeight: 800 }}>
                    Pause
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: isListening ? '#ef4444' : '#0a0a0a',
                    color: isListening ? '#ffffff' : '#c8f135',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: isListening ? '0 0 20px rgba(239,68,68,0.5)' : '0 6px 16px rgba(0,0,0,0.15)'
                  }}
                  title="Click to speak"
                >
                  {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <input
                  type="text"
                  placeholder={
                    step === 1 ? "e.g. Trendz Boutique" :
                    step === 2 ? "e.g. Saree collections & handmade jewelry" :
                    step === 3 ? "e.g. 9876543210@paytm or yourname@okaxis" :
                    "e.g. Silk Saree 999 rooba 10 stock"
                  }
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && inputVal.trim()) {
                      handleAutoSubmit(inputVal);
                    }
                  }}
                  className="input-field"
                  style={{ flex: 1, padding: '14px 18px', borderRadius: '100px', fontSize: '0.92rem' }}
                />

                <button
                  type="button"
                  disabled={!inputVal.trim() || loading}
                  onClick={() => handleAutoSubmit(inputVal)}
                  className="btn-lime"
                  style={{ width: '56px', height: '56px', borderRadius: '50%', padding: 0, justifyContent: 'center', flexShrink: 0 }}
                >
                  <Send size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, padding: '0 6px' }}>
                <span>Step {step} of 4</span>
                <button
                  onClick={() => setStep(prev => prev + 1)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Skip this step →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: READY */}
          {step === 5 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#f0ffd4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #c8f135' }}>
                <CheckCircle2 size={42} />
              </div>

              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                  🚀 Your Store is 100% Ready!
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  Unga business details & UPI payout information successfully configured aaiduchu!
                </p>
              </div>

              <div style={{ width: '100%', padding: '18px', backgroundColor: '#f8fafc', borderRadius: '18px', border: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Store Name:</span>
                  <span style={{ fontWeight: 800, color: '#0a0a0a' }}>{brandName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>UPI Payout ID:</span>
                  <span style={{ fontWeight: 800, color: '#16a34a', fontFamily: 'monospace' }}>{upiId || 'Set in Settings'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Store Link:</span>
                  <span style={{ fontWeight: 800, color: '#0a0a0a', fontFamily: 'monospace' }}>/{storeLink}</span>
                </div>
              </div>

              {createdProduct && (
                <div style={{ width: '100%', padding: '14px', backgroundColor: '#eff6ff', borderRadius: '14px', border: '1px dashed #3b82f6', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af', margin: '0 0 8px' }}>
                    📸 First Product ({createdProduct.title}) photo upload panlaama?
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                    }}
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
              )}

              <button
                onClick={onComplete}
                className="btn-primary"
                style={{ width: '100%', padding: '16px', borderRadius: '100px', fontSize: '0.98rem', fontWeight: 800, justifyContent: 'center', marginTop: '8px' }}
              >
                Go to Store Dashboard →
              </button>
            </div>
          )}

        </div>

      </div>

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
