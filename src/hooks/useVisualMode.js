import { useState } from 'react';


export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial]);
  return {
    mode, 
    transition: function (arg, replaceBool) {
      if (replaceBool) {
        setMode(arg)
      } else {
        setHistory([...history, mode])
        setMode(arg)
      }
    },
    back: function() {
      if (history.length > 1) {
        setMode(history.pop())
      } else {
        setMode(mode)
      }
    }
  }
}