import './App.css'
import MetaMask from './wallet/MetaMask'
import UniSat from './wallet/UniSat'


const App = () => {

  return (
    <div className="App">
      <MetaMask/>
      <UniSat/>
    </div>
  )
}

export default App