'use client'

import { createContext, useContext } from 'react'
import type { Project } from '../hooks/use-project-dialog'

type EditorDialogContextValue = {
	openCreate: () => void
	openRename: (project: Project) => void
	openDelete: (project: Project) => void
}

const EditorDialogContext = createContext<EditorDialogContextValue | null>(null)

export function EditorDialogProvider({
	children,
	value,
}: {
	children: React.ReactNode
	value: EditorDialogContextValue
}) {
	return (
		<EditorDialogContext.Provider value={value}>
			{children}
		</EditorDialogContext.Provider>
	)
}

export function useEditorDialog() {
	const context = useContext(EditorDialogContext)
	if (!context) {
		throw new Error('useEditorDialog must be used within EditorDialogProvider')
	}
	return context
}
