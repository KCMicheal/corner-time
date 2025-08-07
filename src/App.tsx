import { useState } from 'react'
import { DigitalDisplay } from './components/DigitalDisplay'
import { Controls } from './components/Controls'
export default function App() {
  const [mode, setMode] = useState<'clock' | 'timer' | 'stopwatch'>('clock')
  const [isRunning, setIsRunning] = useState(false)
  const [timerDuration, setTimerDuration] = useState(25 * 60) // 25 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(timerDuration)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const toggleMode = () => {
    if (mode === 'clock') {
      setMode('timer')
      setTimeRemaining(timerDuration)
    } else if (mode === 'timer') {
      setMode('stopwatch')
      setTimeRemaining(0)
    } else {
      setMode('clock')
    }
    setIsRunning(false)
    }
   const toggleFullscreen = () => {
     if (!document.fullscreenElement) {
       document.documentElement.requestFullscreen().catch((err) => {
         console.error(`Error attempting to enable fullscreen: ${err.message}`);
       });
       setIsFullscreen(true);
     } else {
       document.exitFullscreen();
       setIsFullscreen(false);
     }
   };

    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-black text-blue-400">
        <div className="w-full max-w-4xl p-6">
          <DigitalDisplay
            mode={mode}
            isRunning={isRunning}
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
          />
          <Controls
            mode={mode}
            toggleMode={toggleMode}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            timerDuration={timerDuration}
            setTimerDuration={setTimerDuration}
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            toggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
          />
        </div>
      </div>
    );
  }