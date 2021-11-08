import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { key, host } from "../../../Static";
import { toast } from 'react-toastify';
import { useState } from 'react';
import Load from './../../../Error/Load';

export default function LessonDetail({id}) {
    const [load , setLoad ] = useState(true);
    const [lesson, setLesson] = useState({});
    useEffect(()=>{

        if(id!==-1)
        axios.get(host+`lessons/${id}?key=`+key())
        .then((result) => {
            setLesson(result.data);
            setLoad(false);
        }).catch((err) => {
            toast.error(""+err);
            setLoad(false);
        })
    },[id])
    return load ? (
      <Load />
    ) : (
      <>
        <div className="row">
          <h2 className="text-uppercase text-center col">{lesson.name}</h2>
        </div>
       
      </>
    );
}
