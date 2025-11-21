export interface ASRSQuestion {
  id: number
  part: 'A' | 'B'
  text: string
}

export const asrsQuestions: ASRSQuestion[] = [
  // Part A (6 questions)
  { id: 1, part: 'A', text: 'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?' },
  { id: 2, part: 'A', text: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?' },
  { id: 3, part: 'A', text: 'How often do you have problems remembering appointments or obligations?' },
  { id: 4, part: 'A', text: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?' },
  { id: 5, part: 'A', text: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?' },
  { id: 6, part: 'A', text: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?' },
  // Part B (12 questions)
  { id: 7, part: 'B', text: 'How often do you make careless mistakes when you have to work on a boring or difficult project?' },
  { id: 8, part: 'B', text: 'How often do you have difficulty keeping your attention when you are doing boring or repetitive work?' },
  { id: 9, part: 'B', text: 'How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?' },
  { id: 10, part: 'B', text: 'How often do you misplace or have difficulty finding things at home or at work?' },
  { id: 11, part: 'B', text: 'How often are you distracted by activity or noise around you?' },
  { id: 12, part: 'B', text: 'How often do you leave your seat in meetings or other situations in which you are expected to remain seated?' },
  { id: 13, part: 'B', text: 'How often do you feel restless or fidgety?' },
  { id: 14, part: 'B', text: 'How often do you have difficulty unwinding and relaxing when you have time to yourself?' },
  { id: 15, part: 'B', text: 'How often do you find yourself talking too much when you are in social situations?' },
  { id: 16, part: 'B', text: 'When you\'re in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?' },
  { id: 17, part: 'B', text: 'How often do you have difficulty waiting your turn in situations when turn taking is required?' },
  { id: 18, part: 'B', text: 'How often do you interrupt others when they are busy?' },
]

export const asrsOptions = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Very Often' },
]

export type ASRSScreening = 'positive' | 'negative'

export interface ASRSResult {
  partAScore: number
  partBScore: number
  totalScore: number
  partAPositive: number  // Number of Part A questions scored 3 or 4
  screeningKey: ASRSScreening
  interpretationKey: ASRSScreening
  recommendationKey: ASRSScreening
}

export function calculateASRS(answers: number[]): ASRSResult {
  // Part A: questions 0-5 (indices), Part B: questions 6-17 (indices)
  const partAAnswers = answers.slice(0, 6)
  const partBAnswers = answers.slice(6, 18)

  const partAScore = partAAnswers.reduce((sum, val) => sum + val, 0)
  const partBScore = partBAnswers.reduce((sum, val) => sum + val, 0)
  const totalScore = partAScore + partBScore

  // Count Part A questions with "Often" (3) or "Very Often" (4)
  const partAPositive = partAAnswers.filter(val => val >= 3).length

  // Screening is positive if 4 or more Part A questions are "Often" or "Very Often"
  const screeningKey: ASRSScreening = partAPositive >= 4 ? 'positive' : 'negative'

  return {
    partAScore,
    partBScore,
    totalScore,
    partAPositive,
    screeningKey,
    interpretationKey: screeningKey,
    recommendationKey: screeningKey,
  }
}
