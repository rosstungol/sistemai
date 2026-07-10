'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

type ProjectDialogProps = {
	open: boolean
	onClose: () => void
	title: string
	description?: string
	error?: string | null
	children?: React.ReactNode
	actionLabel: string
	actionLoadingLabel: string
	onAction: () => void
	actionDisabled?: boolean
	isLoading?: boolean
	actionVariant?: 'default' | 'destructive'
}

export function ProjectDialog({
	open,
	onClose,
	title,
	description,
	error,
	children,
	actionLabel,
	actionLoadingLabel,
	onAction,
	actionDisabled,
	isLoading,
	actionVariant = 'default',
}: ProjectDialogProps) {
	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				{error && (
					<p className='text-xs text-red-500'>{error}</p>
				)}
				{children}
				<DialogFooter>
					<Button variant='outline' onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant={actionVariant}
						onClick={onAction}
						disabled={actionDisabled}
					>
						{isLoading ? actionLoadingLabel : actionLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
