import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Content from '../Layout/Content/Content';
import Header from '../Layout/Header/Header';
import Menu from '../Layout/Menu/Menu';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column" style={{ height: "100vh" }}>
        <Header />
        <div className="d-flex flex-fill flex-column flex-sm-row">
          <Menu />
          <Content />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
