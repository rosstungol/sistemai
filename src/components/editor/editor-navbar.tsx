'use client'

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

type EditorNavbarProps = {
	isSidebarOpen: boolean
	onToggleSidebar: () => void
}

export function EditorNavbar({
	isSidebarOpen,
	onToggleSidebar,
}: EditorNavbarProps) {
	return (
		<nav className='flex h-12 shrink-0 items-center border-border-default border-b bg-bg-surface px-4'>
			<div className='flex flex-1 items-center gap-2'>
				<Button
					variant='ghost'
					size='icon-sm'
					onClick={onToggleSidebar}
					aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
				>
					{isSidebarOpen ? (
						<PanelLeftClose className='size-4' />
					) : (
						<PanelLeftOpen className='size-4' />
					)}
				</Button>
			</div>
			<div className='flex flex-1 items-center justify-center' />
			<div className='flex flex-1 items-center justify-end' />
		</nav>
	)
}
