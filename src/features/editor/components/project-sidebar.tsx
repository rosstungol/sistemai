'use client'

import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Project } from '@/features/editor/hooks/use-project-dialog'
import { cn } from '@/lib/utils'

type ProjectSidebarProps = {
	isOpen: boolean
	onClose: () => void
	projects: Project[]
	onCreateProject: () => void
	onRenameProject: (project: Project) => void
	onDeleteProject: (project: Project) => void
}

export function ProjectSidebar({
	isOpen,
	onClose,
	projects,
	onCreateProject,
	onRenameProject,
	onDeleteProject,
}: ProjectSidebarProps) {
	const ownedProjects = projects.filter((p) => p.isOwner)
	const sharedProjects = projects.filter((p) => !p.isOwner)

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
						{ownedProjects.length === 0 ? (
							<div className='flex h-full items-center justify-center'>
								<p className='text-sm text-text-muted'>No projects yet</p>
							</div>
						) : (
							<ul className='mt-2 space-y-1'>
								{ownedProjects.map((project) => (
									<li
										key={project.id}
										className='group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-bg-subtle'
									>
										<span className='truncate'>{project.name}</span>
										<div className='flex items-center gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100'>
											<Button
												variant='ghost'
												size='icon-xs'
												onClick={() => onRenameProject(project)}
												aria-label={`Rename ${project.name}`}
											>
												<Pencil className='size-3' />
											</Button>
											<Button
												variant='ghost'
												size='icon-xs'
												onClick={() => onDeleteProject(project)}
												aria-label={`Delete ${project.name}`}
											>
												<Trash2 className='size-3' />
											</Button>
										</div>
									</li>
								))}
							</ul>
						)}
					</TabsContent>

					<TabsContent value='shared' className='flex-1 px-4 pb-4'>
						{sharedProjects.length === 0 ? (
							<div className='flex h-full items-center justify-center'>
								<p className='text-sm text-text-muted'>No shared projects</p>
							</div>
						) : (
							<ul className='mt-2 space-y-1'>
								{sharedProjects.map((project) => (
									<li
										key={project.id}
										className='flex items-center rounded-lg px-2 py-1.5 text-sm text-text-secondary'
									>
										<span className='truncate'>{project.name}</span>
									</li>
								))}
							</ul>
						)}
					</TabsContent>
				</Tabs>

				<div className='border-border-default border-t p-4'>
					<Button className='w-full gap-2' onClick={onCreateProject}>
						<Plus className='size-4' />
						New Project
					</Button>
				</div>
			</aside>
		</>
	)
}
