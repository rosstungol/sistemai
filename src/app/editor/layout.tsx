import { EditorClientShell } from '@/features/editor/components/editor-client-shell'
import { getUserProjects } from '@/lib/projects'

export default async function EditorLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { owned, shared } = await getUserProjects()
	const projects = [...owned, ...shared]

	return <EditorClientShell projects={projects}>{children}</EditorClientShell>
}
