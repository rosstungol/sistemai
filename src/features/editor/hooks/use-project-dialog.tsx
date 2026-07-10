'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'

export type Project = {
	id: string
	name: string
	slug: string
	isOwner: boolean
}

export type DialogType = 'create' | 'rename' | 'delete' | null

function generateSuffix(): string {
	return Math.random().toString(36).substring(2, 6)
}

function slugify(name: string): string {
	const slug = name
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
	return slug || '-'
}

export function useProjectDialog() {
	const router = useRouter()
	const [dialogType, setDialogType] = useState<DialogType>(null)
	const [projectName, setProjectName] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [selectedProject, setSelectedProject] = useState<Project | null>(null)
	const suffixRef = useRef('')

	const slug = useMemo(() => {
		const name = projectName.trim()
		if (!name || !suffixRef.current) return ''
		return `${slugify(name)}-${suffixRef.current}`
	}, [projectName])

	const openCreate = useCallback(() => {
		suffixRef.current = generateSuffix()
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
		suffixRef.current = ''
		setDialogType(null)
		setProjectName('')
		setSelectedProject(null)
		setLoading(false)
		setError(null)
	}, [])

	const handleCreate = useCallback(async () => {
		if (!projectName.trim()) return
		setLoading(true)
		try {
			const res = await fetch('/api/projects', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: projectName.trim(), slug }),
			})
			if (!res.ok) throw new Error('Failed to create project')

			const project = await res.json()
			close()
			router.push(`/editor/${project.slug}`)
		} catch {
			setError('Failed to create project')
			setLoading(false)
		}
	}, [projectName, slug, close, router])

	const handleRename = useCallback(async () => {
		if (!projectName.trim() || !selectedProject) return
		setLoading(true)
		try {
			const res = await fetch(`/api/projects/${selectedProject.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: projectName.trim() }),
			})
			if (!res.ok) throw new Error('Failed to rename project')
			close()
			router.refresh()
		} catch {
			setError('Failed to rename project')
			setLoading(false)
		}
	}, [projectName, selectedProject, close, router])

	const handleDelete = useCallback(async () => {
		if (!selectedProject) return
		setLoading(true)
		try {
			const res = await fetch(`/api/projects/${selectedProject.id}`, {
				method: 'DELETE',
			})
			if (!res.ok) throw new Error('Failed to delete project')
			close()

			const isActiveWorkspace =
				window.location.pathname === `/editor/${selectedProject.id}`
			if (isActiveWorkspace) {
				router.push('/editor')
				router.refresh()
			} else {
				router.refresh()
			}
		} catch {
			setError('Failed to delete project')
			setLoading(false)
		}
	}, [selectedProject, close, router])

	return {
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
	}
}
