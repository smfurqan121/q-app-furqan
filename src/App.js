import './App.css';
import Navbar from './component/Navbar';
import Router from './config/Router'
import store from './store'
import { Provider } from 'react-redux'
import Header from './component/header'


function App() {
  return (
    <>
    <div className="App-header">
      <Navbar />

      <Router />
    </div>
    {/* <Provider store={store} >
    <div className="App">
      <header className="App-header">
        <Header />
        <Router />
      </header>
    </div>
  </Provider> */}
  </>
    
  );
}

export default App;
