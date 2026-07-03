'use client'

import { useState } from 'react'
import { EditorNavbar } from '@/components/editor/editor-navbar'
import { ProjectSidebar } from '@/components/editor/project-sidebar'

export default function EditorLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	return (
		<div className='flex h-screen flex-col'>
			<EditorNavbar
				isSidebarOpen={isSidebarOpen}
				onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
			/>
			<ProjectSidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
			/>
			<main className='flex flex-1 overflow-hidden bg-bg-base'>{children}</main>
		</div>
	)
}
