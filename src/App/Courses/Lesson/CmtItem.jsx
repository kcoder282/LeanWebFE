import icon from '../../../Icon/svg/fi-rr-user.svg';
import "./cmt.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { host, key } from './../../../Static';

export default function CmtItem({setcmt, index, setlist, list, value ,user ,id_lesson, admin, type='lesson'}) {
    const [data, setData] = useState({})
    const [cmtMenu, setCmtMenu] = useState(false);
    const [edit, setEdit] = useState(false);
    const [position, setPosition] = useState([0, 0]);
    const [cmtcontent, setCmtcontent] = useState("");
    const [load, setLoad] = useState(false);

    useEffect(() => {
      setCmtcontent(value.content);
      setData(value);
    }, [value]);

    const deleteCmt = () =>{
        setCmtMenu(false);
        axios.delete(`${host}cmt/${data.id}?key=${key()}&type=${type}&id_lesson=${id_lesson}`)
        .then((result) => {
            if(index===undefined)
            {
                setlist(result.data);
            }else{
                list[index].cmt = result.data[index].cmt 
                setlist([...list])
            }   
                   
        }).catch((err) => {});
    }
    const contextmenu = (e)=>{
        e.preventDefault();
        let pos = e.currentTarget.getBoundingClientRect();
        setCmtMenu(true);
        setPosition([e.clientX - pos.x, e.clientY - pos.y]);
    }
    const leave = (e) =>{
        setCmtMenu(false);
    }
    const change = (e) =>{
        setCmtcontent(e.target.value)
    }
    const send = () =>{
        setLoad(true);
        axios
        .post(`${host}cmt?key=${key()}`, {
        id: data.id,
        id_cmt: data.id_cmt,
        content: cmtcontent,
        id_lesson: id_lesson,
        type: type,
        })
        .then((result) => {  
            result.data.forEach(e=>{
                if(e.id === data.id)
                {
                    setData(e);
                }else{
                    e.cmt.forEach((item=>{
                        if(item.id === data.id)
                        setData(item);
                    }))
                }
            })
        })
        .finally(() => setLoad(false));
        setEdit(false);
    }
    const keyDown = (e)=>{
        if(e.key === 'Enter')
        {
            send();
        }else if (e.key === "Escape") {
           setEdit(false);
           setCmtcontent(data.content);
        }
    }
    return data.id===undefined?'':(    
        <div className="d-flex align-items-start my-2" >

           <img className="mr-1" src={data.user.avata??icon} alt="" 
           style={{width:'2rem', height:'2rem', borderRadius:'50%'}}/> 
           
           <div onMouseLeave={leave} onContextMenu={contextmenu} className="p-2 d-flex flex-column position-relative" 
           style={{flex:1, border: '1px solid #5551', borderRadius: '.5rem', boxShadow:'.25rem .25rem .5rem #0001'}}>
                <small className="text-primary">{data.user.name}</small>
                <div className="d-flex">
                    <input onBlur={()=>{setEdit(false); setCmtcontent(data.content);}} disabled={!edit} onKeyDown={keyDown} onInput={change}
                    className="flex-fill p-2" 
                    style={{outline: edit?'1px solid #0002':'none', fontSize:'1rem', border:'none', background: '#0000',borderRadius:'.25rem'}} 
                    value={cmtcontent}/>
                    {load? <span className="load mr-1"><i className="fi fi-rr-spinner"/></span>:''}
                </div>

                {user.id===data.user.id||admin?<div hidden={!cmtMenu} className="cmt position-absolute" style={{top: position[1], left: position[0]}}>
                    <div onClick={deleteCmt} className="text-danger">Xóa</div>
                    <div onClick={()=>{setEdit(true);setCmtMenu(false)}}>Sửa</div>
                </div>:''}
           </div>
        </div>
    )
}
