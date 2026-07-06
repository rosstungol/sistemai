'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type Project = {
	id: string
	name: string
	slug: string
	isOwner: boolean
}

export type DialogType = 'create' | 'rename' | 'delete' | null

export const MOCK_PROJECTS: Project[] = [
	{
		id: '1',
		name: 'Cloud Architecture',
		slug: 'cloud-architecture',
		isOwner: true,
	},
	{
		id: '2',
		name: 'Microservices Design',
		slug: 'microservices-design',
		isOwner: true,
	},
	{ id: '3', name: 'Team Workspace', slug: 'team-workspace', isOwner: false },
]

function slugify(name: string): string {
	const slug = name
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
	return slug || '-'
}

export function useProjectDialog() {
	const [dialogType, setDialogType] = useState<DialogType>(null)
	const [projectName, setProjectName] = useState('')
	const [loading, setLoading] = useState(false)
	const [selectedProject, setSelectedProject] = useState<Project | null>(null)
	const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	const slug = slugify(projectName)

	const openCreate = useCallback(() => {
		setDialogType('create')
		setProjectName('')
		setSelectedProject(null)
	}, [])

	const openRename = useCallback((project: Project) => {
		setDialogType('rename')
		setProjectName(project.name)
		setSelectedProject(project)
	}, [])

	const openDelete = useCallback((project: Project) => {
		setDialogType('delete')
		setProjectName('')
		setSelectedProject(project)
	}, [])

	const close = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}
		setDialogType(null)
		setProjectName('')
		setSelectedProject(null)
		setLoading(false)
	}, [])

	const handleCreate = useCallback(() => {
		if (!projectName.trim()) return
		setLoading(true)
		const newProject: Project = {
			id: String(Date.now()),
			name: projectName.trim(),
			slug: slugify(projectName.trim()),
			isOwner: true,
		}
		timeoutRef.current = setTimeout(() => {
			setProjects((prev) => [newProject, ...prev])
			setLoading(false)
			close()
		}, 400)
	}, [projectName, close])

	const handleRename = useCallback(() => {
		if (!projectName.trim() || !selectedProject) return
		setLoading(true)
		timeoutRef.current = setTimeout(() => {
			setProjects((prev) =>
				prev.map((p) =>
					p.id === selectedProject.id
						? {
								...p,
								name: projectName.trim(),
								slug: slugify(projectName.trim()),
							}
						: p
				)
			)
			setLoading(false)
			close()
		}, 400)
	}, [projectName, selectedProject, close])

	const handleDelete = useCallback(() => {
		if (!selectedProject) return
		setLoading(true)
		timeoutRef.current = setTimeout(() => {
			setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id))
			setLoading(false)
			close()
		}, 400)
	}, [selectedProject, close])

	return {
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
	}
}
