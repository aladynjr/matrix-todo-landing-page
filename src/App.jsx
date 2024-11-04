import { useState, useEffect, useRef, useMemo } from 'react'
import './App.css'
import { FaChrome } from 'react-icons/fa'
import { analytics } from './firebase';

const FeatureConnector = ({ featureRef, globalTasks }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const updateLines = () => {
      if (!featureRef.current) return;

      const featureBox = featureRef.current.getBoundingClientRect();
      const featureCenter = {
        x: featureBox.left + featureBox.width / 2,
        y: featureBox.top + featureBox.height / 2
      };

      const taskElements = document.querySelectorAll('.global-task');
      const newLines = Array.from(taskElements).map(task => {
        const taskBox = task.getBoundingClientRect();
        const taskCenter = {
          x: taskBox.left + taskBox.width / 2,
          y: taskBox.top + taskBox.height / 2
        };

        return `M ${featureCenter.x} ${featureCenter.y} L ${taskCenter.x} ${taskCenter.y}`;
      });

      setLines(newLines);
    };

    updateLines();
    window.addEventListener('resize', updateLines);
    window.addEventListener('orientationchange', updateLines);
    return () => {
      window.removeEventListener('resize', updateLines);
      window.removeEventListener('orientationchange', updateLines);
    };
  }, [featureRef, globalTasks]);

  return (
    <svg className="connection-lines">
      {lines.map((path, index) => (
        <path key={index} d={path} className="connection-line" />
      ))}
    </svg>
  );
};

function App() {
  const [progress, setProgress] = useState(10)
  const [tasks, setTasks] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const progressBarRef = useRef(null)
  const taskListRef = useRef(null)
  const featureRef = useRef(null)

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

  // Replace the useMemo block with this
  const globalTasks = useMemo(() => {
    // Adjust positions to be more responsive
    const getResponsivePosition = (defaultLeft, defaultTop) => {
      return {
        left: `${defaultLeft}%`,
        top: `${defaultTop}%`,
        transform: 'translate(-50%, -50%)' // Center the task relative to its position
      };
    };

    const positions = [
      getResponsivePosition(10, 20),
      getResponsivePosition(90, 25),
      getResponsivePosition(88, 60),
      getResponsivePosition(5, 65),
      getResponsivePosition(8, 40),
      getResponsivePosition(92, 45),
      getResponsivePosition(15, 85),
      getResponsivePosition(82, 35),
      getResponsivePosition(12, 30),
      getResponsivePosition(90, 75)
    ];

    const tasks = [
      { id: 'USER-01', text: 'Review pull requests for frontend', completed: false, delay: -3.5 },
      { id: 'USER-02', text: 'Schedule dentist appointment', completed: false, delay: -2.1 },
      { id: 'USER-03', text: 'Prepare slides for team meeting', completed: false, delay: -5.4 },
      { id: 'USER-04', text: 'Buy groceries for dinner', completed: true, delay: -1.8 },
      { id: 'USER-05', text: 'Fix responsive layout bugs', completed: false, delay: -4.2 },
      { id: 'USER-06', text: 'Call mom for birthday', completed: false, delay: -3.8 },
      { id: 'USER-07', text: 'Update project documentation', completed: false, delay: -2.9 },
      { id: 'USER-08', text: 'Renew gym membership', completed: false, delay: -4.7 },
      { id: 'USER-09', text: 'Book flight for conference', completed: true, delay: -1.5 },
      { id: 'USER-10', text: 'Start learning TypeScript', completed: false, delay: -3.2 }
    ];

    return tasks.map((task, index) => ({
      ...task,
      position: positions[index]
    }));
  }, []);

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
      
      <div className="global-tasks-container">
        <div className="global-tasks-list">
          {globalTasks.map(task => (
            <div
              key={task.id}
              className={`global-task ${task.completed ? 'completed' : ''}`}
              style={{
                position: 'absolute',
                left: task.position.left,
                top: task.position.top,
                animationDelay: `${task.delay}s`
              }}
            >
              <div className="task-id">{task.id}</div>
              <div className="task-text">{task.text}</div>
            </div>
          ))}
        </div>
      </div>

      <FeatureConnector featureRef={featureRef} globalTasks={globalTasks} />

      <div className="container">
        <header className="header">
          <h1 className="title">MATRIX TODO</h1>
          <p className="description">
            A Chrome extension that replaces new tab page with a Matrix-themed todo list
          </p>
          
          <div ref={featureRef} className="new-feature">
            <span className="new-badge">NEW FEATURE</span>
            <p className="feature-description">
              VIEW other hackers' TODO items spread across your screen in REALTIME.
              <br />
              Feel connected to the PRODUCTIVITY of your fellow hackers.
              <br />
              You are not alone in facing your tasks ANYMORE.
            </p>
          </div>

          <a 
            href="#" 
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
