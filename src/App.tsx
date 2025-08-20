import React, { useState, useEffect } from 'react'
import './App.css'
import { loadQuizData, createComprehensiveReview, ProcessedQuestion, QuizBank } from './utils/quizUtils'

function App() {
  const [quizBanks, setQuizBanks] = useState<QuizBank[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<string>('')
  const [currentQuestions, setCurrentQuestions] = useState<ProcessedQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load quiz data on component mount
  useEffect(() => {
    const loadQuizzes = async () => {
      setIsLoading(true)
      try {
        const banks = await loadQuizData()
        setQuizBanks(banks)
        if (banks.length > 0) {
          // Set default to comprehensive review
          setSelectedQuiz('comprehensive')
          const comprehensiveQuestions = createComprehensiveReview(banks)
          setCurrentQuestions(comprehensiveQuestions)
        }
      } catch (error) {
        console.error('Failed to load quizzes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuizzes()
  }, [])

  // Handle quiz selection change
  const handleQuizChange = (quizId: string) => {
    setSelectedQuiz(quizId)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)

    if (quizId === 'comprehensive') {
      const comprehensiveQuestions = createComprehensiveReview(quizBanks)
      setCurrentQuestions(comprehensiveQuestions)
    } else {
      const selectedBank = quizBanks.find(bank => bank.id === quizId)
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
  }

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
              <option value="comprehensive">📚 Comprehensive Review (All Questions)</option>
              {quizBanks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  📝 {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div className="progress">
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
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
