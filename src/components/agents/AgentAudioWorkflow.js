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
  branding,
  endpoint,
  placeholder,
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
  useEffect(() => {
    if (responseRef.current && response) {
      responseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [response]);
  useEffect(() => {
    if (resultRef.current && (userInput || micState === "transcribing")) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [userInput, micState]);
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
  useEffect(() => {
    if (transcriptionCompleted) {
      console.log(
        "Transcription completed, attempting to click the submit button."
      );
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        console.log("Submit button found, clicking it.");
        submitButton.click();
      } else {
        console.error("Submit button not found.");
      }
      setTranscriptionCompleted(false); // Reset the state after clicking
    }
  }, [transcriptionCompleted]);
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
    // N'envoie la transcription que si l'annulation n'a pas été demandée
    if (!isCancelled && tempTranscriptRef.current) {
      const newInput = userInput
        ? userInput + " " + tempTranscriptRef.current
        : tempTranscriptRef.current;
      setUserInput(newInput);
      handleSubmit({ preventDefault: () => {} }, newInput);
    }
    tempTranscriptRef.current = "";
    // Réinitialise isCancelled après coup
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
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    setShowMic(!userInput || userInput.trim().length === 0);
  }, [userInput]);
  const [selectedTone, setSelectedTone] = useState(null);
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
      setTimeout(() => {
        if (responseRef.current) {
          responseRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 150);
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
  useEffect(() => {
    if (micState === "transcribing" && !isCancelled) {
      console.log(
        "Transcription completed, attempting to click the submit button."
      );
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        console.log("Submit button found, clicking it.");
        submitButton.click();
      } else {
        console.error("Submit button not found.");
      }
    }
  }, [micState, isCancelled]);
  return (
    <main className={`min-h-screen h-full w-full bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} ${colors.textColor}`} style={{ minHeight: '100vh', height: '100%', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      {/* Header with agent image and name */}
      <header className="sticky top-0 z-40 py-3 px-4 bg-gradient-to-r from-black/60 to-transparent backdrop-blur-md">
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
            <div>
              <div className="text-lg font-bold text-white drop-shadow-lg">{branding?.name}</div>
              <div className="text-xs text-white/80 max-w-xs">{branding?.description}</div>
            </div>
          </div>
          <GoogleMenu />
        </div>
      </header>
      <div className="container mx-auto px-4 py-4 flex flex-col h-[calc(100vh-80px)]">
        {/* Zone de chat */}
        <div className="flex-1 overflow-y-auto pb-32">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <svg className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" /></svg>
              <p className="text-sm">La conversation apparaîtra ici.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-sm ${msg.role === "user" ? "bg-white text-gray-900" : `${colors.responseBg} text-white border ${colors.responseBorder}`}`}>{msg.text}</div>
            </div>
          ))}
          <div ref={responseRef}></div>
        </div>
        {/* Barre d'input collée au dernier message */}
        <form onSubmit={handleSubmit} className="w-full bg-gradient-to-t from-black/60 to-transparent px-4 py-4 flex items-center gap-2 mt-2">
          {/* Animation micro pendant l'enregistrement uniquement */}
          {micState === "recording" && (
            <ChatGPTMicAnimation amplitude={micAmplitude} text="Enregistrement..." color={colors.responseBg} />
          )}
          <div className="flex-1 relative">
            <div className="relative w-full max-w-xl mx-auto">
              {/* Overlay amplitude animation in textarea during recording */}
              {micState === "recording" && (
                <div className="absolute left-0 right-0 top-0 flex items-center justify-center pointer-events-none h-full z-10">
                  <ChatGPTMicAnimation amplitude={micAmplitude} text="" color={colors.responseBg} />
                </div>
              )}
              <div className="flex items-center w-full">
                <textarea
                  ref={textareaRef}
                  value={isLoading ? "" : (micState === "transcribing" ? "Transcription en cours..." : userInput)}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder={isLoading ? "" : ((micState === "recording" || micState === "transcribing") ? "" : "Poser une question")}
                  className={`w-full min-h-[36px] max-h-[80px] resize-none rounded-xl p-2 pr-24 border ${colors.responseBorder} focus:${colors.buttonHoverFrom} focus:${colors.buttonHoverTo} focus:ring ${colors.buttonHoverFrom}/50 focus:outline-none transition-all duration-200 text-base ${(micState === "recording" || micState === "transcribing") ? "bg-gray-300 text-gray-500" : isLoading ? `${colors.responseBg} text-gray-400` : "bg-white/80 text-gray-900"} ${micState === "transcribing" ? "text-center font-semibold" : ""} md:mb-0 mb-16`}
                  rows={1}
                  disabled={isLoading || micState === "recording" || micState === "transcribing"}
                  style={{overflowY: 'auto', textAlign: micState === "transcribing" ? "center" : undefined, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", position: 'relative', zIndex: 20}}
                />
                {/* Croix à l'intérieur du textarea à gauche lors de l'enregistrement */}
                {micState === "recording" && (
                  <button type="button" onClick={cancelRecording} className="ml-2 bg-white/80 hover:bg-red-200 text-red-600 rounded-full p-1 border border-red-200 flex items-center justify-center transition-all duration-200" aria-label="Annuler" style={{ width: 28, height: 28, boxShadow: 'none' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
                {/* Micro, bouton d'envoi et sélecteur de langue à droite de l'input */}
                <div className="flex items-center gap-2 ml-2">
                  {micState === "transcribing"
                    ? (
                      <button
                        type="submit"
                        disabled
                        className={`bg-gray-300 text-gray-400 font-bold p-2 rounded-full flex items-center justify-center text-lg transition-all duration-300 cursor-not-allowed`}
                        style={{ width: 32, height: 32, boxShadow: 'none' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                      </button>
                    )
                    : (
                      micState === "recording" ? (
                        <>
                          {/* Valider (check) */}
                          <button type="button" onClick={() => { setIsCancelled(false); setMicState('transcribing'); if (mediaRecorderRef.current) mediaRecorderRef.current.stop(); }} className="bg-white/80 hover:bg-green-200 text-green-600 rounded-full p-1 border border-green-200 flex items-center justify-center transition-all duration-200 ml-1" aria-label="Valider" style={{ width: 28, height: 28, boxShadow: 'none' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </button>
                        </>
                      ) : (
                        <>
                          {(!userInput || userInput.trim().length === 0) && (
                            <motion.button type="button" onClick={handleMicClick} className={`bg-transparent hover:bg-white/20 text-gray-700 rounded-full p-1 border-none flex items-center justify-center transition-all duration-200 ${micState === "transcribing" ? "opacity-60 cursor-wait" : ""}`} aria-label={micState === "idle" ? "Démarrer l'enregistrement" : micState === "recording" ? "Valider" : "Transcription en cours"} disabled={micState === "transcribing"} style={{ width: 28, height: 28, boxShadow: 'none' }}>
                              <ChatGPTMicIcon className="h-5 w-5 opacity-80" />
                            </motion.button>
                          )}
                          {/* Sélecteur de langue avec icône à droite */}
                          {!isLoading && (
                            <div className="flex items-center gap-1 ml-2">
                              <select
                                id="language-select"
                                value={targetLang}
                                onChange={handleLanguageChange}
                                className={`px-2 py-1 rounded-lg border ${colors.borderColor} bg-gray-900 ${colors.textColor} focus:ring focus:outline-none transition-all text-xs`}
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
                            </div>
                          )}
                          <button
                            type="submit"
                            disabled={isLoading || !userInput.trim()}
                            className={`bg-gradient-to-r ${colors.buttonGradientFrom} ${colors.buttonGradientTo} ${colors.buttonHoverFrom} ${colors.buttonHoverTo} text-white font-bold p-2 rounded-full flex items-center justify-center text-lg transition-all duration-300 ml-1`}
                            style={{ width: 32, height: 32, boxShadow: 'none' }}
                          >
                            {isLoading ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            )}
                          </button>
                        </>
                      )
                    )}
            </div>
          </div>
              </div>
            </div>
            </form>
          </div>
        </main>
  );
}