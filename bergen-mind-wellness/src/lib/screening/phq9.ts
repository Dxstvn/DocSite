export interface PHQ9Question {
  id: number
  text: string
}

export const phq9Questions: PHQ9Question[] = [
  { id: 1, text: 'Little interest or pleasure in doing things' },
  { id: 2, text: 'Feeling down, depressed, or hopeless' },
  { id: 3, text: 'Trouble falling or staying asleep, or sleeping too much' },
  { id: 4, text: 'Feeling tired or having little energy' },
  { id: 5, text: 'Poor appetite or overeating' },
  { id: 6, text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down' },
  { id: 7, text: 'Trouble concentrating on things, such as reading the newspaper or watching television' },
  { id: 8, text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual' },
  { id: 9, text: 'Thoughts that you would be better off dead, or of hurting yourself' },
]

export const phq9Options = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
]

export interface PHQ9Result {
  score: number
  severity: string
  interpretation: string
  recommendation: string
}

export function calculatePHQ9(answers: number[]): PHQ9Result {
  const score = answers.reduce((sum, val) => sum + val, 0)

  let severity: string
  let interpretation: string

  if (score <= 4) {
    severity = 'Minimal'
    interpretation = 'Your responses suggest minimal depression symptoms.'
  } else if (score <= 9) {
    severity = 'Mild'
    interpretation = 'Your responses suggest mild depression symptoms.'
  } else if (score <= 14) {
    severity = 'Moderate'
    interpretation = 'Your responses suggest moderate depression symptoms.'
  } else if (score <= 19) {
    severity = 'Moderately Severe'
    interpretation = 'Your responses suggest moderately severe depression symptoms.'
  } else {
    severity = 'Severe'
    interpretation = 'Your responses suggest severe depression symptoms.'
  }

  const recommendation = score >= 10
    ? 'Based on your responses, we recommend speaking with a mental health professional for a comprehensive evaluation and discussion of treatment options.'
    : 'Continue monitoring your mental health. If symptoms worsen or persist, consider consulting a mental health professional.'

  return { score, severity, interpretation, recommendation }
}
