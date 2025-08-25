"use client";
import GoogleMenu from "@/components/navigation/GoogleMenu";
import { useState, useRef, useEffect } from "react";
import ChatGPTMicIcon from "../../components/ChatGPTMicIcon";
import ChatGPTMicAnimation from "../../components/ChatGPTMicAnimation";
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
  const handleMicClick = async () => {
    if (micState === "idle" || micState === "error") {
      setMicError("");
      setMicState("recording");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new window.MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];
        const audioCtx = new (window.AudioContext ||
          window.webkitAudioContext)();
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
        recorder.onstop = () => {
          handleAudioStop(stream);
          setMicAmplitude([]);
          if (animationFrame) cancelAnimationFrame(animationFrame);
          audioCtx.close();
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
      setIsCancelled(false);
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
    if (!isCancelled && tempTranscriptRef.current) {
      const newInput = userInput
        ? userInput + " " + tempTranscriptRef.current
        : tempTranscriptRef.current;
      setUserInput(newInput);
      handleSubmit({ preventDefault: () => {} }, newInput);
    }
    tempTranscriptRef.current = "";
  };
  const cancelRecording = () => {
    setIsCancelled(true);
    recordingActiveRef.current = false;
    if (recognitionRef.current && recognitionRef.current.state !== "inactive") {
      recognitionRef.current.stop();
    }
    tempTranscriptRef.current = "";
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
  const handleSubmit = async (e, overrideInput) => {
    if (e && e.preventDefault) e.preventDefault();
    const input = overrideInput !== undefined ? overrideInput : userInput;
    if (!input.trim()) return;
    setIsLoading(true);
    setIsCopied(false);
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
      setTimeout(() => {
        if (responseRef.current) {
          try {
            responseRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } catch {
            const rect = responseRef.current.getBoundingClientRect();
            window.scrollTo({
              top: rect.top + window.scrollY - 40,
              behavior: "smooth",
            });
          }
        }
      }, 150);
    } catch (err) {
      setResponse("Erreur lors de la requête : " + err.message);
      setTimeout(() => {
        if (responseRef.current) {
          try {
            responseRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } catch {
            const rect = responseRef.current.getBoundingClientRect();
            window.scrollTo({
              top: rect.top + window.scrollY - 40,
              behavior: "smooth",
            });
          }
        }
      }, 150);
    }
    setIsLoading(false);
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
    <main
      className={`min-h-screen bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} ${colors.textColor}`}
    >
      {/* Header */}
      <header className="py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
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
          <GoogleMenu />
        </div>
      </header>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 md:w-32 md:h-32"
          >
            <Image
              src={branding?.botImage || botImage}
              alt={branding?.name}
              width={128}
              height={128}
              className="w-full h-full drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white drop-shadow-lg">
              {branding?.name}
            </h1>
            <p
              className={`text-sm md:text-base ${colors.textColor} max-w-xl drop-shadow-md`}
            >
              {branding?.description}
            </p>
          </motion.div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`bg-gradient-to-br ${colors.gradientFrom}/50 ${colors.gradientTo}/50 backdrop-blur-md p-4 rounded-xl shadow-lg border ${colors.borderColor}`}
          >
            <h2 className="text-lg font-bold mb-2">Votre texte</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-wrap gap-3 mb-4">
                {tones.map((tone) => (
                  <motion.button
                    key={tone.value}
                    onClick={() => handleToneSelection(tone.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-md text-xs font-medium shadow-sm transition-all duration-300 ${
                      selectedTone === tone.value
                        ? `bg-gradient-to-r ${colors.buttonGradientFrom} ${colors.buttonGradientTo} text-white`
                        : `bg-gray-100 text-gray-800 hover:bg-gray-200`
                    }`}
                  >
                    {tone.label}
                  </motion.button>
                ))}
              </div>
              <div className="relative">
                <div className="relative w-full">
                  <div className="relative w-full" ref={resultRef}>
                    <div className="relative w-full flex items-center justify-center">
                      <div className="relative w-full">
                        <div className="relative">
                          <textarea
                            ref={textareaRef}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={
                              micState === "recording" ||
                              micState === "transcribing"
                                ? ""
                                : placeholder
                            }
                            className={`w-full h-[120px] ${textareaBackground} ${
                              colors.textColor
                            } rounded-lg p-3 border ${
                              colors.responseBorder
                            } focus:${colors.buttonHoverFrom} focus:${
                              colors.buttonHoverTo
                            } focus:ring ${
                              colors.buttonHoverFrom
                            }/50 focus:outline-none resize-none transition-all duration-200 text-sm ${
                              micState === "recording" ||
                              micState === "transcribing"
                                ? "opacity-50"
                                : ""
                            }`}
                            rows={4}
                            disabled={
                              micState === "recording" ||
                              micState === "transcribing"
                            }
                          />
                          {micState === "recording" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ChatGPTMicAnimation
                                text="Recording..."
                                amplitude={micAmplitude}
                                color={`bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo}`}
                              />
                            </div>
                          )}
                          {micState === "transcribing" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold text-lg">
                              Transcription en cours...
                            </div>
                          )}
                          {showMic && (
                            <motion.button
                              type="button"
                              onClick={handleMicClick}
                              className={`absolute top-2 right-2 bg-gradient-to-br ${
                                colors.buttonGradientFrom
                              } ${colors.buttonGradientTo} ${
                                colors.buttonHoverFrom
                              } ${
                                colors.buttonHoverTo
                              } text-white rounded-full p-2 shadow-lg transition-all duration-200 select-none touch-none border-2 border-${colors.buttonGradientFrom.replace(
                                "from-",
                                ""
                              )}/60 ${
                                micState === "recording"
                                  ? `scale-125 ring-4 ${colors.ringColor} ${colors.shadowColor} opacity-80`
                                  : ""
                              } ${
                                micState === "transcribing"
                                  ? "opacity-60 cursor-wait"
                                  : ""
                              }`}
                              aria-label={
                                micState === "idle"
                                  ? "Démarrer l'enregistrement"
                                  : micState === "recording"
                                  ? "Valider"
                                  : "Transcription en cours"
                              }
                              style={{
                                touchAction: "none",
                                WebkitUserSelect: "none",
                                userSelect: "none",
                                WebkitTouchCallout: "none",
                                background:
                                  micState === "recording"
                                    ? `linear-gradient(90deg, ${colors.buttonGradientFrom.replace(
                                        "from-",
                                        ""
                                      )} 60%, ${colors.buttonGradientTo.replace(
                                        "to-",
                                        ""
                                      )} 100%)`
                                    : undefined,
                                opacity: micState === "transcribing" ? 0.6 : 1,
                                cursor:
                                  micState === "transcribing"
                                    ? "wait"
                                    : "pointer",
                              }}
                              disabled={micState === "transcribing"}
                            >
                              {micState === "recording" ? (
                                <svg
                                  className="h-7 w-7 opacity-80 text-white"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : micState === "transcribing" ? null : (
                                <ChatGPTMicIcon className="h-7 w-7 opacity-80" />
                              )}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {micState === "error" && micError && (
                <div className="absolute right-2 top-24 bg-red-700/80 text-white rounded-lg px-3 py-2 text-xs shadow-lg border border-red-400/40 z-30">
                  {micError}
                </div>
              )}
              {isRecording && tempTranscriptRef.current && (
                <p className="mt-2 text-indigo-300 text-xs italic">
                  {tempTranscriptRef.current}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className={`flex-1 bg-gradient-to-r ${colors.buttonGradientFrom} ${colors.buttonGradientTo} ${colors.buttonHoverFrom} ${colors.buttonHoverTo} text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex justify-center items-center text-sm`}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    sendButtonLabel
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className={`bg-transparent border ${colors.borderColor} hover:${colors.buttonHoverFrom} text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm`}
                >
                  Effacer
                </button>
              </div>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`bg-gradient-to-br ${colors.gradientFrom}/50 ${colors.gradientTo}/50 backdrop-blur-md p-4 rounded-xl shadow-lg border ${colors.borderColor} min-h-[240px] flex flex-col`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Réponse</h2>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="language-select"
                  className="text-sm font-medium text-gray-300"
                >
                  Langue :
                </label>
                <select
                  id="language-select"
                  value={targetLang}
                  onChange={handleLanguageChange}
                  className={`px-4 py-2 rounded-lg border ${colors.borderColor} bg-gray-900 ${colors.textColor} focus:ring focus:ring-${colors.ringColor} focus:outline-none transition-all`}
                  style={{
                    background: `#E3DEDE`, // Dark gray for a sleek and readable dropdown
                  }}
                >
                  <option value="français">Français</option>
                  <option value="anglais">Anglais</option>
                  <option value="espagnol">Espagnol</option>
                  <option value="allemand">Allemand</option>
                  <option value="italien">Italien</option>
                  <option value="wolof">Wolof</option>
                  <option value="portuguais">Portugais</option>
                </select>
              </div>
            </div>
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className={`mt-2 ${colors.textColor} text-sm`}>
                  Préparation de la réponse...
                </p>
              </div>
            ) : response ? (
              <div
                ref={responseRef}
                className={`${colors.responseBg} rounded-lg p-3 border ${colors.responseBorder} h-full relative`}
              >
                <p className="whitespace-pre-wrap text-indigo-100 text-sm mb-8">
                  {response}
                </p>
                <button
                  onClick={copyToClipboard}
                  disabled={isRecording}
                  className={`absolute bottom-3 right-3 flex items-center gap-1.5 ${
                    isCopied
                      ? "bg-green-600/70 hover:bg-green-600/90"
                      : isRecording
                      ? "bg-gray-400/60 cursor-not-allowed"
                      : `${colors.buttonGradientFrom}/60 hover:${colors.buttonGradientTo}/80`
                  } text-white text-xs py-1.5 px-3 rounded-lg transition-all duration-300`}
                >
                  {isCopied ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copié!
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copier
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div
                className={`flex-1 flex flex-col items-center justify-center ${colors.textColor}/70`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mb-3 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
                  />
                </svg>
                <p className="text-sm">La réponse apparaîtra ici.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
