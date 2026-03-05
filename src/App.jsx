import './App.css'
import { Header } from './components/Header'
import { HistoryLogs } from './components/HistoryLogs'
import { SleepForm } from './components/SleepForm'
import { Stats } from './components/Stats'
import { SubmitButton } from './components/SubmitButton'

function App() {

  return (
    <div className='container'>
      <Header />
      <Stats />
      <SleepForm />
      <SubmitButton />
      <HistoryLogs />
    </div>
  )
}

export default App
