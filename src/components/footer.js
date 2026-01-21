export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h3 className="text-xl font-bold">GameVault</h3>
          <p className="text-gray-400 text-sm text-center">
            Your ultimate destination for discovering video games
          </p>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="/" className="text-gray-400 hover:text-white transition">
              Home
            </a>
            <a href="/Genres" className="text-gray-400 hover:text-white transition">
              Explore
            </a>
            <a href="/favorites" className="text-gray-400 hover:text-white transition">
              Favorites
            </a>
            <a href="/popular" className="text-gray-400 hover:text-white transition">
              Popular
            </a>
          </div>

          {/* Genre Links */}
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <a href="/genre/4" className="text-gray-500 hover:text-gray-300 transition">
              Action
            </a>
            <a href="/genre/51" className="text-gray-500 hover:text-gray-300 transition">
              Indie
            </a>
            <a href="/genre/3" className="text-gray-500 hover:text-gray-300 transition">
              Adventure
            </a>
            <a href="/genre/5" className="text-gray-500 hover:text-gray-300 transition">
              RPG
            </a>
            <a href="/genre/2" className="text-gray-500 hover:text-gray-300 transition">
              Shooter
            </a>
            <a href="/genre/10" className="text-gray-500 hover:text-gray-300 transition">
              Strategy
            </a>
          </div>

          <div className="border-t border-gray-700 w-full pt-4 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} GameVault. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}