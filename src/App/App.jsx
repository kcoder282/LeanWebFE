import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Content from '../Layout/Content/Content';
import Header from '../Layout/Header/Header';
import Menu from '../Layout/Menu/Menu';
import { Route } from 'react-router-dom';
import Load from './../Error/Load';
import Courses from './Courses/Courses';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="d-flex flex-column-reverse flex-sm-row">
        <Menu />
        <Content>
          <Route path="/" element={<Load />} />
          <Route path="/Courses" element={<Courses />} />
        </Content>
      </div>
    </BrowserRouter>
  );
}

export default App;
