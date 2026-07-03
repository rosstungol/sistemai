'use client'

import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

type ProjectSidebarProps = {
	isOpen: boolean
	onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
	return (
		<>
			<div
				className={cn(
					'fixed inset-0 z-40 transition-opacity duration-200',
					isOpen
						? 'pointer-events-auto opacity-100'
						: 'pointer-events-none opacity-0'
				)}
				onClick={onClose}
				aria-hidden='true'
			/>
			<aside
				className={cn(
					'fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-border-default border-r bg-bg-surface transition-transform duration-200',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				<div className='flex h-12 items-center justify-between border-border-default border-b px-4'>
					<span className='font-medium text-sm text-text-primary'>
						Projects
					</span>
					<Button
						variant='ghost'
						size='icon-sm'
						onClick={onClose}
						aria-label='Close sidebar'
					>
						<X className='size-4' />
					</Button>
				</div>

				<Tabs defaultValue='my-projects' className='flex flex-1 flex-col'>
					<div className='px-4 pt-3'>
						<TabsList className='w-full'>
							<TabsTrigger value='my-projects' className='flex-1'>
								My Projects
							</TabsTrigger>
							<TabsTrigger value='shared' className='flex-1'>
								Shared
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value='my-projects' className='flex-1 px-4 pb-4'>
						<div className='flex h-full items-center justify-center'>
							<p className='text-sm text-text-muted'>No projects yet</p>
						</div>
					</TabsContent>

					<TabsContent value='shared' className='flex-1 px-4 pb-4'>
						<div className='flex h-full items-center justify-center'>
							<p className='text-sm text-text-muted'>No shared projects</p>
						</div>
					</TabsContent>
				</Tabs>

				<div className='border-border-default border-t p-4'>
					<Button className='w-full gap-2'>
						<Plus className='size-4' />
						New Project
					</Button>
				</div>
			</aside>
		</>
	)
}
