export default function Header() {
  return (
    <header className="gradient-bg text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🏪</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Coinbase App Store Monitor
              </h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Track Coinbase ranking in the Apple App Store Finance category
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center space-x-4">
            <a
              href="https://apps.apple.com/us/app/coinbase-buy-btc-eth-sol/id886427730"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <span>View on App Store</span>
              <span>↗️</span>
            </a>
          </div>
        </div>
        
        {/* Mobile App Store Link */}
        <div className="sm:hidden mt-4">
          <a
            href="https://apps.apple.com/us/app/coinbase-buy-btc-eth-sol/id886427730"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>View on App Store</span>
            <span>↗️</span>
          </a>
        </div>
      </div>
    </header>
  )
}
