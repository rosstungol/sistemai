'use client'

import { Check, Copy, Loader2, Mail, UserMinus } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type Collaborator = {
	id: string
	email: string
	displayName: string | null
	avatarUrl: string | null
	createdAt: string
}

type ShareDialogProps = {
	open: boolean
	onClose: () => void
	projectId: string
	projectSlug: string
}

export function ShareDialog({
	open,
	onClose,
	projectId,
	projectSlug,
}: ShareDialogProps) {
	const [collaborators, setCollaborators] = useState<Collaborator[]>([])
	const [isOwner, setIsOwner] = useState(false)
	const [loading, setLoading] = useState(true)
	const [inviteEmail, setInviteEmail] = useState('')
	const [inviting, setInviting] = useState(false)
	const [inviteError, setInviteError] = useState<string | null>(null)
	const [removingId, setRemovingId] = useState<string | null>(null)
	const [copied, setCopied] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const fetchCollaborators = useCallback(async () => {
		setLoading(true)
		try {
			const res = await fetch(`/api/projects/${projectId}/collaborators`)
			if (!res.ok) throw new Error('Failed to fetch collaborators')
			const data = await res.json()
			setCollaborators(data.collaborators)
			setIsOwner(data.isOwner)
		} catch {
			// Silently fail — dialog will show empty state
		} finally {
			setLoading(false)
		}
	}, [projectId])

	useEffect(() => {
		if (open) {
			fetchCollaborators()
			setCopied(false)
			setInviteEmail('')
			setInviteError(null)
		}
	}, [open, fetchCollaborators])

	const handleInvite = useCallback(async () => {
		const email = inviteEmail.trim().toLowerCase()
		if (!email || !email.includes('@')) {
			setInviteError('Enter a valid email address')
			return
		}

		setInviting(true)
		setInviteError(null)

		try {
			const res = await fetch(`/api/projects/${projectId}/collaborators`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			})

			if (res.status === 409) {
				setInviteError('This user is already a collaborator')
				return
			}

			if (!res.ok) {
				setInviteError('Failed to invite collaborator')
				return
			}

			setInviteEmail('')
			await fetchCollaborators()
			inputRef.current?.focus()
		} catch {
			setInviteError('Failed to invite collaborator')
		} finally {
			setInviting(false)
		}
	}, [inviteEmail, projectId, fetchCollaborators])

	const handleRemove = useCallback(
		async (collaboratorId: string) => {
			setRemovingId(collaboratorId)
			try {
				const res = await fetch(`/api/projects/${projectId}/collaborators`, {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ collaboratorId }),
				})
				if (!res.ok) throw new Error('Failed to remove collaborator')
				await fetchCollaborators()
			} catch {
				// Silently fail
			} finally {
				setRemovingId(null)
			}
		},
		[projectId, fetchCollaborators]
	)

	const handleCopyLink = useCallback(async () => {
		const url = `${window.location.origin}/editor/${projectSlug}`
		try {
			await navigator.clipboard.writeText(url)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			// Clipboard API may be unavailable
		}
	}, [projectSlug])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !inviting) {
				handleInvite()
			}
		},
		[handleInvite, inviting]
	)

	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
			<DialogContent showCloseButton={false} className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Share project</DialogTitle>
				</DialogHeader>

				{isOwner && (
					<div className='flex gap-2'>
						<Input
							ref={inputRef}
							type='email'
							placeholder='Enter email address...'
							value={inviteEmail}
							onChange={(e) => {
								setInviteEmail(e.target.value)
								setInviteError(null)
							}}
							onKeyDown={handleKeyDown}
							className='flex-1'
						/>
						<Button
							onClick={handleInvite}
							disabled={inviting || !inviteEmail.trim()}
						>
							{inviting ? (
								<Loader2 className='size-4 animate-spin' />
							) : (
								'Invite'
							)}
						</Button>
					</div>
				)}

				{inviteError && (
					<p role='alert' className='text-state-error text-xs'>
						{inviteError}
					</p>
				)}

				<div className='space-y-1'>
					{loading ? (
						<div className='flex items-center justify-center py-8'>
							<Loader2 className='size-5 animate-spin text-text-muted' />
						</div>
					) : collaborators.length === 0 ? (
						<p className='py-6 text-center text-sm text-text-muted'>
							{isOwner
								? 'No collaborators yet. Invite someone above.'
								: 'No collaborators on this project.'}
						</p>
					) : (
						collaborators.map((c) => (
							<div
								key={c.id}
								className='flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-bg-subtle'
							>
								{c.avatarUrl ? (
									<Image
										src={c.avatarUrl}
										alt=''
										width={28}
										height={28}
										className='size-7 shrink-0 rounded-full'
									/>
								) : (
									<div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-text-muted text-xs'>
										<Mail className='size-3.5' />
									</div>
								)}
								<div className='flex min-w-0 flex-1 flex-col'>
									{c.displayName ? (
										<>
											<span className='truncate text-sm text-text-primary'>
												{c.displayName}
											</span>
											<span className='truncate text-text-muted text-xs'>
												{c.email}
											</span>
										</>
									) : (
										<span className='truncate text-sm text-text-primary'>
											{c.email}
										</span>
									)}
								</div>
								{isOwner && (
									<Button
										variant='ghost'
										size='icon-sm'
										onClick={() => handleRemove(c.id)}
										disabled={removingId === c.id}
										aria-label={`Remove ${c.displayName ?? c.email}`}
									>
										{removingId === c.id ? (
											<Loader2 className='size-3.5 animate-spin' />
										) : (
											<UserMinus className='size-3.5 text-state-error' />
										)}
									</Button>
								)}
							</div>
						))
					)}
				</div>

				<div className='-mx-4 -mb-4 flex items-center justify-between rounded-b-xl border-border-default border-t px-4 py-3'>
					<p className='text-text-muted text-xs'>
						Anyone with the link can view
					</p>
					<Button variant='outline' size='sm' onClick={handleCopyLink}>
						{copied ? (
							<>
								<Check className='size-3.5 text-state-success' />
								Copied!
							</>
						) : (
							<>
								<Copy className='size-3.5' />
								Copy link
							</>
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
