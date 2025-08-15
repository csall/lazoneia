import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">La Zone IA</h1>
        <nav className="flex gap-4">
          <Link href="/">Accueil</Link>
          <Link href="/agents">Agents</Link>
          <Link href="/tarifs">Tarifs</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-blue-800 text-white p-4 text-center">
        © 2025 La Zone IA
      </footer>
    </div>
  );
}
