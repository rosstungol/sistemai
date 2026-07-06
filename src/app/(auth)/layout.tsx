import { AuthContent } from '@/features/auth/components/auth-content'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='flex min-h-dvh flex-col lg:flex-row'>
			<AuthContent />
			<section className='flex flex-1 items-center justify-center p-8'>
				{children}
			</section>
		</div>
	)
}
