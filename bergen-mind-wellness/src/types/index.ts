// Type definitions for Bergen Mind & Wellness

export interface ScreeningResult {
  score: number
  severity: string
  interpretation: string
  recommendation: string
}

export interface ScreeningQuestion {
  id: number
  text: string
}

export interface ScreeningOption {
  value: number
  label: string
}
