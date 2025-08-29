import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InputBar({
  micState,
  micAmplitude,
  isLoading,
  textareaRef,
  userInput,
  setUserInput,
  handleSubmit,
  cancelRecording,
  handleMicClick,
  colors,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderAnim, setPlaceholderAnim] = useState(false);
  const inputRef = textareaRef;

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-end px-1 pb-2 sm:px-4 sm:pb-4"
      style={{
        background: "none",
        boxShadow: "none",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        border: "none",
        minHeight: "72px",
      }}
    >
      <motion.div
        className="flex items-center w-full max-w-full mx-auto rounded-3xl px-2 py-2 sm:max-w-2xl sm:px-4 sm:py-3"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        style={{
          boxShadow: "none",
          background: "none",
          borderRadius: 24,
        }}
      >
        {/* Annuler enregistrement */}
        {micState === "recording" && (
          <motion.button
            type="button"
            onClick={cancelRecording}
            className="mr-2 bg-gray-300  hover:bg-gray-400 text-gray-700 rounded-full p-3 shadow border border-gray-400 flex items-center justify-center transition-all duration-200 cursor-pointer"
            whileTap={{ scale: 0.9 }}
            aria-label="Annuler l'enregistrement"
            style={{ width: 56, height: 56, minWidth: 44, minHeight: 44 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        )}
        {/* Input animé */}
        <div className="relative flex-1 min-w-0">
          <motion.textarea
            ref={inputRef}
            value={
              micState === "recording"
                ? ""
                : micState === "transcribing"
                ? "Transcription en cours..."
                : userInput
            }
            onChange={(e) => {
              setUserInput(e.target.value);
              if (inputRef.current) {
                inputRef.current.style.height = "auto";
                inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
              }
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                userInput.trim().length > 0
              ) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onFocus={() => {
              setIsFocused(true);
              setPlaceholderAnim(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setPlaceholderAnim(false);
            }}
            disabled={
              isLoading ||
              micState === "recording" ||
              micState === "transcribing"
            }
            rows={1}
            className={`w-full min-h-[44px] max-h-[120px] resize-none rounded-2xl px-3 pr-16 py-3 text-base bg-white/40 text-gray-900 border border-white/20 shadow-xl focus:ring-2 focus:ring-indigo-400/80 focus:border-indigo-500 transition-all duration-300 scrollbar-hide ${
              micState === "transcribing" ? "text-center font-semibold" : ""
            } sm:text-lg sm:px-5 sm:pr-20 sm:py-4`}
            style={{
              boxSizing: "border-box",
              fontSize: "1.05rem",
              backdropFilter: "blur(6px)",
              letterSpacing: "0.01em",
              scrollbarWidth: "none",
            }}
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {/* Animation amplitude micro en overlay dans le textarea */}
          {micState === "recording" && micAmplitude && (
            <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-end gap-1 h-8 w-full px-6">
                {micAmplitude.map((amp, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 8 }}
                    animate={{ height: amp }}
                    transition={{ type: "spring", stiffness: 180, damping: 18 }}
                    className="w-1.5 rounded bg-indigo-400/80"
                    style={{ minHeight: 8, maxHeight: 40 }}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Placeholder animé */}
          <AnimatePresence>
            {!userInput && !micState && (
              <motion.span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 pointer-events-none select-none text-base font-medium drop-shadow sm:left-6 sm:text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                Tapez votre message ou utilisez le micro…
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {/* Micro animé : affiché uniquement si pas d'enregistrement et input vide */}
        {micState !== "recording" &&
          (!userInput || userInput.trim().length === 0) && (
            <motion.button
              type="button"
              onClick={handleMicClick}
              className={`ml-2 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-full p-3 shadow-xl border border-indigo-300 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                micState === "recording" ? "animate-pulse" : ""
              } sm:ml-2 sm:p-2`}
              whileTap={{ scale: 0.85 }}
              aria-label={
                micState === "idle"
                  ? "Démarrer l'enregistrement"
                  : micState === "recording"
                  ? "Valider"
                  : "Transcription en cours"
              }
              disabled={micState === "transcribing"}
              style={{
                width: 56,
                height: 56,
                minWidth: 44,
                minHeight: 44,
                boxShadow: "0 0 0 4px rgba(120,120,255,0.08)",
              }}
            >
              {/* Icône micro Material Design arrondie */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 sm:h-6 sm:w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <rect x="11" y="19" width="2" height="2" rx="1" />
                <path
                  d="M5 11a7 7 0 0 0 14 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.button>
          )}
        {/* Bouton envoyer animé : affiché uniquement si pas d'enregistrement */}
        {micState !== "recording" && (
          <motion.button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="ml-2 bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold p-3 rounded-full shadow-2xl flex items-center justify-center text-xl transition-all duration-300 cursor-pointer align-middle sm:ml-2 sm:p-2"
            whileTap={{ scale: 0.9 }}
            style={{
              width: 56,
              height: 56,
              minWidth: 44,
              minHeight: 44,
              boxShadow: "0 0 0 4px rgba(120,120,255,0.08)",
            }}
          >
            <AnimatePresence>
              {isLoading ? (
                <motion.div
                  className="animate-spin rounded-full h-7 w-7 sm:h-6 sm:w-6 border-b-2 border-white border-t-2 border-indigo-400"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              ) : (
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ x: 0 }}
                  animate={{ x: isFocused ? 4 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <path
                    d="M12 19V5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 12L12 5L19 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        )}
        {/* Boutons check et annuler pendant l'enregistrement */}
        {micState === "recording" && (
          <div className="flex gap-2 ml-2">
            <motion.button
              type="button"
              onClick={handleMicClick}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow border border-green-300 flex items-center justify-center transition-all duration-200 cursor-pointer"
              whileTap={{ scale: 0.9 }}
              aria-label="Valider l'enregistrement"
              style={{ width: 56, height: 56, minWidth: 44, minHeight: 44 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.button>
          </div>
        )}
      </motion.div>
    </form>
  );
}
