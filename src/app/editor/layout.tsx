'use client'

import { useState } from 'react'
import { EditorNavbar } from '@/components/editor/editor-navbar'
import { ProjectDialogs } from '@/components/editor/project-dialogs'
import { ProjectSidebar } from '@/components/editor/project-sidebar'
import {
	EditorDialogProvider,
	useProjectDialog,
} from '@/hooks/use-project-dialog'

function EditorShell({ children }: { children: React.ReactNode }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const {
		dialogType,
		projectName,
		setProjectName,
		slug,
		loading,
		selectedProject,
		openCreate,
		openRename,
		openDelete,
		close,
		handleCreate,
		handleRename,
		handleDelete,
		projects,
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
				selectedProjectName={selectedProject?.name}
				onClose={close}
				onCreate={handleCreate}
				onRename={handleRename}
				onDelete={handleDelete}
			/>
		</EditorDialogProvider>
	)
}

export default function EditorLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <EditorShell>{children}</EditorShell>
}
