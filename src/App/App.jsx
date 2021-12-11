import { BrowserRouter, Route } from "react-router-dom";
import './App.css';
import Content from '../Layout/Content/Content';
import Header from '../Layout/Header/Header';
import Menu from '../Layout/Menu/Menu';
import Load from './../Error/Load';
import Courses from './Courses/Courses';
import Error404 from './../Error/Error404';
import CourseDetail from './Courses/CourseDetail';
import { useEffect, useState } from 'react';
import BlogList from './Blogs/BlogList';
import BlogAction from './Blogs/BlogAction';
import Topics from './Topics/Topics';
import Login from './Login/Login';
import User from './Login/User';
import { setKey, key, host } from "../Static";
import axios from "axios";
import Regis from "./Login/Regis";
import Home from "./Component/Home";
import Code from "./Code/Code";

function App() {
  const [user, setUser] = useState({});
  const [loadData, setLoadData] = useState(false);

  useEffect(()=>{
    let rememberkey = key();
    if(rememberkey !== "")
    {
        setLoadData(true);
        axios
        .get(host + "auth?key=" + rememberkey)
        .then((result) => {
          if (result.data.id!==0)
          {
            setUser(result.data);
          }
        })
        .finally(()=>setLoadData(false));
    }
  },[])
  const setUserAndKey = (data)=>{
    setUser(data);
    setKey(data.key, 3600);
  }

  return (
    <BrowserRouter>
      <Header user={user} setUser={setUser}/>
      <div className="d-flex flex-column-reverse flex-sm-row">
        <Menu/>
          {loadData?<Load/>:<Content>
            <Route path="/" element={<Home user={user}/>}/>
            <Route path="/Courses/" element={<Courses user={user}/>}/>
            <Route path="/Courses/:name/:id" element={<CourseDetail user={user} />}/>
            <Route path="/topics" element={<Topics user={user}/>}/>
            <Route path="/blogs" element={<BlogList user={user}/>}/>
            <Route path="/blogs/:name/:id" element={<BlogAction user={user} />}/>
            <Route path="/login" element={<Login user={user} setLogin={setUserAndKey}/>}/>
            <Route path="/users" element={<User id_user={user.id}/>}/>
            <Route path="/regis" element={<Regis setUser={setUser}/>}/>
            <Route path="/codes" element={<Code user={user}/>}/>
            <Route path=":all" element={<Error404 />}/>
          </Content>}
      </div>
    </BrowserRouter>
  );
}

export default App;
