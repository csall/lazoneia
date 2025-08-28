"use client";
import GoogleMenu from "@/components/navigation/GoogleMenu";
import { useState, useRef, useEffect } from "react";
import ChatGPTMicIcon from "../../components/ChatGPTMicIcon";
import ChatGPTMicAnimation from "../../components/ChatGPTMicAnimation";
import TranscribingDotsAnimation from "../../components/TranscribingDotsAnimation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AgentAudioWorkflow({
  // ...hooks principaux...
  branding,
  endpoint,
  placeholder,
  tagline,
  botImage,
  tones=[],
  sendButtonLabel = "Envoyer", // Default label for the submit button
  defaultLang = "français", // New prop for default language
  colors = {
    gradientFrom: "from-indigo-900",
    gradientTo: "to-violet-800",
    textColor: "text-white",
    buttonGradientFrom: "from-indigo-500",
    buttonGradientTo: "to-violet-600",
    buttonHoverFrom: "hover:from-indigo-600",
    buttonHoverTo: "hover:to-violet-700",
    borderColor: "border-indigo-500/30",
    placeholderColor: "placeholder-indigo-300",
    responseBg: "bg-indigo-900/30",
    responseBorder: "border-indigo-700/30",
  },
}) {
  const responseRef = useRef(null);
  const [micState, setMicState] = useState("idle");
  const [micError, setMicError] = useState("");
  const [showMic, setShowMic] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const resultRef = useRef(null);
  const [micAmplitude, setMicAmplitude] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  // Nouvelle gestion du micro façon ChatGPT
  const handleMicClick = async () => {
    if (micState === "idle" || micState === "error") {
      setMicError("");
      setMicState("recording");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new window.MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 32;
        source.connect(analyser);
        let animationFrame;
        const updateAmplitude = () => {
          const data = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          const bars = Array.from({ length: 7 }, (_, i) => {
            const start = Math.floor((i * data.length) / 7);
            const end = Math.floor(((i + 1) * data.length) / 7);
            const avg = Math.max(...data.slice(start, end));
            return Math.min(40, 8 + Math.round((avg / 255) * 24 * 1.5));
          });
          setMicAmplitude(bars);
          animationFrame = requestAnimationFrame(updateAmplitude);
        };
        updateAmplitude();
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        recorder.onstop = async () => {
          stream.getTracks().forEach((track) => track.stop());
          setMicAmplitude([]);
          if (animationFrame) cancelAnimationFrame(animationFrame);
          audioCtx.close();
          // Ne pas lancer la transcription si annulation
          if (isCancelled) {
            setMicState("idle");
            return;
          }
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          if (audioBlob.size < 1000) {
            setMicError("Aucun son détecté. Veuillez parler plus fort ou plus longtemps.");
            setMicState("error");
            return;
          }
          setMicState("transcribing");
          try {
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");
            const res = await fetch("/api/whisper-transcribe", { method: "POST", body: formData });
            const data = await res.json();
            if (data.text) {
              setMicState("idle");
              setUserInput("");
              handleSubmit({ preventDefault: () => {} }, data.text);
            } else {
              setMicState("error");
            }
          } catch {
            setMicError("Erreur réseau ou backend");
            setMicState("error");
          }
        };
        recorder.start();
      } catch (err) {
        setMicError("Impossible d'accéder au micro");
        setMicState("error");
      }
    } else if (micState === "recording") {
      setMicState("transcribing");
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    }
  };
  const [transcriptionCompleted, setTranscriptionCompleted] = useState(false);
  const handleAudioStop = async (stream) => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    stream.getTracks().forEach((track) => track.stop());
    if (audioBlob.size < 1000) {
      setMicError(
        "Aucun son détecté. Veuillez parler plus fort ou plus longtemps."
      );
      setMicState("error");
      return;
    }
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    try {
      const res = await fetch("/api/whisper-transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.text) {
        setUserInput(data.text);
        setMicState("idle");
        setTranscriptionCompleted(true); // Mark transcription as completed
      } else {
        setMicState("error");
      }
    } catch (err) {
      setMicError("Erreur réseau ou backend");
      setMicState("error");
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [micButtonActive, setMicButtonActive] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const recognitionRef = useRef(null);
  const micButtonRef = useRef(null);
  const tempTranscriptRef = useRef("");
  const recordingActiveRef = useRef(false);
  // Corrige l'espace blanc en bas quand le clavier mobile se ferme
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const handleBlur = () => {
      // Réinitialise le padding-bottom du parent
      const parent = textarea.parentElement;
      if (parent) {
        parent.style.paddingBottom = '';
      }
    };
    textarea.addEventListener('blur', handleBlur);
    return () => {
      textarea.removeEventListener('blur', handleBlur);
    };
  }, []);
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicSupported(false);
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "fr-FR";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onresult = (event) => {
      if (!recordingActiveRef.current) return;
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      tempTranscriptRef.current = transcript;
    };
    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      recordingActiveRef.current = true;
    };
    recognitionRef.current.onend = () => {
  setIsRecording(false);
  setMicButtonActive(false);
  recordingActiveRef.current = false;
    };
    recognitionRef.current.onerror = () => {
      setIsRecording(false);
      setMicButtonActive(false);
      recordingActiveRef.current = false;
    };
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, []);
  const stopRecording = () => {
    if (!recognitionRef.current) return;
    recordingActiveRef.current = false;
    recognitionRef.current.stop();
    // N'envoie plus la transcription ici pour éviter le doublon
    if (!isCancelled && tempTranscriptRef.current) {
      const newInput = userInput
        ? userInput + " " + tempTranscriptRef.current
        : tempTranscriptRef.current;
      setUserInput(newInput);
      // handleSubmit({ preventDefault: () => {} }, newInput); // SUPPRIMÉ pour éviter le doublon
    }
    tempTranscriptRef.current = "";
    setIsCancelled(false);
  };
  const cancelRecording = () => {
    setIsCancelled(true);
    recordingActiveRef.current = false;
    // Stop MediaRecorder if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    // Stop SpeechRecognition if active
    if (recognitionRef.current && recognitionRef.current.state !== "inactive") {
      recognitionRef.current.stop();
    }
    tempTranscriptRef.current = "";
    setMicState("idle");
    setUserInput("");
  };
  const handleMicMouseUp = (e) => {
    if (!micButtonRef.current) return;
    const rect = micButtonRef.current.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      cancelRecording();
    } else {
      stopRecording();
    }
    recordingActiveRef.current = false;
    window.removeEventListener("mouseup", handleMicMouseUp);
    window.removeEventListener("mousemove", handleMicMouseMove);
  };
  const handleMicMouseMove = (e) => {
    if (!micButtonRef.current) return;
    const rect = micButtonRef.current.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setIsCancelled(true);
      cancelRecording();
    } else {
      setIsCancelled(false);
    }
  };
  const handleMicTouchEnd = (e) => {
    if (!micButtonRef.current) return;
    const touch = e.changedTouches[0];
    const rect = micButtonRef.current.getBoundingClientRect();
    if (
      touch.clientX < rect.left ||
      touch.clientX > rect.right ||
      touch.clientY < rect.top ||
      touch.clientY > rect.bottom
    ) {
      cancelRecording();
    } else {
      stopRecording();
    }
    recordingActiveRef.current = false;
    window.removeEventListener("touchend", handleMicTouchEnd);
    window.removeEventListener("touchmove", handleMicTouchMove);
  };
  const handleMicTouchMove = (e) => {
    if (!micButtonRef.current) return;
    const touch = e.touches[0];
    const rect = micButtonRef.current.getBoundingClientRect();
    if (
      touch.clientX < rect.left ||
      touch.clientX > rect.right ||
      touch.clientY < rect.top ||
      touch.clientY > rect.bottom
    ) {
      setIsCancelled(true);
      cancelRecording();
    } else {
      setIsCancelled(false);
    }
  };
  // Sélecteur de ton comme pour la langue
  const [selectedTone, setSelectedTone] = useState(tones.length > 0 ? tones[0].value : "");
  const handleToneSelection = (tone) => {
    setSelectedTone(tone);
  };
  const textareaBackground =
    micState === "recording" || micState === "transcribing"
      ? "bg-black/50 text-white"
      : colors.responseBg;
  const [targetLang, setTargetLang] = useState(defaultLang); // Use defaultLang for initial state

  const handleLanguageChange = (e) => {
    setTargetLang(e.target.value);
  };
  // Nouveau : historique des messages
  const [historyKey, setHistoryKey] = useState(null);
  const [messages, setMessages] = useState([]);
  // Mémorise la clé d'agent dès que branding.name est disponible
  useEffect(() => {
    if (branding?.name) {
      setHistoryKey(`agent_chat_history_${branding.name}`);
    }
  }, [branding?.name]);

  // Charge l'historique uniquement quand la clé est stable
  useEffect(() => {
    if (typeof window !== "undefined" && historyKey) {
      const saved = localStorage.getItem(historyKey);
      if (saved) setMessages(JSON.parse(saved));
    }
  }, [historyKey]);

  // Sauvegarde l'historique à chaque changement
  useEffect(() => {
    if (typeof window !== "undefined" && historyKey) {
      localStorage.setItem(historyKey, JSON.stringify(messages));
    }
  }, [messages, historyKey]);
  // Vider l'historique
  const clearHistory = () => {
    setMessages([]);
    if (typeof window !== "undefined" && historyKey) {
      localStorage.removeItem(historyKey);
    }
  };
  // Supprimer un message individuel
  const deleteMessage = (idx) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated.splice(idx, 1);
      return updated;
    });
  };
  // Fonction de copie fiable
  const handleCopy = async (text, idx) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
      } catch {}
    } else {
      // Fallback pour vieux navigateurs
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
      } catch {}
      document.body.removeChild(textarea);
    }
  };
  // Indique quel message a été copié
  const [copiedIdx, setCopiedIdx] = useState(null);

  // Ajout d'un message utilisateur et bot dans l'historique
  const handleSubmit = async (e, overrideInput) => {
    if (e && e.preventDefault) e.preventDefault();
    const input = overrideInput !== undefined ? overrideInput : userInput;
    if (!input.trim()) return;
    setIsLoading(true);
    setIsCopied(false);
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          tone: selectedTone,
          targetLang: targetLang,
        }),
      });
      let resultText = "";
      if (!res.ok) {
        resultText = `Erreur réseau (${res.status})`;
      } else {
        try {
          const json = await res.json();
          resultText = json[0]?.text || "";
        } catch {
          resultText = await res.text();
          resultText = JSON.parse(resultText)[0]?.text || "";
        }
      }
      setResponse(resultText);
      setMessages((prev) => [...prev, { role: "bot", text: resultText }]);
    } catch (err) {
      setResponse("Erreur lors de la requête : " + err.message);
      setMessages((prev) => [...prev, { role: "bot", text: "Erreur lors de la requête : " + err.message }]);
    }
    setIsLoading(false);
    setUserInput("");
  };
  const handleClear = () => {
    setUserInput("");
    setResponse("");
    setIsCopied(false);
  };
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Échec lors de la copie:", err);
    }
  };
  const lastBotMsgRef = useRef(null);

  useEffect(() => {
    if (lastBotMsgRef.current) {
      lastBotMsgRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
  if (!isLoading && resultRef.current) {
    resultRef.current.scrollTop = resultRef.current.scrollHeight;
  }
}, [isLoading, messages]);

// Pour éviter que l'input ne superpose le dernier message sur mobile, ajoute un padding-bottom dynamique à la zone scrollable
useEffect(() => {
  if (resultRef.current) {
    // Hauteur de l'input (form)
    const inputBar = document.querySelector('form');
    if (inputBar) {
      resultRef.current.style.paddingBottom = inputBar.offsetHeight + 'px';
    } else {
      resultRef.current.style.paddingBottom = '110px'; // fallback
    }
  }
}, [isLoading, messages]);

  return (

  <main className={`flex flex-col h-screen bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} ${colors.textColor}`}>
    {/* Fixed header for mobile */}
    <header className="z-50 py-3 px-4 bg-gradient-to-r from-black/60 to-transparent backdrop-blur-md fixed top-0 left-0 w-full">
      <div className="container mx-auto flex justify-between items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" replace>
            <motion.button
              className={`w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-lg hover:bg-white/20 transition-colors`}
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Retour à l'accueil"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${colors.textColor}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
        {/* Header agent centré entre la flèche et le menu */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          <Image
            src={branding?.botImage || botImage}
            alt={branding?.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] border-2 border-white/30"
            priority
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-white drop-shadow-lg">{branding?.name}</div>
              {tagline && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-700/80 text-indigo-100 ml-2 drop-shadow">{tagline}</span>
              )}
              <select
                id="language-select-header"
                value={targetLang}
                onChange={handleLanguageChange}
                className={`px-2 py-1 rounded-lg border ${colors.borderColor} bg-gray-900 ${colors.textColor} focus:ring focus:outline-none transition-all text-xs cursor-pointer ml-2`}
                style={{ background: `#E3DEDE` }}
              >
                <option value="français">FR</option>
                <option value="anglais">EN</option>
                <option value="espagnol">ES</option>
                <option value="allemand">DE</option>
                <option value="italien">IT</option>
                <option value="wolof">WO</option>
                <option value="portuguais">PT</option>
              </select>
              {messages.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="p-2 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-red-600 transition cursor-pointer ml-2"
                  title="Supprimer tout l'historique"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6m5 10v-6" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/80 max-w-xs">{branding?.description}</span>
              {/* Suppression déplacée à côté du select langue */}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <GoogleMenu />
        </div>
      </div>
    </header>

    {/* Scrollable messages area with padding for header and input */}
    <div
      ref={resultRef}
      className={`flex-1 overflow-y-auto px-4 py-3 pt-[80px] pb-[110px]`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-300">
          <svg className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" /></svg>
          <p className="text-sm">La conversation apparaîtra ici.</p>
        </div>
      )}
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2 group"}`}
          ref={msg.role === "bot" && idx === messages.length - 1 ? lastBotMsgRef : null}
          {...(msg.role === "bot" ? { 'data-botmsg': true } : {})}
          {...(msg.role === "user" ? { 'data-usermsg': true } : {})}
        >
          <div className="flex items-start">
            <button onClick={() => deleteMessage(idx)} className="mr-2 mt-1 text-gray-400 hover:text-red-500 transition cursor-pointer" title="Supprimer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-sm relative ${msg.role === "user" ? "bg-white text-gray-900" : `${colors.responseBg} text-white border ${colors.responseBorder}`}`}
              style={msg.role === "user" ? {whiteSpace: 'pre-wrap', wordBreak: 'break-word'} : {}}>
              <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              {msg.role === "bot" && (
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.text, idx)}
                    aria-label="Copier le message"
                    className={`relative p-1 rounded focus:outline-none focus:ring text-xs transition cursor-pointer ${copiedIdx === idx ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-indigo-600'}`}
                    onMouseEnter={e => {
                      const tooltip = document.createElement('span');
                      tooltip.textContent = 'Copier';
                      tooltip.className = 'absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 rounded bg-black text-white text-xs whitespace-nowrap z-10';
                      tooltip.style.pointerEvents = 'none';
                      tooltip.setAttribute('id', 'copy-tooltip-' + idx);
                      e.currentTarget.appendChild(tooltip);
                    }}
                    onMouseLeave={e => {
                      const tooltip = e.currentTarget.querySelector('#copy-tooltip-' + idx);
                      if (tooltip) e.currentTarget.removeChild(tooltip);
                    }}
                  >
                    {copiedIdx === idx ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Barre d'input toujours visible en bas */}
    {!isLoading && (
      <form 
        onSubmit={handleSubmit}
        className={`p-3 border-t bg-gradient-to-r from-black/60 to-transparent backdrop-blur-md shadow-lg fixed bottom-0 left-0 w-full z-50 ${colors.textColor}`}
        style={{
          width: '100vw',
          zIndex: 100,
          position: 'fixed',
          bottom: 0,
          left: 0,
          boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom, 20px)',
        }}
      >
        {/* Animation micro pendant l'enregistrement uniquement */}
        {micState === "recording" && (
          <ChatGPTMicAnimation amplitude={micAmplitude} text="Enregistrement..." color={colors.responseBg} />
        )}
        <div className="relative flex items-end">
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              value={isLoading ? "" : (micState === "transcribing" ? "Transcription en cours..." : userInput)}
              onChange={e => {
                setUserInput(e.target.value);
                if (textareaRef.current) {
                  textareaRef.current.style.height = "auto";
                  textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                }
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              onFocus={() => {}}
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className={`min-h-[44px] max-h-[160px] resize-none rounded-xl p-3 pr-20 border w-full mx-auto text-base sm:text-lg ${colors.responseBorder} focus:${colors.buttonHoverFrom} focus:${colors.buttonHoverTo} focus:ring ${colors.buttonHoverFrom}/50 focus:outline-none transition-all duration-200 shadow-lg ${(micState === "recording" || micState === "transcribing") ? "bg-gray-300 text-gray-500" : isLoading ? `${colors.responseBg} text-gray-400` : "bg-white/80 text-gray-900"} ${micState === "transcribing" ? "text-center font-semibold" : ""}`}
              disabled={isLoading || micState === "recording" || micState === "transcribing"}
              style={{resize: "none", overflow: "hidden", minHeight: "44px", maxHeight: "160px", boxSizing: 'border-box', paddingBottom: 'env(safe-area-inset-bottom, 20px)', textAlign: micState === "transcribing" ? "center" : undefined, fontSize: '1rem'}}
            />
            {/* Micro et bouton d'envoi à l'intérieur du textarea à droite */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              {micState === "recording" ? (
                <>
                  <button type="button" onClick={cancelRecording} className="bg-red-100 hover:bg-red-200 text-red-700 rounded-full p-2 shadow border border-red-200 flex items-center justify-center transition-all duration-200 cursor-pointer" aria-label="Annuler" style={{ width: 40, height: 40 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <button type="button" onClick={handleMicClick} className="bg-green-100 hover:bg-green-200 text-green-700 rounded-full p-2 shadow border border-green-200 flex items-center justify-center transition-all duration-200 cursor-pointer" aria-label="Valider" style={{ width: 40, height: 40 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </button>
                </>
              ) :
                (!userInput || userInput.trim().length === 0) ? (
                  <motion.button type="button" onClick={handleMicClick} className="bg-white/80 hover:bg-indigo-100 text-indigo-700 rounded-full p-2 shadow border border-indigo-200 flex items-center justify-center transition-all duration-200 cursor-pointer" aria-label={micState === "idle" ? "Démarrer l'enregistrement" : micState === "recording" ? "Valider" : "Transcription en cours"} disabled={micState === "transcribing"} style={{ width: 40, height: 40 }}>
                    <ChatGPTMicIcon className="h-6 w-6 opacity-80" />
                  </motion.button>
                ) : null
              }
              <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className={`bg-gradient-to-r ${colors.buttonGradientFrom} ${colors.buttonGradientTo} ${colors.buttonHoverFrom} ${colors.buttonHoverTo} text-white font-bold p-2 rounded-full shadow-lg flex items-center justify-center text-xl transition-all duration-300 cursor-pointer align-middle`}
                style={{ width: 40, height: 40, marginTop: 0, alignSelf: 'center' }}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center ml-2">
            {/* Sélecteur de langue retiré de la zone d'input */}
 
          </div>
      </div>
    </form>
    )}
    </main>
  );
}