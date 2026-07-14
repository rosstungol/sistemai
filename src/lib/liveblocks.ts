import 'server-only'

const CURSOR_COLORS = [
	'#00c8d4',
	'#6457f9',
	'#ff6166',
	'#f75f8f',
	'#ff990a',
	'#52a8ff',
	'#bf7af0',
	'#62c073',
	'#0ac7b4',
	'#fbbf24',
]

export function getCursorColor(userId: string): string {
	let hash = 0
	for (let i = 0; i < userId.length; i++) {
		hash = (hash << 5) - hash + userId.charCodeAt(i)
		hash |= 0
	}
	return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length]
}

const SECRET_KEY = process.env.LIVEBLOCKS_SECRET_KEY ?? ''
const API_BASE = 'https://api.liveblocks.io/v2'

export async function ensureRoomExists(roomId: string): Promise<void> {
	const res = await fetch(`${API_BASE}/rooms/${encodeURIComponent(roomId)}`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${SECRET_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id: roomId }),
	})

	if (!res.ok) {
		throw new Error(`Failed to create Liveblocks room: ${res.status}`)
	}
}

export async function authorizeUser({
	roomId,
	userId,
	userInfo,
}: {
	roomId: string
	userId: string
	userInfo: { name: string; avatar: string; cursorColor: string }
}): Promise<{ token: string }> {
	const res = await fetch(
		`${API_BASE}/rooms/${encodeURIComponent(roomId)}/authorize`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${SECRET_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userId, userInfo }),
		}
	)

	if (!res.ok) {
		throw new Error(`Liveblocks authorization failed: ${res.status}`)
	}

	return res.json()
}
