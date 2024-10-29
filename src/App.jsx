import { useState, useEffect, useRef } from 'react'
import './App.css'
import { FaChrome } from 'react-icons/fa'
import { analytics } from './firebase';

function App() {
  const [progress, setProgress] = useState(10)
  const [tasks, setTasks] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const progressBarRef = useRef(null)
  const taskListRef = useRef(null)

  const demoTasks = [
    "HIT THE GYM",
    "DEBUG THE MAINFRAME", 
    "LEARN KUNG FU !urgent",
    "ESCAPE THE MATRIX",
    "CALL MOM",
    "DECODE THE SIGNAL",
    "MEET MORPHEUS !urgent", 
    "BACKUP THE DATABASE",
    "PRACTICE MEDITATION",
    "FIND THE WHITE RABBIT"
  ]

  const totalBlocks = 10

  useEffect(() => {
    // Initialize with first completed task
    setTasks([{
      text: demoTasks[demoTasks.length - 1],
      completed: true
    }])

    let currentTaskIndex = 0
    let currentCharIndex = 0
    let typingSpeed = 100

    const typeWriter = () => {
      const currentTask = demoTasks[currentTaskIndex]
      
      if (currentCharIndex <= currentTask.length) {
        setCurrentInput(currentTask.substring(0, currentCharIndex))
        currentCharIndex++
        typingSpeed = 100
      }

      if (currentCharIndex > currentTask.length) {
        addTaskToList(currentTask)
        currentCharIndex = 0
        currentTaskIndex = (currentTaskIndex + 1) % demoTasks.length
        setCurrentInput('')
        typingSpeed = 500
      }

      setTimeout(typeWriter, typingSpeed)
    }

    typeWriter()
  }, [])

  const addTaskToList = (task) => {
    setTasks(prevTasks => {
      // Check if task already exists (compare the cleaned version of the task)
      const cleanTask = task.replace(/!urgent/i, '').trim();
      if (prevTasks.some(t => t.text === cleanTask)) {
        return prevTasks;
      }
      
      // Check if task is marked as urgent
      const isUrgent = task.toLowerCase().includes('!urgent');
      
      // Create new task
      const newTask = {
        text: cleanTask,
        completed: false,
        urgent: isUrgent,
        id: Date.now()
      };

      // Create new tasks array with the new task at the beginning
      const newTasks = [newTask, ...prevTasks];

      // Mark the previous task (now at index 1) as completed
      if (newTasks.length > 1) {
        newTasks[1] = {
          ...newTasks[1],
          completed: true
        };
        setProgress(prev => (prev + 10) % 110);
      }

      // Keep only the last 5 tasks
      return newTasks.slice(0, 5);
    });
  }

  const renderProgressBlocks = () => {
    const filledBlocks = Math.floor((progress / 100) * totalBlocks)
    return Array(totalBlocks).fill().map((_, i) => (
      <div key={i} className={`progress-block${i < filledBlocks ? ' filled' : ''}`} />
    ))
  }

  return (
    <>
      <canvas id="matrix-bg"></canvas>
      <div className="container">
        <header className="header">
          <h1 className="title">MATRIX TODO</h1>
          <p className="description">
            A Chrome extension that replaces new tab page with a Matrix-themed todo list
          </p>
          <a 
            href="#" // Replace with actual Chrome Web Store link
            className="download-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaChrome className="chrome-icon" />
            <span>DOWNLOAD EXTENSION</span>
          </a>
        </header>

        <main className="main-content">
          <div className="progress-section">
            <div className="progress-bar" ref={progressBarRef}>
              {renderProgressBlocks()}
            </div>
            <div className="progress-text">{progress}% COMPLETE</div>
          </div>

          <div className="task-section">
            <div className="input-wrapper">
              <div className="task-input" id="demo-input">{currentInput}</div>
              <div className="ghost-text"></div>
            </div>
            <div className="task-list" ref={taskListRef}>
              {tasks.map((task, index) => (
                <div 
                  key={task.id || index} 
                  className={`task-item ${task.completed ? 'completed' : ''} ${task.urgent ? 'urgent' : ''} ${index === 0 ? 'new-item' : ''}`}
                >
                  {task.text}
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="footer">
          <div className="shortcut-hint">
            CTRL + SHIFT + C TO CLEAR COMPLETED
            <div className="attribution-wrapper">
              <span className="attribution">• made by <a href="https://x.com/aladdinnjr" target="_blank">@aladdinnjr</a></span>
              <span className="attribution">• based on <a href="https://x.com/joshuawolk/status/1850408475643502847" target="_blank">@joshuawolk</a></span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
