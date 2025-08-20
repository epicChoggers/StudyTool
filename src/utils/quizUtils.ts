export interface QuizQuestion {
  index: number
  questionId: string
  question: string
  answers: string[]
  correctAnswers: string[]
  selectedAnswer: string
  isCorrect: boolean
  bank: string
}

export interface QuizBank {
  id: string
  name: string
  questions: QuizQuestion[]
}

export interface ProcessedQuestion {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  originalQuestion: QuizQuestion
}

// Function to load quiz data from JSON files
export const loadQuizData = async (): Promise<QuizBank[]> => {
  try {
    // In a real application, you would fetch these files from your server
    // For now, we'll import them directly. You may need to adjust this based on your setup
    const quizFiles = [
      'canvas_quiz_results_1755654631020.json',
      'canvas_quiz_results_1755654636456.json',
      'canvas_quiz_results_1755654642621.json',
      'canvas_quiz_results_1755654648626.json',
      'canvas_quiz_results_1755654653858.json',
      'canvas_quiz_results_1755654658566.json',
      'canvas_quiz_results_1755654662791.json',
      'canvas_quiz_results_1755654666987.json',
      'canvas_quiz_results_1755654671653.json',
      'canvas_quiz_results_1755654677481.json',
      'canvas_quiz_results_1755654685712.json',
      'canvas_quiz_results_1755654690966.json',
      'canvas_quiz_results_1755654695793.json',
      'canvas_quiz_results_1755654702275.json',
      'canvas_quiz_results_1755654711436.json',
      'canvas_quiz_results_1755654715305.json',
      'canvas_quiz_results_1755654719358.json',
      'canvas_quiz_results_1755654723382.json',
      'canvas_quiz_results_1755654728535.json',
      'canvas_quiz_results_1755654731788.json',
      'canvas_quiz_results_1755654736147.json',
      'canvas_quiz_results_1755654741176.json',
      'canvas_quiz_results_1755654747371.json',
      'canvas_quiz_results_1755654751542.json',
      'canvas_quiz_results_1755654758363.json',
      'canvas_quiz_results_1755654762380.json',
      'canvas_quiz_results_1755654766924.json',
      'canvas_quiz_results_1755654771420.json',
      'canvas_quiz_results_1755654774952.json',
      'canvas_quiz_results_1755654778339.json',
      'canvas_quiz_results_1755654781736.json',
      'canvas_quiz_results_1755654785730.json',
      'canvas_quiz_results_1755654789198.json',
      'canvas_quiz_results_1755654792260.json',
      'canvas_quiz_results_1755654796556.json'
    ]

    const quizBanks: QuizBank[] = []
    
    for (const fileName of quizFiles) {
      try {
        const response = await fetch(`/quizzes/${fileName}`)
        if (response.ok) {
          const quizData: QuizQuestion[] = await response.json()
          if (quizData.length > 0) {
            const bankName = quizData[0].bank
            const bankId = fileName.replace('.json', '')
            
            quizBanks.push({
              id: bankId,
              name: bankName,
              questions: quizData
            })
          }
        }
      } catch (error) {
        console.warn(`Failed to load quiz file: ${fileName}`, error)
      }
    }

    return quizBanks
  } catch (error) {
    console.error('Error loading quiz data:', error)
    return []
  }
}

// Function to convert quiz questions to the format expected by the app
export const processQuizQuestions = (questions: QuizQuestion[]): ProcessedQuestion[] => {
  return questions.map((q, index) => ({
    id: index + 1,
    text: q.question,
    options: q.answers,
    correctAnswer: q.answers.findIndex(answer => q.correctAnswers.includes(answer)),
    originalQuestion: q
  }))
}

// Function to create comprehensive review with randomized questions
export const createComprehensiveReview = (quizBanks: QuizBank[]): ProcessedQuestion[] => {
  const allQuestions: ProcessedQuestion[] = []
  
  quizBanks.forEach(bank => {
    const processedQuestions = processQuizQuestions(bank.questions)
    allQuestions.push(...processedQuestions)
  })
  
  // Shuffle the questions for comprehensive review
  return shuffleArray(allQuestions)
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
