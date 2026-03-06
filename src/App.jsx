import './App.css'
import { Header } from './components/Header'
import { HistoryLogs } from './components/HistoryLogs'
import { SleepForm } from './components/SleepForm'
import { Stats } from './components/Stats'
import LoginPage from './pages/LoginPage'

function App() {

  return (
    <div className='container'>
      <Header />
      <Stats />
      <SleepForm />
      <HistoryLogs />
    </div>
    // <LoginPage />
  )
}

export default App
