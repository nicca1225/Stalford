export type DetailedGrading = {
  question_number: string
  marks_awarded: number
  max_marks: number
  topic_tag: string
  is_fully_correct: boolean
  error_type: string | null
  tutor_reasoning: string
  student_exam_tip: string
}

export type StudentResult = {
  student_name: string
  class_id: string
  student_total_marks: number
  paper_total_marks: number
  overall_percentage: number
  topic_scores: Record<string, number | null>
  detailed_grading: DetailedGrading[]
}

export type ClassSummary = {
  class_id: string
  total_students: number
  paper_total_marks: number
  class_average_percentage: number
  students_needing_attention: number
  performance_by_topic: Record<string, number | null>
}

export type ClassPayload = {
  class_summary: ClassSummary
  students: StudentResult[]
}

export type DatabaseFeed = {
  all_classes: ClassPayload[]
}

export type GradingStatus = {
  status: "idle" | "processing" | "complete" | "error"
  progress: string
}
