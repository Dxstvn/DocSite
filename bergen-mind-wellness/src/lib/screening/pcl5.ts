export interface PCL5Question {
  id: number
  text: string
  cluster: 'reexperiencing' | 'avoidance' | 'negative_cognitions' | 'arousal'
}

export const pcl5Questions: PCL5Question[] = [
  // Cluster B: Re-experiencing (items 1-5)
  { id: 1, cluster: 'reexperiencing', text: 'Repeated, disturbing, and unwanted memories of the stressful experience?' },
  { id: 2, cluster: 'reexperiencing', text: 'Repeated, disturbing dreams of the stressful experience?' },
  { id: 3, cluster: 'reexperiencing', text: 'Suddenly feeling or acting as if the stressful experience were actually happening again (as if you were actually back there reliving it)?' },
  { id: 4, cluster: 'reexperiencing', text: 'Feeling very upset when something reminded you of the stressful experience?' },
  { id: 5, cluster: 'reexperiencing', text: 'Having strong physical reactions when something reminded you of the stressful experience (for example, heart pounding, trouble breathing, sweating)?' },

  // Cluster C: Avoidance (items 6-7)
  { id: 6, cluster: 'avoidance', text: 'Avoiding memories, thoughts, or feelings related to the stressful experience?' },
  { id: 7, cluster: 'avoidance', text: 'Avoiding external reminders of the stressful experience (for example, people, places, conversations, activities, objects, or situations)?' },

  // Cluster D: Negative cognitions and mood (items 8-14)
  { id: 8, cluster: 'negative_cognitions', text: 'Trouble remembering important parts of the stressful experience?' },
  { id: 9, cluster: 'negative_cognitions', text: 'Having strong negative beliefs about yourself, other people, or the world (for example, having thoughts such as: I am bad, there is something seriously wrong with me, no one can be trusted, the world is completely dangerous)?' },
  { id: 10, cluster: 'negative_cognitions', text: 'Blaming yourself or someone else for the stressful experience or what happened after it?' },
  { id: 11, cluster: 'negative_cognitions', text: 'Having strong negative feelings such as fear, horror, anger, guilt, or shame?' },
  { id: 12, cluster: 'negative_cognitions', text: 'Loss of interest in activities that you used to enjoy?' },
  { id: 13, cluster: 'negative_cognitions', text: 'Feeling distant or cut off from other people?' },
  { id: 14, cluster: 'negative_cognitions', text: 'Trouble experiencing positive feelings (for example, being unable to feel happiness or have loving feelings for people close to you)?' },

  // Cluster E: Arousal and reactivity (items 15-20)
  { id: 15, cluster: 'arousal', text: 'Irritable behavior, angry outbursts, or acting aggressively?' },
  { id: 16, cluster: 'arousal', text: 'Taking too many risks or doing things that could cause you harm?' },
  { id: 17, cluster: 'arousal', text: 'Being "superalert" or watchful or on guard?' },
  { id: 18, cluster: 'arousal', text: 'Feeling jumpy or easily startled?' },
  { id: 19, cluster: 'arousal', text: 'Having difficulty concentrating?' },
  { id: 20, cluster: 'arousal', text: 'Trouble falling or staying asleep?' },
]

export const pcl5Options = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'A little bit' },
  { value: 2, label: 'Moderately' },
  { value: 3, label: 'Quite a bit' },
  { value: 4, label: 'Extremely' },
]

export type PCL5Severity = 'severe' | 'borderline' | 'moderate' | 'minimal'

export interface PCL5Result {
  totalScore: number
  clusterScores: {
    reexperiencing: number
    avoidance: number
    negative_cognitions: number
    arousal: number
  }
  provisionalDiagnosis: boolean
  severityKey: PCL5Severity
  interpretationKey: PCL5Severity
  recommendationKey: PCL5Severity
}

export function calculatePCL5(answers: number[]): PCL5Result {
  const totalScore = answers.reduce((sum, val) => sum + val, 0)

  // Calculate cluster scores
  const reexperiencing = answers.slice(0, 5).reduce((sum, val) => sum + val, 0)
  const avoidance = answers.slice(5, 7).reduce((sum, val) => sum + val, 0)
  const negative_cognitions = answers.slice(7, 14).reduce((sum, val) => sum + val, 0)
  const arousal = answers.slice(14, 20).reduce((sum, val) => sum + val, 0)

  // Provisional PTSD diagnosis (DSM-5 criteria):
  // Total score >= 31-33 is commonly used cutoff
  const provisionalDiagnosis = totalScore >= 33

  let severityKey: PCL5Severity
  if (totalScore >= 33) {
    severityKey = 'severe'
  } else if (totalScore >= 31) {
    severityKey = 'borderline'
  } else if (totalScore >= 20) {
    severityKey = 'moderate'
  } else {
    severityKey = 'minimal'
  }

  return {
    totalScore,
    clusterScores: {
      reexperiencing,
      avoidance,
      negative_cognitions,
      arousal,
    },
    provisionalDiagnosis,
    severityKey,
    interpretationKey: severityKey,
    recommendationKey: severityKey,
  }
}
