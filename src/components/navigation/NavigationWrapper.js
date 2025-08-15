"use client";

import dynamic from "next/dynamic";

// Chargement dynamique de la navigation côté client uniquement
const MainNavigation = dynamic(() => import("./MainNavigation"), {
  ssr: false,
});

export default function NavigationWrapper() {
  return <MainNavigation />;
}
