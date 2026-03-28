import type { DatabaseFeed, GradingStatus, StudentResult } from "@/types/database"

const BASE_URL = "http://localhost:8080"

export async function getResults(): Promise<DatabaseFeed> {
  const res = await fetch(`${BASE_URL}/api/results`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `Request failed with status ${res.status}`)
  }
  return res.json()
}

export async function getGradingStatus(): Promise<GradingStatus> {
  try {
    const res = await fetch(`${BASE_URL}/api/status`)
    return res.json()
  } catch {
    return { status: "idle", progress: "" }
  }
}

export async function uploadForGrading(
  markingScheme: File,
  worksheets: File[]
): Promise<{ status: string }> {
  const form = new FormData()
  form.append("marking_scheme", markingScheme)
  for (const ws of worksheets) {
    form.append("worksheets", ws)
  }
  const res = await fetch(`${BASE_URL}/api/grade`, {
    method: "POST",
    body: form,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.detail ?? `Upload failed with status ${res.status}`)
  }
  return res.json()
}

export function getConfidenceColor(score: number): string {
  if (score >= 75) return "bg-green-500"
  if (score >= 50) return "bg-orange-400"
  return "bg-red-500"
}

export function getConfidenceTextColor(score: number): string {
  if (score >= 75) return "text-green-600"
  if (score >= 50) return "text-orange-500"
  return "text-red-500"
}

export function findStudent(
  feed: DatabaseFeed,
  studentName: string
): StudentResult | null {
  for (const cls of feed.all_classes) {
    const match = cls.students.find((s) => s.student_name === studentName)
    if (match) return match
  }
  return null
}

export function getTopicsForClass(
  feed: DatabaseFeed,
  classId: string
): string[] {
  const cls = feed.all_classes.find(
    (c) => c.class_summary.class_id === classId
  )
  return cls ? Object.keys(cls.class_summary.performance_by_topic) : []
}
