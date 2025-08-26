import React from "react";

export default function TranscribingDotsAnimation({ text = "Transcription en cours" }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
      <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-violet-700 drop-shadow-lg mb-2">{text}</span>
        <div className="flex gap-1 h-6">
          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
        </div>
      </div>
      <style jsx>{`
        .animate-bounce {
          display: inline-block;
          font-size: 2rem;
          color: #7c3aed;
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 1; }
          40% { transform: translateY(-8px); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
