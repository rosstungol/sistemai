'use client'

import type { KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import type { DialogType } from '@/features/editor/hooks/use-project-dialog'
import { ProjectDialog } from './project-dialog'

type ProjectDialogsProps = {
	dialogType: DialogType
	projectName: string
	onProjectNameChange: (name: string) => void
	slug: string
	loading: boolean
	error: string | null
	selectedProjectName?: string
	onClose: () => void
	onCreate: () => void
	onRename: () => void
	onDelete: () => void
}

export function ProjectDialogs({
	dialogType,
	projectName,
	onProjectNameChange,
	slug,
	loading,
	error,
	selectedProjectName,
	onClose,
	onCreate,
	onRename,
	onDelete,
}: ProjectDialogsProps) {
	const handleCreateKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && projectName.trim() && !loading) {
			onCreate()
		}
	}

	const handleRenameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && projectName.trim() && !loading) {
			onRename()
		}
	}

	return (
		<>
			<ProjectDialog
				open={dialogType === 'create'}
				onClose={onClose}
				title='Create Project'
				error={error}
				actionLabel='Create'
				actionLoadingLabel='Creating...'
				onAction={onCreate}
				actionDisabled={!projectName.trim() || loading}
				isLoading={loading}
			>
				<div className='space-y-2'>
					<Input
						placeholder='Project name'
						value={projectName}
						onChange={(e) => onProjectNameChange(e.target.value)}
						onKeyDown={handleCreateKeyDown}
						autoFocus
					/>
					<p className='text-text-muted text-xs'>
						{projectName ? slug : 'your-project-slug'}
					</p>
				</div>
			</ProjectDialog>

			<ProjectDialog
				open={dialogType === 'rename'}
				onClose={onClose}
				title='Rename Project'
				error={error}
				actionLabel='Rename'
				actionLoadingLabel='Renaming...'
				onAction={onRename}
				actionDisabled={!projectName.trim() || loading}
				isLoading={loading}
			>
				<div className='space-y-2'>
					<Input
						placeholder='Project name'
						value={projectName}
						onChange={(e) => onProjectNameChange(e.target.value)}
						onKeyDown={handleRenameKeyDown}
						autoFocus
					/>
				</div>
			</ProjectDialog>

			<ProjectDialog
				open={dialogType === 'delete'}
				onClose={onClose}
				title='Delete Project'
				description={`Are you sure you want to delete "${selectedProjectName}"? This action cannot be undone.`}
				error={error}
				actionLabel='Delete'
				actionLoadingLabel='Deleting...'
				onAction={onDelete}
				actionDisabled={loading}
				isLoading={loading}
				actionVariant='destructive'
			/>
		</>
	)
}
