import { SignIn } from '@clerk/nextjs'
import { AuthContent } from '../../_components/auth-content'

export default function SignInPage() {
	return (
		<div className='flex min-h-dvh flex-col lg:flex-row'>
			<AuthContent />
			<section className='flex flex-1 items-center justify-center p-8'>
				<SignIn fallbackRedirectUrl='/editor' signUpUrl='/sign-up' />
			</section>
		</div>
	)
}
