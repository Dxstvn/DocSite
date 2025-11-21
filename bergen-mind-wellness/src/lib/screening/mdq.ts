export interface MDQQuestion {
  id: number
  text: string
}

export const mdqQuestions: MDQQuestion[] = [
  { id: 1, text: 'You felt so good or so hyper that other people thought you were not your normal self or you were so hyper that you got into trouble?' },
  { id: 2, text: 'You were so irritable that you shouted at people or started fights or arguments?' },
  { id: 3, text: 'You felt much more self-confident than usual?' },
  { id: 4, text: 'You got much less sleep than usual and found you didn\'t really miss it?' },
  { id: 5, text: 'You were much more talkative or spoke much faster than usual?' },
  { id: 6, text: 'Thoughts raced through your head or you couldn\'t slow your mind down?' },
  { id: 7, text: 'You were so easily distracted by things around you that you had trouble concentrating or staying on track?' },
  { id: 8, text: 'You had much more energy than usual?' },
  { id: 9, text: 'You were much more active or did many more things than usual?' },
  { id: 10, text: 'You were much more social or outgoing than usual, for example, you telephoned friends in the middle of the night?' },
  { id: 11, text: 'You were much more interested in sex than usual?' },
  { id: 12, text: 'You did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?' },
  { id: 13, text: 'Spending money got you or your family into trouble?' },
]

export const mdqFollowUpQuestions = {
  coOccurrence: 'If you checked YES to more than one of the above, have several of these ever happened during the same period of time?',
  problemLevel: 'How much of a problem did any of these cause you?',
}

export const problemLevelOptions = [
  { value: 0, label: 'No problem' },
  { value: 1, label: 'Minor problem' },
  { value: 2, label: 'Moderate problem' },
  { value: 3, label: 'Serious problem' },
]

export type MDQScreening = 'positive' | 'negative'

export interface MDQResult {
  yesCount: number
  coOccurrence: boolean
  problemLevel: number
  screeningKey: MDQScreening
  interpretationKey: string
  recommendationKey: string
}

export function calculateMDQ(
  answers: boolean[],
  coOccurrence: boolean,
  problemLevel: number
): MDQResult {
  const yesCount = answers.filter(ans => ans === true).length

  // Positive screen requires:
  // 1. 7 or more YES answers
  // 2. Several symptoms occurred during the same time period (co-occurrence)
  // 3. Symptoms caused Moderate or Serious problems (problemLevel >= 2)
  const screeningKey: MDQScreening =
    yesCount >= 7 && coOccurrence && problemLevel >= 2
      ? 'positive'
      : 'negative'

  let interpretationKey: string
  let recommendationKey: string

  if (screeningKey === 'positive') {
    interpretationKey = 'positive'
    recommendationKey = 'positive'
  } else {
    if (yesCount >= 7 && !coOccurrence) {
      interpretationKey = 'negativeNoCoOccurrence'
      recommendationKey = 'negativeNoCoOccurrence'
    } else if (yesCount >= 7 && problemLevel < 2) {
      interpretationKey = 'negativeLowProblemLevel'
      recommendationKey = 'negativeLowProblemLevel'
    } else {
      interpretationKey = 'negative'
      recommendationKey = 'negative'
    }
  }

  return {
    yesCount,
    coOccurrence,
    problemLevel,
    screeningKey,
    interpretationKey,
    recommendationKey,
  }
}
