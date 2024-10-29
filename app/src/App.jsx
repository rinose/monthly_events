import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Uploader from './components/uploader.jsx'
import Analyzer from './components/analyzer.jsx'
import Corrector from './components/corrector.jsx'


function App() {
  const [dataToAnalyze, setDataToAnalyze] = useState(null);
  const [results, setResults] = useState(null);


  const onImageReady = (data) => {
    setDataToAnalyze(data);
  }

  const onAnalyzed = (results) => {
    setResults(results);
  }

  return (
    <>
      <Uploader
        onSubmitted={onImageReady}
      />
      <Analyzer
        data={dataToAnalyze}
        onAnalyzed={onAnalyzed}
      />
      {
      (results) &&
      <Corrector
        images={dataToAnalyze.files}
        results={results}
      />
      }
    </>
  )
}

export default App
