'use client'

import { cn } from '@/lib/utils'

const widthToClass: Record<number, string> = {
	72: 'w-72',
	80: 'w-80',
}

type SlidingPanelProps = {
	isOpen: boolean
	onClose: () => void
	side?: 'left' | 'right'
	width?: 72 | 80
	children: React.ReactNode
}

export function SlidingPanel({
	isOpen,
	onClose,
	side = 'right',
	width = 80,
	children,
}: SlidingPanelProps) {
	const isLeft = side === 'left'

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
					'fixed top-0 z-50 flex h-full flex-col border-border-default bg-bg-surface transition-transform duration-200',
					widthToClass[width],
					isLeft ? 'left-0 border-r' : 'right-0 border-l',
					isOpen
						? 'translate-x-0'
						: isLeft
							? '-translate-x-full'
							: 'translate-x-full'
				)}
			>
				{children}
			</aside>
		</>
	)
}
