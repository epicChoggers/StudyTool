export interface QuizQuestion {
  index: number
  questionId: string
  question: string
  answers: string[]
  correctAnswers: string[]
  selectedAnswer: string
  isCorrect: boolean
  bank: string
  title?: string
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

// Fallback quiz data in case external files fail to load
const fallbackQuizData: QuizQuestion[] = [
  {
    index: 1,
    questionId: "fallback_1",
    question: "What is the capital of France?",
    answers: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswers: ["Paris"],
    selectedAnswer: "Paris",
    isCorrect: true,
    bank: "Fallback Quiz - General Knowledge"
  },
  {
    index: 2,
    questionId: "fallback_2",
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswers: ["Mars"],
    selectedAnswer: "Mars",
    isCorrect: true,
    bank: "Fallback Quiz - General Knowledge"
  },
  {
    index: 3,
    questionId: "fallback_3",
    question: "What is 2 + 2?",
    answers: ["3", "4", "5", "6"],
    correctAnswers: ["4"],
    selectedAnswer: "4",
    isCorrect: true,
    bank: "Fallback Quiz - General Knowledge"
  }
]

// Function to extract chapter number from title for sorting
export const extractChapterNumber = (title: string): number => {
  const match = title.match(/Chapter\s+(\d+)/i)
  return match ? parseInt(match[1], 10) : 999 // Put non-chapter items at the end
}

// Function to capitalize first letter of a string
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
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
        // Try different paths for development vs production
        let response = await fetch(`/quizzes/${fileName}`)
        
        // If that fails, try the public path
        if (!response.ok) {
          response = await fetch(`/StudyTool/quizzes/${fileName}`)
        }
        
        // If that also fails, try relative path
        if (!response.ok) {
          response = await fetch(`./quizzes/${fileName}`)
        }
        
        if (response.ok) {
          const quizData: QuizQuestion[] = await response.json()
          if (quizData.length > 0) {
            // Use the title field if available, otherwise fall back to bank name
            const bankName = quizData[0].title || quizData[0].bank || 'Unknown Topic'
            const bankId = fileName.replace('.json', '')
            
            // Capitalize first letter of each question
            const processedQuestions = quizData.map(q => ({
              ...q,
              question: capitalizeFirstLetter(q.question)
            }))
            
            quizBanks.push({
              id: bankId,
              name: bankName,
              questions: processedQuestions
            })
          }
        } else {
          console.warn(`Failed to load quiz file: ${fileName} - Status: ${response.status}`)
        }
      } catch (error) {
        console.warn(`Failed to load quiz file: ${fileName}`, error)
      }
    }

    // Sort quiz banks by chapter number
    quizBanks.sort((a, b) => {
      const chapterA = extractChapterNumber(a.name)
      const chapterB = extractChapterNumber(b.name)
      return chapterA - chapterB
    })

    // If no quiz files were loaded, add fallback data
    if (quizBanks.length === 0) {
      console.log('No quiz files loaded, using fallback data')
      quizBanks.push({
        id: 'fallback',
        name: 'Fallback Quiz - General Knowledge',
        questions: fallbackQuizData
      })
    }

    console.log(`Successfully loaded ${quizBanks.length} quiz banks`)
    return quizBanks
  } catch (error) {
    console.error('Error loading quiz data:', error)
    // Return fallback data if everything fails
    return [{
      id: 'fallback',
      name: 'Fallback Quiz - General Knowledge',
      questions: fallbackQuizData
    }]
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
