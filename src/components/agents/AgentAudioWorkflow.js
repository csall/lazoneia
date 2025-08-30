"use client";
import { useState, useRef, useEffect } from "react";
import Header from "./AgentAudioWorkflow/Header";
import MessageList from "./AgentAudioWorkflow/MessageList";
import InputBar from "./AgentAudioWorkflow/InputBar";

export default function AgentAudioWorkflow({
  // ...hooks principaux...
  branding,
  endpoint,
  placeholder,
  tagline,
  botImage,
  tones=[],
  sendButtonLabel = "Envoyer",
  defaultLang = "français",
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
  // Détection mobile/desktop côté client
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
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
  const micButtonRef = useRef(null);

  // Gestion avancée du clavier mobile : focus, blur, resize

  // Remove stopRecording, only MediaRecorder workflow is used
  const cancelRecording = () => {
    setIsCancelled(true);
    // Stop MediaRecorder if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setMicState("idle");
    setUserInput("");
  };
  // Remove mouse/touch handlers for SpeechRecognition
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
  const [messages, setMessages] = useState([]);
  const [historyKey, setHistoryKey] = useState(null);
  // Gestion du padding pour le clavier mobile façon ChatGPT
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !resultRef.current) return;
    const inputBar = document.querySelector('form');
    const inputHeight = inputBar && inputBar.offsetHeight ? inputBar.offsetHeight : 72;
    // Ajoute le padding uniquement quand l'input est focus
    const handleFocus = () => {
      if (window.innerWidth <= 768) {
        resultRef.current.style.paddingBottom = inputHeight + 'px';
        setTimeout(() => {
          resultRef.current.scrollTop = resultRef.current.scrollHeight;
        }, 100);
      }
    };
    const handleBlur = () => {
      if (window.innerWidth <= 768) {
        resultRef.current.style.paddingBottom = '0px';
        setTimeout(() => {
          resultRef.current.scrollTop = resultRef.current.scrollHeight;
        }, 100);
      }
    };
    textarea.addEventListener('focus', handleFocus);
    textarea.addEventListener('blur', handleBlur);
    return () => {
      textarea.removeEventListener('focus', handleFocus);
      textarea.removeEventListener('blur', handleBlur);
    };
  }, [isLoading, messages]);
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
  setMessages((prev) => [...prev, { role: "user", text: input }, { role: "bot", text: "__loading__" }]);
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
      setMessages((prev) => {
        // Remplace le dernier message bot '__loading__' par la vraie réponse
        const lastIdx = prev.length - 1;
        if (lastIdx >= 0 && prev[lastIdx].role === "bot" && prev[lastIdx].text === "__loading__") {
          return [...prev.slice(0, lastIdx), { role: "bot", text: resultText }];
        }
        return [...prev, { role: "bot", text: resultText }];
      });
    } catch (err) {
      setResponse("Erreur lors de la requête : " + err.message);
      setMessages((prev) => {
        // Remplace le dernier message bot '__loading__' par l'erreur
        const lastIdx = prev.length - 1;
        if (lastIdx >= 0 && prev[lastIdx].role === "bot" && prev[lastIdx].text === "__loading__") {
          return [...prev.slice(0, lastIdx), { role: "bot", text: "Erreur lors de la requête : " + err.message }];
        }
        return [...prev, { role: "bot", text: "Erreur lors de la requête : " + err.message }];
      });
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

// ...supprimé, géré par le focus/blur ci-dessus...
// ...supprimé, géré par le focus/blur ci-dessus...
// ...supprimé, géré par le blur ci-dessus...
// Scroll tout en bas à l'ouverture de la page (après le rendu des messages)
useEffect(() => {
  const timer = setTimeout(() => {
    if (resultRef.current) {
      const inputBar = document.querySelector('form');
      const inputHeight = inputBar && inputBar.offsetHeight ? inputBar.offsetHeight : 110;
      resultRef.current.scrollTop = resultRef.current.scrollHeight - inputHeight;
    }
  }, 100);
  return () => clearTimeout(timer);
}, [messages]);

  return (

  <>
    {/* Background illimité, adapté mobile/desktop */}
    {isMobile ? (
      <div className={`fixed top-0 left-0 w-full min-h-[100vh] h-auto bg-gradient-to-b ${colors.gradientFrom} ${colors.gradientTo}`} style={{zIndex:-1}}></div>
    ) : (
      <div className={`fixed top-0 left-0 w-full min-h-[100vh] h-auto bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo}`} style={{zIndex:-1}}></div>
    )}
    <main className={`relative flex flex-col h-screen ${colors.textColor}`}>
      <Header
        branding={branding}
        botImage={botImage}
        tagline={tagline}
        targetLang={targetLang}
        handleLanguageChange={handleLanguageChange}
        colors={colors}
        messages={messages}
        clearHistory={clearHistory}
      />
      <MessageList
  messages={messages}
  colors={colors}
  lastBotMsgRef={lastBotMsgRef}
  resultRef={resultRef}
  handleCopy={handleCopy}
  copiedIdx={copiedIdx}
  deleteMessage={deleteMessage}
      />
      <InputBar
        micState={micState}
        micAmplitude={micAmplitude}
        isLoading={isLoading}
        textareaRef={textareaRef}
        userInput={userInput}
        setUserInput={setUserInput}
        handleSubmit={handleSubmit}
        cancelRecording={cancelRecording}
        handleMicClick={handleMicClick}
        colors={colors}
        targetLang={targetLang}
        handleLanguageChange={handleLanguageChange}
        selectedTone={selectedTone}
        handleToneSelection={handleToneSelection}
        tones={tones}
      />
    </main>
  </>
  );
}