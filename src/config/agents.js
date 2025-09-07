// src/config/agents.js
const agents = [
  {
    name: "Punchy",
    description: "L'ami qui trouve toujours la blague qui tombe juste. Transforme une phrase banale en punchline et répond avec humour dans n'importe quelle conversation. Idéal pour taquineries, posts réseaux et icebreakers.",
    image: "punchy-bot.svg",
    color: "punchy",
    link: "/agent/punchy",
    tagline: "Humour instantané",
    category: "communication",
    branding: {
      name: "Punchy",
      gradient: "from-indigo-900 to-violet-900",
      textColor: "text-white",
      headerGradient: "from-indigo-200 to-violet-200",
      botImage: "/punchy-bot.svg",
      description: "L'ami qui trouve toujours la blague qui tombe juste. Transforme une phrase banale en punchline et répond avec humour dans n'importe quelle conversation. Idéal pour taquineries, posts réseaux et icebreakers."
    },
    tones: [
      { value: "blague", label: "Blague classique" },
      { value: "noir", label: "Humour noir" },
      { value: "absurde", label: "Absurd" },
      { value: "seconddegre", label: "Second degré" },
      { value: "ironique", label: "Ironique" },
      { value: "sarcastique", label: "Sarcastique" },
      { value: "auto-derision", label: "Auto-dérision" },
    ],
    colors: {
      gradientFrom: "from-indigo-900",
      gradientTo: "to-violet-800",
      textColor: "text-white",
      buttonGradientFrom: "from-indigo-500",
      buttonGradientTo: "to-violet-600",
      buttonHoverFrom: "hover:from-indigo-600",
      buttonHoverTo: "hover:to-violet-700",
      borderColor: "border-violet-500/30",
      placeholderColor: "placeholder-indigo-300",
      responseBg: "bg-indigo-900/30",
      responseBorder: "border-violet-700/30",
      ringColor: "ring-indigo-500",
      shadowColor: "shadow-indigo-500/50"
    },
    endpoint: "https://cheikh06000.app.n8n.cloud/webhook/punchy",
    placeholder: "Collez ou enregistrez la phrase à punchliner...",
    sendButtonLabel: "Faire une blague"
  },
  {
    name: "Foody",
    description: "Votre expert culinaire pour des recettes, conseils nutritionnels et astuces de cuisine.",
    image: "foody-bot.svg",
    color: "foody",
    link: "/agent/foody",
    tagline: "Expert culinaire",
    category: "marketing",
    branding: {
      name: "Foody",
      gradient: "from-yellow-900 to-amber-800",
      textColor: "text-white",
      headerGradient: "from-yellow-200 to-amber-300",
      botImage: "/foody-bot.svg",
      description: "Votre expert culinaire pour des recettes, conseils nutritionnels et astuces de cuisine."
    },
    tones: [
      { value: "recette", label: "Recette" },
      { value: "nutrition", label: "Nutrition" },
      { value: "astuce", label: "Astuce" }
    ],
  colors: {
      gradientFrom: "from-yellow-900",
      gradientTo: "to-amber-800",
      textColor: "text-white",
      buttonGradientFrom: "from-yellow-500",
      buttonGradientTo: "to-amber-600",
      buttonHoverFrom: "hover:from-yellow-600",
      buttonHoverTo: "hover:to-amber-700",
      borderColor: "border-yellow-500/30",
      placeholderColor: "placeholder-yellow-300",
      responseBg: "bg-yellow-900/30",
      responseBorder: "border-yellow-700/30",
      ringColor: "ring-yellow-500",
      shadowColor: "shadow-yellow-500/50"
    },
    endpoint: "https://cheikh06000.app.n8n.cloud/webhook/foody",
    placeholder: "Écrivez ou enregistrez vos questions culinaires ou nutritionnelles...",
  sendButtonLabel: "Obtenir des conseils",
  type: "conversationnel"
  },
  {
    name: "Psyco",
    description: "Votre psychologue virtuel pour un soutien émotionnel et des conseils personnalisés.",
    image: "psyco-bot.svg",
    color: "psyco",
    link: "/agent/psyco",
    tagline: "Soutien émotionnel",
    category: "communication",
    branding: {
      name: "Psyco",
      gradient: "from-blue-900 to-sky-800",
      textColor: "text-white",
      headerGradient: "from-blue-200 to-sky-300",
      botImage: "/psyco-bot.svg",
      description: "Votre psychologue virtuel pour un soutien émotionnel et des conseils personnalisés."
    },
    tones: [
      { value: "soutien", label: "Soutien" },
      { value: "conseil", label: "Conseil" },
      { value: "écoute", label: "Écoute" }
    ],
  colors: {
      gradientFrom: "from-blue-900",
      gradientTo: "to-sky-800",
      textColor: "text-white",
      buttonGradientFrom: "from-blue-500",
      buttonGradientTo: "to-sky-600",
      buttonHoverFrom: "hover:from-blue-600",
      buttonHoverTo: "hover:to-sky-700",
      borderColor: "border-blue-500/30",
      placeholderColor: "placeholder-blue-300",
      responseBg: "bg-blue-900/30",
      responseBorder: "border-blue-700/30",
      ringColor: "ring-blue-500",
      shadowColor: "shadow-blue-500/50"
    },
    endpoint: "https://cheikh06000.app.n8n.cloud/webhook/psyco",
    placeholder: "Écrivez ou enregistrez vos préoccupations ou questions...",
  sendButtonLabel: "Obtenir des conseils",
  type: "conversationnel"
  },
  {
    name: "Talko",
    description: "Votre expert conversationnel dédié à l'actualité fiable, la veille d'information et l'explication claire des sujets complexes. Il synthétise, contextualise, compare les sources et reformule dans un ton adapté (discussion, info ou analyse). Idéal pour rester informé sans surcharge.",
    image: "talko-bot.svg",
    color: "talko",
    link: "/agent/talko",
    tagline: "Expert communication",
    category: "communication",
  hidden: true,
    branding: {
      name: "Talko",
      gradient: "from-purple-900 to-magenta-800",
      textColor: "text-white",
      headerGradient: "from-purple-200 to-magenta-300",
      botImage: "/talko-bot.svg",
      description: "Assistant d'actualités intelligent : synthèse multi‑sources, clarification rapide, veille thématique, explication pédagogique et suggestions de suivi. Évite la désinformation en privilégiant structure, nuance et fiabilité des formulations."
    },
    tones: [
      { value: "actualité", label: "Actualité" },
      { value: "info", label: "Info" },
      { value: "discussion", label: "Discussion" }
    ],
  colors: {
      gradientFrom: "from-pink-900",
      gradientTo: "to-rose-800",
      textColor: "text-white",
      buttonGradientFrom: "from-pink-500",
      buttonGradientTo: "to-rose-600",
      buttonHoverFrom: "hover:from-pink-600",
      buttonHoverTo: "hover:to-rose-700",
      borderColor: "border-pink-500/30",
      placeholderColor: "placeholder-pink-300",
      responseBg: "bg-pink-900/30",
      responseBorder: "border-pink-700/30",
      ringColor: "ring-pink-500",
      shadowColor: "shadow-pink-500/50"
    },
    endpoint: "https://cheikh06000.app.n8n.cloud/webhook/talko",
    placeholder: "Écrivez ou enregistrez vos questions...",
  sendButtonLabel: "Discuter",
  type: "conversationnel"
  },
  {
    name: "Scribo",
    description: "Ton assistant personnel d'écriture et de style. Transforme tes phrases brutes en messages clairs, fluides et impactants. Corrige orthographe, grammaire et ponctuation tout en proposant des reformulations adaptées à ton style et au contexte.",
    image: "scribo-bot.svg",
    color: "scribo",
    link: "/agent/scribo",
    tagline: "Style d'écriture parfait",
    category: "marketing",
    branding: {
      name: "Scribo",
      gradient: "from-green-900 to-teal-800",
      textColor: "text-white",
      headerGradient: "from-green-200 to-teal-200",
      botImage: "/scribo-bot.svg",
      description: "Ton assistant personnel d'écriture et de style. Transforme tes phrases brutes en messages clairs, fluides et impactants. Corrige orthographe, grammaire et ponctuation tout en proposant des reformulations adaptées à ton style et au contexte."
    },
    tones: [
      { value: "professionnel", label: "Professionnel" },
      { value: "amical", label: "Amical" },
      { value: "narratif", label: "Narratif" },
      { value: "persuasif", label: "Persuasif" },
      { value: "poetique", label: "Poétique" }
    ],
    colors: {
      gradientFrom: "from-green-900",
      gradientTo: "to-teal-800",
      textColor: "text-white",
      buttonGradientFrom: "from-green-500",
      buttonGradientTo: "to-teal-600",
      buttonHoverFrom: "hover:from-green-600",
      buttonHoverTo: "hover:to-teal-700",
      borderColor: "border-green-500/30",
      placeholderColor: "placeholder-green-300",
      responseBg: "bg-green-900/30",
      responseBorder: "border-green-700/30",
      ringColor: "ring-teal-300/60",
      shadowColor: "shadow-teal-400/40"
    },
    endpoint: "https://cheikh06000.app.n8n.cloud/webhook/scribo",
    placeholder: "Écrivez ou enregistrez une idée à développer...",
  sendButtonLabel: "Améliorer",
  type: "transactionnel"
  },
  {
    name: "Postoto",
    description: "Automatise et optimise la publication multi‑plateforme (Instagram, Facebook, LinkedIn...). Génère, adapte et programme des posts cohérents avec ta marque (format, ton, hashtags, call‑to‑action).",
    image: "postoto-bot.svg",
    color: "postoto",
    link: "/agent/postoto",
    tagline: "Posts synchronisés",
    category: "automation",
    branding: {
      name: "Postoto",
      gradient: "from-fuchsia-900 to-purple-900",
      textColor: "text-white",
      headerGradient: "from-fuchsia-200 to-purple-200",
      botImage: "/postoto-bot.svg",
      description: "Automatise la création et la diffusion de contenus adaptés à chaque réseau social."
    },
    tones: [
      { value: "annonce", label: "Annonce" },
      { value: "promo", label: "Promotion" },
      { value: "engagement", label: "Engagement" },
      { value: "evenement", label: "Événement" },
      { value: "story", label: "Story" }
    ],
    colors: {
      gradientFrom: "from-fuchsia-900",
      gradientTo: "to-purple-900",
      textColor: "text-white",
      buttonGradientFrom: "from-fuchsia-500",
      buttonGradientTo: "to-purple-600",
      buttonHoverFrom: "hover:from-fuchsia-600",
      buttonHoverTo: "hover:to-purple-700",
      borderColor: "border-fuchsia-500/30",
      placeholderColor: "placeholder-fuchsia-300",
      responseBg: "bg-fuchsia-900/30",
      responseBorder: "border-fuchsia-700/30",
      ringColor: "ring-fuchsia-500",
      shadowColor: "shadow-fuchsia-500/50"
    },
    endpoint: "https://cheikh06000.app.n8n.cloud/webhook/postoto",
    placeholder: "Collez un brief ou un post, ou décrivez ce que vous voulez publier...",
    sendButtonLabel: "Générer / Programmer",
    type: "transactionnel"
  },
  {
    name: "Reply",
    description: "Le génie des réponses parfaites. Suggère plusieurs options adaptées à chaque situation, du ton pro au ton cool ou humoristique. Idéal pour relations pro, séduction ou service client.",
    image: "reply-bot.svg",
    color: "reply",
    link: "/agent/reply",
    tagline: "Messages parfaits",
    category: "communication",
    branding: {
      name: "Reply",
      gradient: "from-blue-900 to-sky-800",
      textColor: "text-white",
      headerGradient: "from-blue-200 to-sky-200",
      botImage: "/reply-bot.svg",
      description: "Le génie des réponses parfaites. Suggère plusieurs options adaptées à chaque situation."
    },
    tones: [
      { value: "professionnel", label: "Professionnel" },
      { value: "cool", label: "Décontracté" },
      { value: "humoristique", label: "Humoristique" },
      { value: "seduisant", label: "Séduisant" }
    ],
    colors: {
      gradientFrom: "from-blue-900",
      gradientTo: "to-sky-800",
      textColor: "text-white",
      buttonGradientFrom: "from-blue-500",
      buttonGradientTo: "to-sky-600",
      buttonHoverFrom: "hover:from-blue-600",
      buttonHoverTo: "hover:to-sky-700",
      borderColor: "border-blue-500/30",
      placeholderColor: "placeholder-blue-300",
      responseBg: "bg-blue-900/30",
      responseBorder: "border-blue-700/30",
      ringColor: "ring-blue-500",
      shadowColor: "shadow-blue-500/50"
    },
    endpoint: "https://cheikh06000.app.n8n.cloud/webhook/reply",
    placeholder: "Collez ou enregistrez le message auquel vous voulez répondre...",
  sendButtonLabel: "Répondre",
  type: "transactionnel"
  },
  {
    name: "Globo",
    description: "Votre expert en organisation de voyages pour des itinéraires personnalisés, conseils et astuces.",
    image: "globo-bot.svg",
    color: "globo",
    link: "/agent/globo",
    tagline: "Expert en voyages",
    category: "marketing",
    branding: {
      name: "Globo",
      gradient: "from-blue-900 to-cyan-800",
      textColor: "text-white",
      headerGradient: "from-blue-200 to-cyan-300",
      botImage: "/globo-bot.svg",
      description: "Votre expert en organisation de voyages pour des itinéraires personnalisés, conseils et astuces."
    },
    tones: [
      { value: "itinéraire", label: "Itinéraire" },
      { value: "conseil", label: "Conseil" },
      { value: "astuce", label: "Astuce" }
    ],
    colors: {
      gradientFrom: "from-blue-900",
      gradientTo: "to-cyan-800",
      textColor: "text-white",
      buttonGradientFrom: "from-blue-500",
      buttonGradientTo: "to-cyan-600",
      buttonHoverFrom: "hover:from-blue-600",
      buttonHoverTo: "hover:to-cyan-700",
      borderColor: "border-blue-500/30",
      placeholderColor: "placeholder-blue-300",
      responseBg: "bg-blue-900/30",
      responseBorder: "border-blue-700/30",
      ringColor: "ring-blue-500",
      shadowColor: "shadow-blue-500/50"
    },
    endpoint: "https://cheikh06000.app.n8n.cloud/webhook/globo",
    placeholder: "Écrivez ou enregistrez vos questions sur vos voyages...",
  sendButtonLabel: "Obtenir des conseils",
  type: "conversationnel"
  },
  {
    name: "Fitzy",
    description: "Votre coach personnel pour le sport et le bien-être. Transforme vos objectifs en actions concrètes.",
    image: "fitzy-bot.svg",
    color: "fitzy",
    link: "/agent/fitzy",
    tagline: "Coach Sport & Bien-être",
    category: "marketing",
    branding: {
      name: "Fitzy",
      gradient: "from-green-900 to-teal-800",
      textColor: "text-white",
      headerGradient: "from-green-200 to-teal-200",
      botImage: "/fitzy-bot.svg",
      description: "Votre coach personnel pour le sport et le bien-être. Transforme vos objectifs en actions concrètes."
    },
    tones: [
      { value: "motivation", label: "Motivation" },
      { value: "conseil", label: "Conseil" },
      { value: "programme", label: "Programme" }
    ],
    colors: {
      gradientFrom: "from-green-900",
      gradientTo: "to-teal-800",
      textColor: "text-white",
      buttonGradientFrom: "from-green-500",
      buttonGradientTo: "to-teal-600",
      buttonHoverFrom: "hover:from-green-600",
      buttonHoverTo: "hover:to-teal-700",
      borderColor: "border-green-500/30",
      placeholderColor: "placeholder-green-300",
      responseBg: "bg-green-900/30",
      responseBorder: "border-green-700/30",
      ringColor: "ring-green-500",
      shadowColor: "shadow-green-500/50"
    },
    endpoint: "https://cheikh06000.app.n8n.cloud/webhook/fitzy",
    placeholder: "Écrivez ou enregistrez vos objectifs ou questions...",
  sendButtonLabel: "Obtenir des conseils",
  type: "conversationnel"
  },
  {
    name: "Lingo",
    description: "Le globe-trotteur des langues. Traduit tout en conservant le ton voulu (pro, amical, séduisant, humoristique). Parfait pour conversations internationales, réseaux sociaux ou voyages.",
    image: "lingo-bot.svg",
    color: "lingo",
    link: "/agent/lingo",
    tagline: "Traduction parfaite",
    category: "communication",
    branding: {
      name: "Lingo",
      gradient: "from-amber-900 to-yellow-800",
      textColor: "text-white",
      headerGradient: "from-amber-200 to-yellow-200",
      botImage: "/lingo-bot.svg",
      description: "Le globe-trotteur des langues. Traduit tout en conservant le ton voulu (pro, amical, séduisant, humoristique). Parfait pour conversations internationales, réseaux sociaux ou voyages."
    },
    tones: [
      { value: "pro", label: "Professionnel" },
      { value: "amical", label: "Amical" },
      { value: "seduisant", label: "Séduisant" },
      { value: "humoristique", label: "Humoristique" }
    ],
    colors: {
      gradientFrom: "from-amber-900",
      gradientTo: "to-yellow-800",
      textColor: "text-white",
      buttonGradientFrom: "from-amber-500",
      buttonGradientTo: "to-yellow-600",
      buttonHoverFrom: "hover:from-amber-600",
      buttonHoverTo: "hover:to-yellow-700",
      borderColor: "border-amber-500/30",
      placeholderColor: "placeholder-amber-300",
      responseBg: "bg-amber-900/30",
      responseBorder: "border-amber-700/30"
    },
    endpoint: "https://cheikh06000.app.n8n.cloud/webhook/lingo",
    placeholder: "Entrez votre texte à traduire...",
  sendButtonLabel: "Traduire",
  type: "transactionnel"
  },
  {
    name: "Glow",
    description: "Le maître des mots qui font chavirer. Propose des réponses séduisantes adaptées à la situation et au ton voulu (gentleman, joueur, mystérieux). Parfait pour applis de rencontre ou flirt léger au quotidien.",
    image: "glow-bot.svg",
    color: "glow",
    link: "/agent/glow",
    tagline: "Séduction garantie",
    category: "marketing",
    branding: {
      name: "Glow",
      gradient: "from-pink-900 to-rose-800",
      textColor: "text-white",
      headerGradient: "from-pink-200 to-rose-200",
      botImage: "/glow-bot.svg",
      description: "Le maître des mots qui font chavirer. Propose des réponses séduisantes adaptées à la situation et au ton voulu (gentleman, joueur, mystérieux). Parfait pour applis de rencontre ou flirt léger au quotidien."
    },
    tones: [
      { value: "gentleman", label: "Gentleman" },
      { value: "joueur", label: "Joueur" },
      { value: "mystérieux", label: "Mystérieux" }
    ],
    colors: {
      gradientFrom: "from-pink-900",
      gradientTo: "to-rose-800",
      textColor: "text-white",
      buttonGradientFrom: "from-pink-500",
      buttonGradientTo: "to-rose-600",
      buttonHoverFrom: "hover:from-pink-600",
      buttonHoverTo: "hover:to-rose-700",
      borderColor: "border-pink-500/30",
      placeholderColor: "placeholder-pink-300",
      responseBg: "bg-pink-900/30",
      responseBorder: "border-pink-700/30",
      ringColor: "ring-pink-500",
      shadowColor: "shadow-pink-500/50"
    },
    endpoint: "https://cheikh06000.app.n8n.cloud/webhook/glow",
    placeholder: "Écrivez ou enregistrez votre message...",
    sendButtonLabel: "séduire",
    type: "conversationnel"
  }
  ,
  {
    name: "Mailty",
    description: "Assistant email Gmail: liste, lit, résume et rédige des réponses intelligentes.",
    image: "mailty-bot.svg",
    color: "violet",
    link: "/agent/mailty",
    tagline: "Inbox intelligente",
    category: "automation",
    branding: {
      name: "Mailty",
      gradient: "from-violet-900 to-fuchsia-900",
      textColor: "text-white",
      headerGradient: "from-violet-200 to-fuchsia-200",
      botImage: "/mailty-bot.svg",
      description: "Assistant email Gmail: classement, résumé rapide et réponse assistée par IA."
    },
    tones: [
      { value: "professionnel", label: "Professionnel" },
      { value: "amical", label: "Amical" },
      { value: "synthese", label: "Synthèse" }
    ],
    colors: {
      gradientFrom: "from-violet-900",
      gradientTo: "to-fuchsia-900",
      textColor: "text-white",
      buttonGradientFrom: "from-violet-500",
      buttonGradientTo: "to-fuchsia-600",
      buttonHoverFrom: "hover:from-violet-600",
      buttonHoverTo: "hover:to-fuchsia-700",
      borderColor: "border-violet-500/30",
      placeholderColor: "placeholder-violet-300",
      responseBg: "bg-violet-900/30",
      responseBorder: "border-violet-700/30",
      ringColor: "ring-violet-500",
      shadowColor: "shadow-violet-500/50"
    },
    endpoint: "",
    placeholder: "Rechercher ou sélectionner un email...",
    sendButtonLabel: "Envoyer",
    type: "transactionnel"
  }
];

export default agents;
