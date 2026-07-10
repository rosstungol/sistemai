'use client'

import { MoreVertical, Pencil, Plus, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
	activeProjectSlug?: string
}

export function ProjectSidebar({
	isOpen,
	onClose,
	projects,
	onCreateProject,
	onRenameProject,
	onDeleteProject,
	activeProjectSlug,
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
								{ownedProjects.map((project) => {
									const isActive = project.slug === activeProjectSlug
									return (
										<li
											key={project.id}
											className={cn(
												'group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors',
												isActive
													? 'bg-accent-primary-dim text-accent-primary'
													: 'text-text-secondary hover:bg-bg-subtle'
											)}
										>
											<Link
												href={`/editor/${project.slug}`}
												className='min-w-0 flex-1 truncate'
												onClick={onClose}
												prefetch={false}
											>
												{project.name}
											</Link>
											<DropdownMenu>
												<DropdownMenuTrigger
													aria-label={`Actions for ${project.name}`}
													className='flex items-center justify-center rounded-md p-1 text-text-secondary transition-colors hover:bg-bg-subtle focus:outline-none'
												>
													<MoreVertical className='size-3' />
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<DropdownMenuItem
														onClick={() => onRenameProject(project)}
													>
														<Pencil className='size-3' />
														Rename
													</DropdownMenuItem>
													<DropdownMenuItem
														variant='destructive'
														onClick={() => onDeleteProject(project)}
													>
														<Trash2 className='size-3' />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</li>
									)
								})}
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
								{sharedProjects.map((project) => {
									const isActive = project.slug === activeProjectSlug
									return (
										<li
											key={project.id}
											className={cn(
												'flex items-center rounded-lg px-2 py-1.5 text-sm',
												isActive
													? 'bg-accent-primary-dim text-accent-primary'
													: 'text-text-secondary'
											)}
										>
											<Link
												href={`/editor/${project.slug}`}
												className='min-w-0 flex-1 truncate'
												onClick={onClose}
												prefetch={false}
											>
												{project.name}
											</Link>
										</li>
									)
								})}
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
