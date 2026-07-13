'use client'

import { Bot, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SlidingPanel } from '@/components/ui/sliding-panel'

type AiSidebarProps = {
	isOpen: boolean
	onClose: () => void
}

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
	return (
		<SlidingPanel isOpen={isOpen} onClose={onClose} side='right' width={80}>
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
		</SlidingPanel>
	)
}
