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
  Package, 
  TrendingUp, 
  Store, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  ArrowRight,
  RefreshCw,
  Globe,
  Radio,
  Zap,
  ShoppingBag
} from 'lucide-react';
import AIVoiceOrb3D from '@/components/ai/AIVoiceOrb3D';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  audioText?: string;
  action?: string;
  data?: any;
  execution?: any;
  timestamp: string;
}

const LANGUAGES = [
  { id: 'tanglish', name: 'Tanglish / தமிழ்', sttCode: 'ta-IN', ttsCode: 'ta-IN' },
  { id: 'tamil', name: 'தமிழ் (Tamil)', sttCode: 'ta-IN', ttsCode: 'ta-IN' },
  { id: 'english', name: 'English (India)', sttCode: 'en-IN', ttsCode: 'en-IN' },
  { id: 'hindi', name: 'हिन्दी (Hindi)', sttCode: 'hi-IN', ttsCode: 'hi-IN' },
];

export default function AIAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('tanglish');
  
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<any>(null);

  const [pendingUploadProductId, setPendingUploadProductId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const supabase = createClient();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    async function initUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCreatorId(user.id);

      const { data: profile } = await supabase.from('creators').select('*').eq('id', user.id).single();
      setCreatorProfile(profile);

      const brand = profile?.brand_name || 'Creator';
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: `Vanakkam ${brand}! 🙏 Naan unga **24/7 AI Voice Studio**.\n\nEnkita neenga pesi:\n1. 🛍️ **Pudhu product add pannalam** (e.g. *"Red Kurti 500 rooba 10 stock"*)\n2. 💰 **Price & stock update pannalam** (e.g. *"Price 399-ku mathu"*)\n3. 📊 **Sales & orders report kettu therinjukalam**\n4. ⚙️ **Store profile & UPI setup pannalam**\n\nMic click panni pesunga or type pannunga!`,
          audioText: `Vanakkam ${brand}! Naan unga AI Store Copilot. Voice-la edhavadhu sollunga!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
    initUser();
  }, []);

  const speak = (text: string) => {
    if (!voiceOutputEnabled) return;
    const langObj = LANGUAGES.find(l => l.id === selectedLanguage);
    playSarvamTTS(text, langObj?.ttsCode || 'ta-IN');
  };

  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. Please type your message.');
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    try {
      stopSarvamTTS();
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      const langObj = LANGUAGES.find(l => l.id === selectedLanguage);
      recognition.lang = langObj?.sttCode || 'en-IN';
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
          setInputMessage(trimmed);

          // Clear existing timer
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

          // Auto-send on 2.8s silence pause
          silenceTimerRef.current = setTimeout(() => {
            stopListening();
            handleSendMessage(trimmed);
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
      console.error(e);
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

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || loading) return;

    setInputMessage('');
    stopListening();

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: selectedLanguage,
          creator_id: creatorId,
          conversation_history: messages.map(m => ({ role: m.role, text: m.text })),
          execute_action: true
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      const assistantMsg: Message = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        text: data.ai.reply_text,
        audioText: data.ai.audio_text,
        action: data.ai.action,
        data: data.ai.data,
        execution: data.execution,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      speak(data.ai.audio_text || data.ai.reply_text);

      if (data.execution?.type === 'PRODUCT_CREATED') {
        setPendingUploadProductId(data.execution.product.id);
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: '⚠️ Mannikanum, error aagivittadhu. Oru murai meendum try pannunga!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductImageUpload = async (productId: string, file: File) => {
    if (!creatorId) return;
    setUploadingImage(true);

    try {
      const options = { maxSizeMB: 0.15, maxWidthOrHeight: 1024, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${creatorId}-${productId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, compressedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);

      await supabase.from('products').update({ image_url: publicUrl }).eq('id', productId);

      setMessages(prev => [
        ...prev,
        {
          id: `img_${Date.now()}`,
          role: 'assistant',
          text: `📸 **Product photo successfully uploaded!** Unga product ippo photovodu live store-la irukku!`,
          audioText: 'Product photo uploaded successfully!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setPendingUploadProductId(null);
      speak('Product photo uploaded successfully!');
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)', gap: '20px' }}>
      
      {/* Studio Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#0a0a0a', color: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>AI Voice Studio</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Live Real-Time Voice Typing & ProfitupX AI Speaking in Tanglish & Tamil.</p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* 3D Holographic AI Voice Core Indicator */}
          <AIVoiceOrb3D 
            state={isListening ? 'listening' : loading ? 'thinking' : voiceOutputEnabled ? 'idle' : 'idle'}
            size={38}
            compact={true}
            onMicClick={toggleListening}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: '100px', padding: '4px 12px' }}>
            <Globe size={14} color="#6b7280" />
            <select 
              value={selectedLanguage} 
              onChange={e => setSelectedLanguage(e.target.value)}
              style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.82rem', fontWeight: 700, color: '#0a0a0a', cursor: 'pointer' }}
            >
              {LANGUAGES.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (voiceOutputEnabled) stopSarvamTTS();
              setVoiceOutputEnabled(!voiceOutputEnabled);
            }}
            className="btn-secondary"
            style={{ padding: '8px 14px', borderRadius: '100px', fontSize: '0.82rem', gap: '6px' }}
          >
            {voiceOutputEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{voiceOutputEnabled ? 'Voice On' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '24px', overflow: 'hidden', padding: 0, backgroundColor: '#ffffff' }}>
        
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fcfcfc' }}>
          {messages.map(msg => (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: '6px'
              }}
            >
              <div style={{
                maxWidth: '75%',
                padding: '16px 20px',
                borderRadius: '20px',
                fontSize: '0.92rem',
                lineHeight: 1.65,
                backgroundColor: msg.role === 'user' ? '#0a0a0a' : '#ffffff',
                color: msg.role === 'user' ? '#ffffff' : '#0a0a0a',
                border: msg.role === 'user' ? 'none' : '1px solid #e5e7eb',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '20px',
                borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}

                {/* Product Created Card */}
                {msg.execution?.type === 'PRODUCT_CREATED' && (
                  <div style={{
                    marginTop: '14px',
                    padding: '16px',
                    backgroundColor: '#f0ffd4',
                    borderRadius: '16px',
                    border: '1.5px solid #c8f135',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 800, fontSize: '0.9rem' }}>
                      <CheckCircle2 size={18} />
                      <span>Product Published to Your Store!</span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0a0a0a' }}>
                      {msg.execution.product.title} — ₹{msg.execution.product.price}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <a 
                        href={`/${creatorId}`} 
                        target="_blank"
                        className="btn-primary"
                        style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', textDecoration: 'none', gap: '6px' }}
                      >
                        <span>View on Live Store</span> <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}

                {/* Upload Photo */}
                {pendingUploadProductId && msg.execution?.product?.id === pendingUploadProductId && (
                  <div style={{
                    marginTop: '14px',
                    padding: '16px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '16px',
                    border: '1.5px dashed #3b82f6',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e40af' }}>
                      📸 Intha product-ku photo upload panna click pannunga:
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          handleProductImageUpload(pendingUploadProductId, e.target.files[0]);
                        }
                      }}
                      style={{ fontSize: '0.85rem' }}
                    />
                    {uploadingImage && <span style={{ fontSize: '0.8rem', color: '#2563eb' }}>Uploading photo to store...</span>}
                  </div>
                )}

                {/* Product Updated Card */}
                {msg.execution?.type === 'PRODUCT_UPDATED' && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '12px',
                    border: '1px solid #86efac',
                    color: '#166534',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={18} />
                    <span>Product updated successfully in Supabase!</span>
                  </div>
                )}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af', padding: '0 8px' }}>
                {msg.timestamp}
              </span>
            </div>
          ))}

          {loading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 20px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              width: 'fit-content',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0a0a0a', animation: 'pulse 1s infinite' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#c8f135', animation: 'pulse 1s infinite 0.2s' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0a0a0a', animation: 'pulse 1s infinite 0.4s' }} />
              <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>AI is responding...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Listening Banner */}
        {isListening && (
          <div style={{
            padding: '12px 24px',
            backgroundColor: '#fef2f2',
            borderTop: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626', fontWeight: 800, fontSize: '0.9rem' }}>
              <Radio size={18} className="animate-pulse" />
              <span>Listening live... Speak in Tanglish / Tamil (Auto-sends on pause)</span>
            </div>
            <button onClick={stopListening} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '100px' }}>
              Stop
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={toggleListening}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: isListening ? '#ef4444' : '#0a0a0a',
              color: isListening ? '#ffffff' : '#c8f135',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease'
            }}
            title={isListening ? 'Click to stop listening' : 'Speak with AI'}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <input
            type="text"
            placeholder={isListening ? "Listening live... speak now" : "Type or speak: 'Add Saree 699 rs 10 stock' or 'Sales report sollunga'..."}
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="input-field"
            style={{ flex: 1, padding: '14px 20px', borderRadius: '100px', fontSize: '0.95rem' }}
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || loading}
            className="btn-lime"
            style={{ width: '52px', height: '52px', borderRadius: '50%', padding: 0, justifyContent: 'center', flexShrink: 0 }}
          >
            <Send size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
