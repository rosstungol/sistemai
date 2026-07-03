import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
	return <SignUp fallbackRedirectUrl='/editor' signInUrl='/sign-in' />
}
