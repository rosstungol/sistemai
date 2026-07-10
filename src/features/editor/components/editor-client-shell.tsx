'use client'

import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { AiSidebar } from '@/features/editor/components/ai-sidebar'
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
	const [isAiOpen, setIsAiOpen] = useState(false)
	const params = useParams()
	const roomId = params?.roomId as string | undefined

	const currentProject = useMemo(() => {
		if (!roomId) return undefined
		return projects.find((p) => p.slug === roomId)
	}, [projects, roomId])

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
					projectName={currentProject?.name}
					onShare={() => {}}
					onToggleAi={() => setIsAiOpen((v) => !v)}
					isAiOpen={isAiOpen}
				/>
				<ProjectSidebar
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
					projects={projects}
					onCreateProject={openCreate}
					onRenameProject={openRename}
					onDeleteProject={openDelete}
					activeProjectSlug={roomId}
				/>
				<main className='flex flex-1 overflow-hidden bg-bg-base'>
					{children}
				</main>
				<AiSidebar isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
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
