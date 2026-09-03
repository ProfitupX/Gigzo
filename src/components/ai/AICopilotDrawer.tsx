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
  X, 
  Volume2, 
  VolumeX, 
  Package, 
  TrendingUp, 
  Store, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  RefreshCw,
  MessageCircle,
  HelpCircle,
  Globe,
  Radio
} from 'lucide-react';

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

const QUICK_PROMPTS = [
  { label: '🎙️ Add Product by Voice', text: 'Enkita Red Kurti 500 rooba-ku irukku, 10 stock irukku, add pannu' },
  { label: '📊 Sales & Orders Report', text: 'En store sales report and pending orders details sollunga' },
  { label: '💰 Update Product Price', text: 'Price update pannanum' },
  { label: '🏪 Voice Store Setup', text: 'En store profile and UPI details setup panna help pannunga' },
];

const LANGUAGES = [
  { id: 'tanglish', name: 'Tanglish / தமிழ்', sttCode: 'ta-IN', ttsCode: 'ta-IN' },
  { id: 'tamil', name: 'தமிழ் (Tamil)', sttCode: 'ta-IN', ttsCode: 'ta-IN' },
  { id: 'english', name: 'English (India)', sttCode: 'en-IN', ttsCode: 'en-IN' },
  { id: 'hindi', name: 'हिन्दी (Hindi)', sttCode: 'hi-IN', ttsCode: 'hi-IN' },
];

export default function AICopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    async function initUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCreatorId(user.id);

      const { data: profile } = await supabase.from('creators').select('*').eq('id', user.id).single();
      setCreatorProfile(profile);

      const brand = profile?.brand_name || 'Creator';
      const isConfigured = profile?.upi_id && profile?.brand_name;

      let welcomeText = `Vanakkam ${brand}! 🙏 Naan unga **24/7 AI Store Manager & Copilot**.\n\nEppadi help pannanum? Unga voice-la sollunga or type pannunga!`;
      let welcomeAudio = `Vanakkam ${brand}! Naan unga AI Store Copilot. Voice-la edhavadhu sollunga!`;

      if (!isConfigured) {
        welcomeText = `Vanakkam ${brand}! 🎉 Unga store-ai 1 minute-la ready panna naan irukken.\n\n🎙️ Unga **Business name**, **description**, and **UPI ID** voice-la sollunga, naan automatic-aa setup panren!`;
        welcomeAudio = `Vanakkam! Unga business name and UPI ID sollunga, store setup panlaam!`;
      }

      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: welcomeText,
          audioText: welcomeAudio,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
    initUser();
  }, []);

  const speakAudio = (text: string) => {
    if (!voiceOutputEnabled) return;
    const langObj = LANGUAGES.find(l => l.id === selectedLanguage);
    playSarvamTTS(text, langObj?.ttsCode || 'ta-IN');
  };

  // Real-time live streaming Web Speech STT with zero delay & auto-send
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

          // Clear any existing silence timer
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

          // Give seller 2.8 seconds to think and speak
          silenceTimerRef.current = setTimeout(() => {
            stopListening();
            handleSendMessage(trimmed);
          }, 2800);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
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
      speakAudio(data.ai.audio_text || data.ai.reply_text);

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
          text: '⚠️ Mannikanum, oru siru thavaru nadanthuvittathu. Meendum oru murai sollunga!',
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

      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl })
        .eq('id', productId);

      if (updateError) throw updateError;

      const successMsg = `📸 **Product photo successfully uploaded!** Unga product ippo live store-la photovodu ready-aa irukku!`;
      setMessages(prev => [
        ...prev,
        {
          id: `img_${Date.now()}`,
          role: 'assistant',
          text: successMsg,
          audioText: 'Product photo uploaded successfully!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setPendingUploadProductId(null);
      speakAudio('Product photo uploaded successfully!');

    } catch (err: any) {
      alert('Photo upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <>
      {/* Floating Copilot Launcher Button */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
      }}>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="ai-pulse-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 20px',
              backgroundColor: '#0a0a0a',
              color: '#ffffff',
              border: '2px solid #c8f135',
              borderRadius: '100px',
              cursor: 'pointer',
              boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: '0.92rem',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#c8f135',
              color: '#0a0a0a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
            }}>
              <Sparkles size={16} />
            </div>
            <span>AI Voice Copilot</span>
            <span style={{
              backgroundColor: 'rgba(200,241,53,0.2)',
              color: '#c8f135',
              padding: '2px 8px',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 900
            }}>24/7 Voice</span>
          </button>
        )}
      </div>

      {/* Slide-out Copilot Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          animation: 'fadeIn 0.2s ease-out forwards'
        }}>
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => { stopSarvamTTS(); setIsOpen(false); }} />

          <div className="ai-drawer-container" style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '520px',
            height: '88vh',
            maxHeight: '750px',
            backgroundColor: '#ffffff',
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            borderBottomLeftRadius: '28px',
            borderBottomRightRadius: '28px',
            margin: '0 20px 20px 0',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}>
            
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#0a0a0a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  backgroundColor: '#c8f135',
                  color: '#0a0a0a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(200,241,53,0.5)'
                }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>AI Voice Copilot</h3>
                    <span style={{ fontSize: '0.68rem', backgroundColor: '#22c55e', color: '#fff', padding: '2px 6px', borderRadius: '100px', fontWeight: 800 }}>LIVE</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>ProfitupX AI Voice</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => {
                    if (voiceOutputEnabled) stopSarvamTTS();
                    setVoiceOutputEnabled(!voiceOutputEnabled);
                  }}
                  style={{
                    background: voiceOutputEnabled ? 'rgba(200,241,53,0.15)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: voiceOutputEnabled ? '#c8f135' : '#9ca3af',
                    padding: '8px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={voiceOutputEnabled ? 'Voice Output Enabled' : 'Voice Output Muted'}
                >
                  {voiceOutputEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>

                <button
                  onClick={() => { stopSarvamTTS(); setIsOpen(false); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    padding: '8px',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Language Bar */}
            <div style={{
              padding: '10px 16px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              overflowX: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', fontWeight: 700, flexShrink: 0 }}>
                <Globe size={14} /> Language:
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: selectedLanguage === lang.id ? '1.5px solid #0a0a0a' : '1px solid #cbd5e1',
                      backgroundColor: selectedLanguage === lang.id ? '#0a0a0a' : '#ffffff',
                      color: selectedLanguage === lang.id ? '#c8f135' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: '#fafafa'
            }}>
              
              {messages.map(msg => (
                <div 
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: '6px',
                    maxWidth: '100%'
                  }}
                >
                  <div style={{
                    maxWidth: '85%',
                    padding: '14px 16px',
                    borderRadius: '18px',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    backgroundColor: msg.role === 'user' ? '#0a0a0a' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#0a0a0a',
                    border: msg.role === 'user' ? 'none' : '1px solid #e5e7eb',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.text}

                    {/* Product Created Card */}
                    {msg.execution?.type === 'PRODUCT_CREATED' && (
                      <div style={{
                        marginTop: '12px',
                        padding: '14px',
                        backgroundColor: '#f0ffd4',
                        borderRadius: '14px',
                        border: '1.5px solid #c8f135',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 800, fontSize: '0.85rem' }}>
                          <CheckCircle2 size={16} />
                          <span>Product Published to Store!</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0a0a0a' }}>
                          {msg.execution.product.title} — ₹{msg.execution.product.price}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <a 
                            href={`/${creatorId}`} 
                            target="_blank"
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#0a0a0a',
                              color: '#c8f135',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>View Store</span> <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Photo Upload Prompt */}
                    {pendingUploadProductId && msg.execution?.product?.id === pendingUploadProductId && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '12px',
                        border: '1px dashed #3b82f6',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af' }}>
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
                          style={{ fontSize: '0.8rem' }}
                        />
                        {uploadingImage && <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>Uploading photo...</span>}
                      </div>
                    )}

                    {/* Product Updated Card */}
                    {msg.execution?.type === 'PRODUCT_UPDATED' && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#dcfce7',
                        borderRadius: '12px',
                        border: '1px solid #86efac',
                        color: '#166534',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <CheckCircle2 size={16} />
                        <span>Product details updated in Supabase!</span>
                      </div>
                    )}
                  </div>

                  <span style={{ fontSize: '0.7rem', color: '#9ca3af', padding: '0 6px' }}>
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  borderBottomLeftRadius: '4px',
                  width: 'fit-content',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0a0a0a', animation: 'pulse 1s infinite' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#c8f135', animation: 'pulse 1s infinite 0.2s' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0a0a0a', animation: 'pulse 1s infinite 0.4s' }} />
                  <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600 }}>AI is thinking & executing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div style={{
              padding: '10px 16px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}>
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.text)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '100px',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#1e293b',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Recording Active Waveform */}
            {isListening && (
              <div style={{
                padding: '12px 20px',
                backgroundColor: '#fef2f2',
                borderTop: '1.5px solid #f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'pulse 1.5s infinite'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 0.8s infinite' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b' }}>
                    Listening live... Speak in Tanglish/Tamil (Auto-sends on pause!)
                  </span>
                </div>
                <button
                  onClick={stopListening}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Stop
                </button>
              </div>
            )}

            {/* Input Bar */}
            <div style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <button
                type="button"
                onClick={toggleListening}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: isListening ? '#ef4444' : '#0a0a0a',
                  color: isListening ? '#ffffff' : '#c8f135',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: isListening ? '0 0 16px rgba(239,68,68,0.5)' : '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease'
                }}
                title={isListening ? 'Click to stop listening' : 'Speak in Tanglish / Tamil'}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <input
                type="text"
                placeholder={isListening ? "Listening live... speak now" : "Type or speak in Tamil / Tanglish / English..."}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '100px',
                  border: '1.5px solid #e5e7eb',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none',
                  color: '#0a0a0a',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: inputMessage.trim() && !loading ? '#c8f135' : '#f1f5f9',
                  color: inputMessage.trim() && !loading ? '#0a0a0a' : '#94a3b8',
                  border: 'none',
                  cursor: inputMessage.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Send size={18} />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
