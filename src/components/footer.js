export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h3 className="text-xl font-bold">GameVault</h3>
          <p className="text-gray-400 text-sm text-center">
            Your ultimate destination for discovering video games
          </p>
          
      

          <div className="border-t border-gray-700 w-full pt-4 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} GameVault. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}