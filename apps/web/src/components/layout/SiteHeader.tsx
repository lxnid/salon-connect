export function SiteHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="bg-black text-white w-8 h-8 rounded flex items-center justify-center font-bold">
                S
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                SalonConnect
              </span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/auth/signin" className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent hover:bg-gray-100 focus:ring-gray-500 px-4 py-2 text-sm">
              Sign In
            </a>
            <a href="/auth/signup" className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-black text-white hover:bg-gray-800 focus:ring-gray-500 px-4 py-2 text-sm">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}