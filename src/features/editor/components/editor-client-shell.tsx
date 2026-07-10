'use client'

import { useState } from 'react'
import { EditorNavbar } from '@/features/editor/components/editor-navbar'
import { ProjectDialogs } from '@/features/editor/components/project-dialogs'
import { ProjectSidebar } from '@/features/editor/components/project-sidebar'
import { useProjectDialog } from '@/features/editor/hooks/use-project-dialog'
import { EditorDialogProvider } from '@/features/editor/providers/editor-dialog-provider'
import type { ProjectData } from '@/lib/projects'

type EditorClientShellProps = {
	projects: ProjectData[]
	children: React.ReactNode
}

export function EditorClientShell({
	projects,
	children,
}: EditorClientShellProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const {
		dialogType,
		projectName,
		setProjectName,
		slug,
		loading,
		error,
		selectedProject,
		openCreate,
		openRename,
		openDelete,
		close,
		handleCreate,
		handleRename,
		handleDelete,
	} = useProjectDialog()

	return (
		<EditorDialogProvider value={{ openCreate, openRename, openDelete }}>
			<div className='flex h-screen flex-col'>
				<EditorNavbar
					isSidebarOpen={isSidebarOpen}
					onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
				/>
				<ProjectSidebar
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
					projects={projects}
					onCreateProject={openCreate}
					onRenameProject={openRename}
					onDeleteProject={openDelete}
				/>
				<main className='flex flex-1 overflow-hidden bg-bg-base'>
					{children}
				</main>
			</div>
			<ProjectDialogs
				dialogType={dialogType}
				projectName={projectName}
				onProjectNameChange={setProjectName}
				slug={slug}
				loading={loading}
				error={error}
				selectedProjectName={selectedProject?.name}
				onClose={close}
				onCreate={handleCreate}
				onRename={handleRename}
				onDelete={handleDelete}
			/>
		</EditorDialogProvider>
	)
}
