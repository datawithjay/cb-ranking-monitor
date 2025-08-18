import './globals.css'

export const metadata = {
  title: 'Coinbase App Store Ranking Monitor',
  description: 'Monitor and track Coinbase app ranking on the Apple App Store over time',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
