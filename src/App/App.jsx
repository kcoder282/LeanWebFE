import './App.css';
import Header from './Layout/Header/Header';
import Menu from './Layout/Menu/Menu';

function App() {
  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <Header />
      <div className="d-flex flex-fill flex-column flex-sm-row">
        <Menu/>
        <div className="content flex-fill order-0 order-sm-1"></div>
      </div>
    </div>
  );
}

export default App;
