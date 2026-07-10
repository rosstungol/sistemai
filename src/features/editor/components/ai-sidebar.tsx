'use client'

import { Bot, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AiSidebarProps = {
	isOpen: boolean
	onClose: () => void
}

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
	return (
		<>
			<div
				className={cn(
					'fixed inset-0 z-40 bg-black/40 transition-opacity duration-200',
					isOpen
						? 'pointer-events-auto opacity-100'
						: 'pointer-events-none opacity-0'
				)}
				onClick={onClose}
				aria-hidden='true'
			/>
			<aside
				aria-hidden={!isOpen}
				inert={!isOpen}
				className={cn(
					'fixed top-0 right-0 z-50 flex h-full w-80 flex-col border-border-default border-l bg-bg-surface transition-transform duration-200',
					isOpen ? 'translate-x-0' : 'translate-x-full'
				)}
			>
				<div className='flex h-12 items-center justify-between border-border-default border-b px-4'>
					<div className='flex items-center gap-2'>
						<Bot className='size-4 text-accent-ai-text' />
						<span className='font-medium text-sm text-text-primary'>
							AI Assistant
						</span>
					</div>
					<Button
						variant='ghost'
						size='icon-sm'
						onClick={onClose}
						aria-label='Close AI sidebar'
					>
						<X className='size-4' />
					</Button>
				</div>
				<div className='flex flex-1 items-center justify-center p-4'>
					<p className='text-center text-sm text-text-muted'>
						AI chat will appear here
					</p>
				</div>
			</aside>
		</>
	)
}
