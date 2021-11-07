import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Content from '../Layout/Content/Content';
import Header from '../Layout/Header/Header';
import Menu from '../Layout/Menu/Menu';
import { Route } from 'react-router-dom';
import Load from './../Error/Load';
import Courses from './Courses/Courses';
import Error404 from './../Error/Error404';
import CourseDetail from './Courses/CourseDetail';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { host, key, setKey } from '../Static';
import { toast } from 'react-toastify';

function App() {
  const [user, setUser] = useState({});
  useEffect(()=>{
    // axios.post(host+"auth",{
    //   username:"admin",
    //   password: "123456"
    // })
    // .then((result) => {
    //     console.log(result);
    // }).catch((err) => {
    //   toast.error(""+err);
    // });
    setKey("c3c52c2322e0c5ae929bb00f0b8d744d",1800);
    axios.get(host+"auth?key="+key())
    .then((result) => {
      setUser(user);
    }).catch((err) => {
       toast.error("" + err);
    });
  },[])
  return (
    <BrowserRouter>
      <Header />
      <div className="d-flex flex-column-reverse flex-sm-row">
        <Menu />
        <Content>
          <Route path="/" element={<Load />} />
          <Route path="/Courses/" element={<Courses user={user} />} />
          <Route path="/Courses/:id/:name" element={<CourseDetail user={user} />} />
          <Route path=":all" element={<Error404 />} />
        </Content>
      </div>
    </BrowserRouter>
  );
}

export default App;
