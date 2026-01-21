import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto pt-20">
      <nav className="p-6">
        <div className="space-y-4">
          <Link href="/" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            🏠 Home
          </Link>
          <Link href="/popular" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            🔥 Popular
          </Link>
          <Link href="/top-rated" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            ⭐ Top Rated
          </Link>
          <Link href="/favorites" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            ❤️ Favorites
          </Link>
          <Link href="/about" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            ℹ️ About
          </Link>
        </div>
      </nav>
    </aside>
  );
}