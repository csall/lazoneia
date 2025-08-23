
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function ChatGPTAudioInput({ onSubmit }) {
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  // Démarrer dictée
  const startRecording = () => {
    if (recording) return;
    setTranscript("");
    setRecording(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "fr-FR";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onresult = (event) => {
      const t = Array.from(event.results).map(r => r[0].transcript).join("");
      setTranscript(t);
    };
    recognitionRef.current.onend = () => {
      setRecording(false);
    };
    recognitionRef.current.start();
  };

  // Valider dictée
  const validateRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setRecording(false);
    if (transcript.trim()) {
      setInput(transcript);
      if (onSubmit) onSubmit(transcript);
    }
    setTranscript("");
  };

  // Annuler dictée
  const cancelRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setRecording(false);
    setTranscript("");
  };

  // Soumettre texte tapé
  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (onSubmit) onSubmit(input);
  };

  return (
    <form className="w-full" onSubmit={handleInputSubmit} autoComplete="off">
      <div className="relative w-full flex items-center">
        <input
          type="text"
          value={recording ? transcript : input}
          onChange={e => setInput(e.target.value)}
          placeholder="Écrivez ou parlez..."
          className={`w-full py-3 pl-4 pr-12 rounded-xl border border-gray-300 bg-white text-gray-900 text-base shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${recording ? 'ring-2 ring-indigo-400' : ''}`}
          autoFocus
          readOnly={recording}
        />
        {/* Micro bouton ou annuler/valider pendant dictée */}
        {!recording ? (
          <button
            type="button"
            onMouseDown={startRecording}
            onTouchStart={startRecording}
            onMouseUp={validateRecording}
            onTouchEnd={validateRecording}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-2 shadow-lg border-2 border-indigo-300/60 transition-all duration-200"
            aria-label="Parler"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="9" y="3" width="6" height="12" rx="3" fill="currentColor" />
              <rect x="7" y="15" width="10" height="2" rx="1" fill="currentColor" />
              <rect x="10" y="17" width="4" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
        ) : (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              type="button"
              onClick={cancelRecording}
              className="bg-red-600/80 hover:bg-red-700 text-white rounded-full p-2 shadow-lg border border-red-300/40 transition-all duration-200"
              aria-label="Annuler"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={validateRecording}
              className="bg-green-600/80 hover:bg-green-700 text-white rounded-full p-2 shadow-lg border border-green-300/40 transition-all duration-200"
              aria-label="Valider"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        )}
        {/* Trait animé sous le champ : visible uniquement pendant l'enregistrement */}
        {recording && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 origin-left"
            style={{ zIndex: 2 }}
          />
        )}
      </div>
    </form>
  );
}
