"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function ModernMetaComposer() {
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [visibility, setVisibility] = useState("Public");
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [showPreview, setShowPreview] = useState(false);

  const fileInput = useRef();
  const timezones = ["Europe/Paris","Europe/London","America/New_York","America/Los_Angeles","Asia/Tokyo","Asia/Dubai"];

  const handleMedia = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMedia((m) => [...m, { id: Date.now() + Math.random(), type: file.type, data: ev.target.result }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeMedia = (id) => setMedia((m) => m.filter((x) => x.id !== id));
  const togglePreview = () => setShowPreview(!showPreview);

  const handlePublish = () => {
    alert(scheduled ? "Publication planifiée !" : "Publication envoyée !");
  };

  const renderPreview = () => (
    <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 max-w-lg mx-auto animate-fadeIn">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div>
          <div className="font-semibold text-sm">Your Page Name</div>
          <div className="text-xs text-gray-500">
            {scheduled && scheduleDate && scheduleTime
              ? `Planifié • ${scheduleDate} ${scheduleTime} (${timezone})`
              : "À l’instant • " + visibility}
          </div>
        </div>
      </div>
      <div className="whitespace-pre-wrap mb-3 text-gray-800 dark:text-gray-100">{text}</div>
      {media.length > 0 && (
        <div className={`grid gap-2 mb-2 ${media.length === 1 ? "grid-cols-1" : media.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
          {media.map((m) =>
            m.type.startsWith("image") ? (
              <Image key={m.id} src={m.data} alt="media" width={400} height={300} className="rounded-lg object-cover w-full hover:scale-105 transition-transform" />
            ) : (
              <video key={m.id} src={m.data} controls className="rounded-lg w-full hover:scale-105 transition-transform" />
            )
          )}
        </div>
      )}
      <div className="flex justify-around border-t pt-2 text-sm text-gray-600 dark:text-gray-300">
        <button className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1 rounded transition">👍 J’aime</button>
        <button className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1 rounded transition">💬 Commenter</button>
        <button className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1 rounded transition">↗️ Partager</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg space-y-4">
      {/* Header page + visibilité */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="font-semibold text-lg">Your Page Name</div>
          <select
            className="text-xs border rounded px-2 py-1 mt-1 bg-gray-50 dark:bg-gray-800"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option>Public</option>
            <option>Amis</option>
            <option>Privé</option>
          </select>
        </div>
        <button className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded">⋯</button>
      </div>

      {/* Zone texte */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Quoi de neuf ?"
        className="w-full resize-none border-none focus:ring-2 focus:ring-blue-400 mb-3 text-lg bg-gray-50 dark:bg-gray-800 rounded-lg p-3 placeholder-gray-400 dark:placeholder-gray-500"
        rows={4}
      />

      {/* Media preview */}
      {media.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {media.map((m) => (
            <div key={m.id} className="relative group">
              {m.type.startsWith("image") ? (
                <Image src={m.data} alt="media" width={120} height={80} className="rounded-lg object-cover max-h-24 hover:scale-105 transition-transform" />
              ) : (
                <video src={m.data} controls className="rounded-lg max-h-24 hover:scale-105 transition-transform" />
              )}
              <button
                onClick={() => removeMedia(m.id)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Options + programmation */}
      <div className="flex flex-col gap-3 border-t pt-3">
        <div className="flex justify-between">
          <button onClick={() => fileInput.current.click()} className="flex items-center gap-1 text-green-600 font-medium hover:bg-green-100 dark:hover:bg-green-800 px-3 py-2 rounded transition">📷 Photo/Vidéo</button>
          <button className="text-pink-600 font-medium hover:bg-pink-100 dark:hover:bg-pink-800 px-3 py-2 rounded transition">😊 Humeur</button>
          <button className="text-blue-600 font-medium hover:bg-blue-100 dark:hover:bg-blue-800 px-3 py-2 rounded transition">📍 Localisation</button>
          <button className="text-orange-600 font-medium hover:bg-orange-100 dark:hover:bg-orange-800 px-3 py-2 rounded transition">🏷️ Taguer</button>
        </div>

        {/* Programmation */}
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="scheduled" checked={scheduled} onChange={e => setScheduled(e.target.checked)} />
          <label htmlFor="scheduled" className="text-sm font-medium">Programmer la publication</label>
          {scheduled && (
            <>
              <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"/>
              <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"/>
              <select value={timezone} onChange={e => setTimezone(e.target.value)} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm">
                {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </>
          )}
        </div>
      </div>

      <input ref={fileInput} type="file" multiple accept="image/*,video/*" onChange={handleMedia} className="hidden" />

      {/* Boutons Publier et Aperçu */}
      <div className="flex gap-3 mt-3">
        <button
          className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
          disabled={scheduled && (!scheduleDate || !scheduleTime) && !text && media.length===0}
          onClick={handlePublish}
        >
          {scheduled ? "Planifier" : "Publier"}
        </button>
        <button
          className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          onClick={togglePreview}
        >
          {showPreview ? "Masquer l'aperçu" : "Aperçu"}
        </button>
      </div>

      {/* Preview */}
      {showPreview && renderPreview()}
    </div>
  );
}
