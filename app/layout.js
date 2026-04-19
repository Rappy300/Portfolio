import './globals.css'

export const metadata = {
  title: 'Ralph R. Ociones - Portfolio',
  description: 'Web Designer / IT Student Portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}