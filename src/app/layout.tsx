import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/ui/themes'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'sistemAI',
	description: 'AI-powered collaborative system design workspace',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className='flex min-h-full flex-col'>
				<ClerkProvider
					appearance={{
						theme: dark,
						variables: {
							colorBackground: 'var(--bg-surface)',
							colorForeground: 'var(--text-primary)',
							colorPrimary: 'var(--accent-primary)',
							colorPrimaryForeground: 'var(--bg-base)',
							colorInput: 'var(--bg-surface)',
							colorInputForeground: 'var(--text-primary)',
							borderRadius: '0.625rem',
						},
					}}
				>
					{children}
				</ClerkProvider>
			</body>
		</html>
	)
}
