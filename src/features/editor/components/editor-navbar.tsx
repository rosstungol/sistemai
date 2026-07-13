'use client'

import { UserButton } from '@clerk/nextjs'
import { Bot, PanelLeftClose, PanelLeftOpen, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EditorNavbarProps = {
	isSidebarOpen: boolean
	onToggleSidebar: () => void
	projectName?: string
	onShare?: () => void
	onToggleAi?: () => void
	isAiOpen?: boolean
}

export function EditorNavbar({
	isSidebarOpen,
	onToggleSidebar,
	projectName,
	onShare,
	onToggleAi,
	isAiOpen,
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
				{projectName && (
					<>
						<span className='h-4 w-px bg-border-default' />
						<span className='truncate font-medium text-sm text-text-primary'>
							{projectName}
						</span>
					</>
				)}
			</div>
			<div className='flex flex-1 items-center justify-center' />
			<div className='flex flex-1 items-center justify-end gap-1'>
				{projectName && (
					<>
						<Button
							variant='ghost'
							size='icon-sm'
							onClick={onShare}
							aria-label='Share project'
						>
							<Share2 className='size-4' />
						</Button>
						<Button
							variant='ghost'
							size='icon-sm'
							onClick={onToggleAi}
							aria-label={isAiOpen ? 'Close AI sidebar' : 'Open AI sidebar'}
							className={cn(isAiOpen && 'text-accent-ai-text')}
						>
							<Bot className='size-4' />
						</Button>
					</>
				)}
				<UserButton />
			</div>
		</nav>
	)
}
