import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Home() {
	const { isAuthenticated, redirectToSignIn } = await auth()

	if (isAuthenticated) redirect('/editor')
	return redirectToSignIn()
}
