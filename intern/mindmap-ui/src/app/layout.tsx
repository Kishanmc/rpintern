import type { Metadata } from 'next'
import './globals.css'
import { ThemeModeProvider } from '@/lib/theme'

export const metadata: Metadata = {
  title: 'Interactive Mindmap UI',
  description: 'Data-driven mindmap built with Next.js and React Flow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeModeProvider>
          {children}
        </ThemeModeProvider>
      </body>
    </html>
  )
}
