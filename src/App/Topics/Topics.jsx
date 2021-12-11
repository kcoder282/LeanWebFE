import axios from 'axios';
import React, { useEffect } from 'react'
import { host, key } from '../../Static';
import Topic from './Topic'
import { useState } from 'react';

export default function Topics({user}) {
    const [courses, setCourses] = useState([]);
    const [select_id, setSelect] = useState("*");
    useEffect(() => {
        axios
        .get(host + "courses?key=" + key())
        .then((result) => {
            setCourses(result.data);
        })
        .catch();
    }, [])
    const changeData = (e)=>{
        setSelect(e.target.value);
    }
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="d-none d-md-block col-md-2 col-lg-2"></div>
          <div className="col-12 col-sm-9 col-md-8 col-lg-7">
            <div className="mt-4 d-block d-md-none">
              <select onChange={changeData} className="w-100 form-control">
                {courses.map((e, i) => (
                  <option value={e.id} key={i}>
                    {e.name} ({e.key})
                  </option>
                ))}
                <option value="*">Tất cả</option>
              </select>
            </div>
            <Topic user={user} courses={courses} select_course={select_id} show={false}/>
          </div>
          <div className="d-none d-md-block col-md-2 col-lg-3" style={{position:'sticky', height:'100vh', top:0}}>
             <h3>Chủ đề theo khóa học</h3>
              <div onClick={()=>setSelect("*")} title="Tất cả chủ đề"  className={("*"===select_id?"active ":"")+"topic shadow m-2 py-2 px-3 rounded"} style={{cursor:'pointer'}}>
                Tất cả
              </div>
             {courses.map((e,i)=>
                <div onClick={()=>setSelect(e.id)} title={e.name + "("+e.key+")"} key={i}  className={(e.id===select_id?"active ":"")+"topic shadow m-2 py-2 px-3 rounded"} style={{cursor:'pointer'}}>
                    <b className="d-inline-block px-2 rounded ml-1"
                    style={{color: "#fff",background:"linear-gradient(45deg, " + e.color + ")"}}>
                        {e.key}
                    </b> <small>{e.name}</small> 
                </div>
             )}
            
          </div>
        </div>
      </div>
    );
}
