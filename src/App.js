import './App.css';
import Content from './components/Content'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={'./Unity_2021.svg'} className="App-logo" alt="logo" />
      </header>
      {<Content />}
    </div>
  );
}

export default App;
