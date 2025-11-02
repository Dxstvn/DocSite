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

export interface GAD7Result {
  score: number
  severity: string
  interpretation: string
  recommendation: string
}

export function calculateGAD7(answers: number[]): GAD7Result {
  const score = answers.reduce((sum, val) => sum + val, 0)

  let severity: string
  let interpretation: string

  if (score <= 4) {
    severity = 'Minimal'
    interpretation = 'Your responses suggest minimal anxiety symptoms.'
  } else if (score <= 9) {
    severity = 'Mild'
    interpretation = 'Your responses suggest mild anxiety symptoms.'
  } else if (score <= 14) {
    severity = 'Moderate'
    interpretation = 'Your responses suggest moderate anxiety symptoms.'
  } else {
    severity = 'Severe'
    interpretation = 'Your responses suggest severe anxiety symptoms.'
  }

  const recommendation = score >= 10
    ? 'Based on your responses, we recommend speaking with a mental health professional for a comprehensive evaluation and discussion of treatment options.'
    : 'Continue monitoring your mental health. If symptoms worsen or persist, consider consulting a mental health professional.'

  return { score, severity, interpretation, recommendation }
}
