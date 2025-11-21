export interface GAD7Question {
  id: number
  text: string
}

export const gad7Questions: GAD7Question[] = [
  { id: 1, text: 'Feeling nervous, anxious, or on edge' },
  { id: 2, text: 'Not being able to stop or control worrying' },
  { id: 3, text: 'Worrying too much about different things' },
  { id: 4, text: 'Trouble relaxing' },
  { id: 5, text: 'Being so restless that it is hard to sit still' },
  { id: 6, text: 'Becoming easily annoyed or irritable' },
  { id: 7, text: 'Feeling afraid, as if something awful might happen' },
]

export const gad7Options = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
]

export type GAD7Severity = 'minimal' | 'mild' | 'moderate' | 'severe'

export interface GAD7Result {
  score: number
  severityKey: GAD7Severity
  recommendationKey: 'low' | 'high'
}

export function calculateGAD7(answers: number[]): GAD7Result {
  const score = answers.reduce((sum, val) => sum + val, 0)

  let severityKey: GAD7Severity
  if (score <= 4) {
    severityKey = 'minimal'
  } else if (score <= 9) {
    severityKey = 'mild'
  } else if (score <= 14) {
    severityKey = 'moderate'
  } else {
    severityKey = 'severe'
  }

  const recommendationKey = score >= 10 ? 'high' : 'low'

  return { score, severityKey, recommendationKey }
}
