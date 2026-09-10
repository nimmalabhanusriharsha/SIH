import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Volume2, X, Sparkles, MessageSquare, ArrowRight, Send, AlertCircle, Loader2 } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { processFarmerAssistantQuery } from '../../../services/farmerAssistantService';

export const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { state, currentUser } = useAppContext();
  const { t, currentLang } = useTranslation();

  const [isListening, setIsListening]   = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // AI request in-flight
  const [transcript, setTranscript]     = useState('');
  const [response, setResponse]         = useState('');
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [textInput, setTextInput]       = useState('');
  const [speechError, setSpeechError]   = useState('');

  const recognitionRef  = useRef(null);
  const processingRef   = useRef(false); // prevents duplicate requests

  const quickQuestions = [
    { text: t('voice.tokenQuery',       'Where is my token?'),          key: 'token'       },
    { text: t('voice.queueQuery',       'Check my queue position'),     key: 'queue'       },
    { text: t('voice.arrivalQuery',     'When should I arrive?'),       key: 'arrival'     },
    { text: t('voice.procurementQuery', 'Check procurement status'),    key: 'procurement' },
    { text: t('voice.paymentQuery',     'Check my payment status'),     key: 'payment'     },
  ];

  // ── Text-To-Speech ───────────────────────────────────────────────────────
  const speak = useCallback((text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang  = currentLang === 'te' ? 'te-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate  = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend   = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  }, [currentLang]);

  // ── Core Query Processing ─────────────────────────────────────────────────
  // Accepts the fresh query text directly — avoids React stale-state bugs.
  const handleProcessQuery = useCallback(async (queryText) => {
    const cleanText = (queryText || '').trim();
    if (!cleanText) return;

    // Prevent duplicate concurrent requests
    if (processingRef.current) return;
    processingRef.current = true;

    setTranscript(cleanText);
    setSpeechError('');
    setIsProcessing(true);
    setResponse('');

    try {
      const result = await processFarmerAssistantQuery(cleanText, {
        state,
        currentUser,
        currentLang,
        t,
      });

      if (result.response) {
        setResponse(result.response);
        speak(result.response);
      }
    } catch (err) {
      // This catch is for unexpected errors (the service already handles AI failures internally)
      console.error('[VoiceModal] Unexpected error:', err.message);
      const errorMsg = t(
        'voice.fallbackResp',
        'The voice assistant is temporarily unavailable. Please try again or type your question.'
      );
      setResponse(errorMsg);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
    }
  }, [state, currentUser, currentLang, t, speak]);

  // ── Browser Speech Recognition ────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (processingRef.current) return; // don't start listening while processing

    setSpeechError('');

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setSpeechError(t('voice.unclearSpeech', 'Speech recognition is not supported in this browser. Please type your question.'));
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang           = currentLang === 'te' ? 'te-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous     = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recognition.onresult = (event) => {
        // Extract the FRESH recognized text directly — never use stale state
        let recognizedText = '';
        if (event.results?.length > 0 && event.results[0].length > 0) {
          recognizedText = event.results[0][0].transcript;
        }
        setIsListening(false);

        if (recognizedText?.trim()) {
          // Pass fresh text directly, not stale transcript state
          handleProcessQuery(recognizedText.trim());
        } else {
          setSpeechError(t('voice.noSpeechDetected', 'I could not hear you. Please tap the microphone and speak again.'));
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        console.warn('[VoiceModal] SpeechRecognition error:', event.error);
        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            setSpeechError(t('voice.micDenied', 'Please allow microphone access to use the voice assistant.'));
            break;
          case 'no-speech':
            setSpeechError(t('voice.noSpeechDetected', 'I could not hear you. Please tap the microphone and speak again.'));
            break;
          case 'audio-capture':
            setSpeechError('No microphone is available. Please check your device settings.');
            break;
          case 'network':
            setSpeechError('Voice service is temporarily unavailable. Please try again.');
            break;
          default:
            setSpeechError(t('voice.unclearSpeech', 'I did not catch that clearly. Please try again or type your question below.'));
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('[VoiceModal] Failed to start speech recognition:', err);
      setIsListening(false);
      setSpeechError(t('voice.unclearSpeech', 'Could not activate microphone. Please type your question below.'));
    }
  }, [currentLang, t, handleProcessQuery]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
    setIsListening(false);
  }, []);

  const handleTextSubmit = useCallback((e) => {
    e.preventDefault();
    if (textInput.trim() && !processingRef.current) {
      handleProcessQuery(textInput.trim());
      setTextInput('');
    }
  }, [textInput, handleProcessQuery]);

  // ── Reset on open/close ───────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setResponse('');
      setTranscript('');
      setSpeechError('');
      setTextInput('');
      setIsProcessing(false);
      processingRef.current = false;
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
      }
      setIsSpeaking(false);
      setIsListening(false);
      setIsProcessing(false);
      processingRef.current = false;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Status label ─────────────────────────────────────────────────────────
  const statusLabel = isListening
    ? t('voice.listening', 'Listening to your voice...')
    : isProcessing
    ? t('voice.thinking', 'Thinking...')
    : isSpeaking
    ? 'Speaking response...'
    : t('voice.subtitle', 'Speak in your preferred language');

  const micDisabled = isProcessing || isSpeaking;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-farmer-elevated overflow-hidden border border-farmer-border animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-farmer-primary p-4 sm:p-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
              {isProcessing
                ? <Loader2 className="w-5 h-5 text-farmer-accent animate-spin" />
                : <Sparkles className="w-5 h-5 text-farmer-accent animate-pulse" />}
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-white">
                {t('voice.title', 'Voice Assistant')}
              </h3>
              <p className="text-xs text-farmer-primary-light opacity-90 font-medium">
                {statusLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 flex flex-col items-center justify-start bg-farmer-bg overflow-y-auto space-y-4">

          {/* Mic Button / Processing Indicator */}
          <div className="relative my-2 flex flex-col items-center">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-farmer-primary/20 animate-ping" />
                <div className="absolute -inset-4 rounded-full bg-farmer-primary/10 animate-pulse" />
              </>
            )}
            {isSpeaking && (
              <div className="absolute -inset-3 rounded-full bg-farmer-accent/30 animate-pulse" />
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              disabled={micDisabled}
              className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-farmer-elevated ${
                isListening  ? 'bg-farmer-error text-white scale-110 ring-4 ring-farmer-error/20' :
                isSpeaking   ? 'bg-farmer-accent text-farmer-text ring-4 ring-farmer-accent/20' :
                isProcessing ? 'bg-farmer-secondary text-white opacity-60 cursor-not-allowed' :
                               'bg-farmer-primary hover:bg-farmer-primary-dark text-white hover:scale-105'
              }`}
              aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
            >
              {isProcessing ? (
                <Loader2 className="w-9 h-9 sm:w-10 sm:h-10 animate-spin" />
              ) : isListening ? (
                <Mic className="w-9 h-9 sm:w-10 sm:h-10 animate-bounce" />
              ) : isSpeaking ? (
                <Volume2 className="w-9 h-9 sm:w-10 sm:h-10 animate-pulse" />
              ) : (
                <Mic className="w-9 h-9 sm:w-10 sm:h-10 text-farmer-accent" />
              )}
            </button>
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-farmer-secondary text-center">
            {isListening   ? t('voice.listening', 'Listening to your voice...')
             : isProcessing ? t('voice.thinking', 'Thinking...')
             : t('voice.speakNow', 'Tap microphone to speak')}
          </p>

          {/* Speech Error Banner */}
          {speechError && (
            <div className="w-full bg-farmer-warning-light text-farmer-text px-4 py-2.5 rounded-xl border border-farmer-warning/40 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-farmer-warning shrink-0" />
              <span>{speechError}</span>
            </div>
          )}

          {/* You Said: Transcript Card */}
          {transcript && (
            <div className="w-full bg-white p-4 rounded-2xl border border-farmer-border shadow-sm text-left animate-in fade-in">
              <span className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider block mb-1">
                {t('voice.youSaid', 'You said:')}
              </span>
              <p className="text-xs sm:text-sm font-bold text-farmer-text">
                &ldquo;{transcript}&rdquo;
              </p>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="w-full bg-white p-4 rounded-2xl border border-farmer-primary/20 shadow-sm text-left animate-in fade-in flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-farmer-primary animate-spin shrink-0" />
              <p className="text-xs sm:text-sm font-semibold text-farmer-secondary">
                {t('voice.thinking', 'Thinking...')}
              </p>
            </div>
          )}

          {/* Assistant Response Card */}
          {response && !isProcessing && (
            <div className="w-full bg-white text-farmer-text p-4 sm:p-5 rounded-2xl text-left border border-farmer-primary/30 shadow-farmer-card animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-1.5 mb-2 text-farmer-primary text-xs font-bold uppercase tracking-wider">
                <Volume2 className="w-4 h-4 text-farmer-accent" />
                <span>{t('voice.assistant', 'Assistant:')}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed text-farmer-text">
                {response}
              </p>
            </div>
          )}

          {/* Text Input */}
          <form onSubmit={handleTextSubmit} className="w-full flex gap-2 pt-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isProcessing}
              placeholder={t('voice.typePlaceholder', 'Type your question here...')}
              className="flex-1 min-h-[44px] px-3.5 rounded-xl border border-farmer-border bg-white text-xs sm:text-sm font-medium text-farmer-text placeholder:text-farmer-secondary focus:outline-none focus:ring-2 focus:ring-farmer-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isProcessing}
              className="px-4 bg-farmer-primary hover:bg-farmer-primary-dark disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 min-h-[44px] transition-colors"
            >
              {isProcessing
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <><span>{t('voice.send', 'Ask')}</span><Send className="w-3.5 h-3.5" /></>}
            </button>
          </form>

        </div>

        {/* Suggested Queries */}
        <div className="p-4 sm:p-5 bg-white border-t border-farmer-border shrink-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-farmer-secondary mb-2.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-farmer-primary" />
            <span>{t('voice.quickQuestions', 'Suggested Questions')}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleProcessQuery(q.text)}
                disabled={isProcessing || isListening}
                className="text-xs font-semibold bg-farmer-bg text-farmer-text border border-farmer-border hover:border-farmer-primary hover:bg-farmer-primary-light px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm min-h-[36px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{q.text}</span>
                <ArrowRight className="w-3 h-3 text-farmer-primary shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VoiceAssistantModal;
