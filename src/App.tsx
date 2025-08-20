import { useState, useEffect } from 'react'
import './App.css'
import { loadQuizData, createComprehensiveReview, ProcessedQuestion, QuizBank } from './utils/quizUtils'

// Local storage keys
const STORAGE_KEYS = {
  SELECTED_QUIZ: 'studytool_selected_quiz',
  CURRENT_QUESTION_INDEX: 'studytool_current_question_index',
  SCORE: 'studytool_score',
  COMPLETED_QUESTIONS: 'studytool_completed_questions',
  QUIZ_HISTORY: 'studytool_quiz_history'
}

// Load data from localStorage
const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Failed to load from localStorage: ${key}`, error)
    return defaultValue
  }
}

// Save data to localStorage
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Failed to save to localStorage: ${key}`, error)
  }
}

function App() {
  const [quizBanks, setQuizBanks] = useState<QuizBank[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<string>(() => 
    loadFromStorage(STORAGE_KEYS.SELECTED_QUIZ, 'comprehensive')
  )
  const [currentQuestions, setCurrentQuestions] = useState<ProcessedQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => 
    loadFromStorage(STORAGE_KEYS.CURRENT_QUESTION_INDEX, 0)
  )
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState<number>(() => 
    loadFromStorage(STORAGE_KEYS.SCORE, 0)
  )
  const [isLoading, setIsLoading] = useState(true)
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(() => {
    const saved = loadFromStorage(STORAGE_KEYS.COMPLETED_QUESTIONS, [])
    return new Set(saved)
  })

  // Load quiz data on component mount
  useEffect(() => {
    const loadQuizzes = async () => {
      setIsLoading(true)
      try {
        const banks = await loadQuizData()
        setQuizBanks(banks)
        if (banks.length > 0) {
          // Load questions based on selected quiz
          handleQuizChange(selectedQuiz, banks)
        }
      } catch (error) {
        console.error('Failed to load quizzes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuizzes()
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SELECTED_QUIZ, selectedQuiz)
  }, [selectedQuiz])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CURRENT_QUESTION_INDEX, currentQuestionIndex)
  }, [currentQuestionIndex])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SCORE, score)
  }, [score])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.COMPLETED_QUESTIONS, Array.from(completedQuestions))
  }, [completedQuestions])

  // Handle quiz selection change
  const handleQuizChange = (quizId: string, banks?: QuizBank[]) => {
    const quizBanksToUse = banks || quizBanks
    setSelectedQuiz(quizId)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setCompletedQuestions(new Set())

    if (quizId === 'comprehensive') {
      const comprehensiveQuestions = createComprehensiveReview(quizBanksToUse)
      setCurrentQuestions(comprehensiveQuestions)
    } else {
      const selectedBank = quizBanksToUse.find(bank => bank.id === quizId)
      if (selectedBank) {
        const processedQuestions = selectedBank.questions.map((q, index) => ({
          id: index + 1,
          text: q.question,
          options: q.answers,
          correctAnswer: q.answers.findIndex(answer => q.correctAnswers.includes(answer)),
          originalQuestion: q
        }))
        setCurrentQuestions(processedQuestions)
      }
    }
  }

  const currentQuestion = currentQuestions[currentQuestionIndex]

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }

    // Mark this question as completed
    setCompletedQuestions(prev => new Set([...prev, currentQuestionIndex]))

    setShowResult(true)
  }

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setCompletedQuestions(new Set())
  }

  // Calculate progress percentage
  const progressPercentage = currentQuestions.length > 0 
    ? Math.round((completedQuestions.size / currentQuestions.length) * 100)
    : 0

  if (isLoading) {
    return (
      <div className="app">
        <div className="container">
          <div className="loading">
            <h2>Loading quizzes...</h2>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  if (currentQuestions.length === 0) {
    return (
      <div className="app">
        <div className="container">
          <div className="error">
            <h2>No quizzes available</h2>
            <p>Please check if the quiz files are properly loaded.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Study Tool</h1>
          
          {/* Quiz Selector Dropdown */}
          <div className="quiz-selector">
            <label htmlFor="quiz-select">Select Quiz:</label>
            <select
              id="quiz-select"
              value={selectedQuiz}
              onChange={(e) => handleQuizChange(e.target.value)}
              className="quiz-dropdown"
            >
              <option value="comprehensive">📚 Comprehensive Review (All Topics)</option>
              <optgroup label="Individual Topic Quizzes">
                {quizBanks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    📝 {bank.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="progress">
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
            {progressPercentage > 0 && (
              <span className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </span>
            )}
          </div>
          <div className="score">Score: {score}</div>
        </header>

        <main className="main">
          <div className="question-card">
            <h2 className="question-text">{currentQuestion.text}</h2>
            
            <div className="options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option ${selectedAnswer === index ? 'selected' : ''} ${
                    showResult 
                      ? index === currentQuestion.correctAnswer 
                        ? 'correct' 
                        : selectedAnswer === index && index !== currentQuestion.correctAnswer
                        ? 'incorrect'
                        : ''
                      : ''
                  }`}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  {option}
                </button>
              ))}
            </div>

            {!showResult && (
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </button>
            )}

            {showResult && (
              <div className="result">
                <div className={`result-message ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'}`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
                </div>
                <div className="correct-answer">
                  Correct answer: {currentQuestion.options[currentQuestion.correctAnswer]}
                </div>
                {currentQuestionIndex < currentQuestions.length - 1 ? (
                  <button className="next-btn" onClick={handleNext}>
                    Next Question
                  </button>
                ) : (
                  <div className="quiz-complete">
                    <h3>Quiz Complete!</h3>
                    <p>Final Score: {score} out of {currentQuestions.length}</p>
                    <button className="restart-btn" onClick={handleRestart}>
                      Restart Quiz
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
