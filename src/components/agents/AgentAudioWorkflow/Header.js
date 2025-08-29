import GoogleMenu from "@/components/navigation/GoogleMenu";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Header({ branding, botImage, tagline, targetLang, handleLanguageChange, colors, messages, clearHistory }) {
  return (
    <header className="z-50 py-3 px-4 bg-gradient-to-r from-black/60 to-transparent backdrop-blur-md fixed top-0 left-0 w-full">
      <div className="container mx-auto flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-1 justify-center">
          <Image src={branding?.botImage || botImage} alt={branding?.name} width={48} height={48} className="w-12 h-12 rounded-full drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] border-2 border-white/30" priority />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-white drop-shadow-lg">{branding?.name}</div>
              {tagline && (<span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-700/80 text-indigo-100 ml-2 drop-shadow">{tagline}</span>)}
              <select id="language-select-header" value={targetLang} onChange={handleLanguageChange} className={`px-2 py-1 rounded-lg border ${colors.borderColor} bg-gray-900 ${colors.textColor} focus:ring focus:outline-none transition-all text-xs cursor-pointer ml-2`} style={{ background: `#E3DEDE` }}>
                <option value="français">FR</option>
                <option value="anglais">EN</option>
                <option value="espagnol">ES</option>
                <option value="allemand">DE</option>
                <option value="italien">IT</option>
                <option value="wolof">WO</option>
                <option value="portuguais">PT</option>
              </select>
              {messages.length > 0 && (
                <button onClick={clearHistory} className="p-2 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-red-600 transition cursor-pointer ml-2" title="Supprimer tout l'historique">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6m5 10v-6" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/80 max-w-xs">{branding?.description}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <GoogleMenu />
        </div>
      </div>
    </header>
  );
}
