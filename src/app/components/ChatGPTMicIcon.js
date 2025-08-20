export default function ChatGPTMicIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <g>
        <rect x="9" y="3" width="6" height="12" rx="3" />
        <path d="M5 10v2a7 7 0 0014 0v-2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M12 19v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 22h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
