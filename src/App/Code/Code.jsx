import React, { useEffect, useState } from 'react'
import { UnControlled as CodeMirror } from "react-codemirror2";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/clike/clike.js'
import './code.css';
import axios from 'axios';
import { host, key } from './../../Static';

export default function Code({user}) {
    const [file, setFile] = useState([]);
    const [content, setContent] = useState({});
    const [data, setData] = useState({});
    const [load, setLoad] = useState(false);
    const [output, setOutput] = useState("");
    const newFile=()=>
    {
        let name = (document.getElementById("name-file-new").value+"").replaceAll(" ", "_");
        axios
          .post(host + "files?key=" + key(), {
            name: name +(name.includes(".")?"":".cpp"),
            code: "",
          })
          .then((result) => {
            setFile(result.data);
            document.getElementById("name-file-new").value="";
          });
    }
    const deleteFile = (id)=>{
        axios
        .delete(host + "files/" + id)
        .then(() => {
            setFile(file.filter((item)=>item.id!== id));
        });
    }
    const loadFile = (id)=>{
        axios.get(host+"files/"+id).then((rs)=>{
            setContent({ id: id, ...rs.data });
        })
    }
    const RunCode = ()=>{
        setLoad(true);
        if(content.id===undefined)
        {
            axios
              .post(host + "testCodeRun", {
                code: data[2],
                input: document.getElementById("input-data").value,
              })
              .then((result) => {
                setOutput(result.data);
              })
              .finally(() => setLoad(false)); 
        }else{
            axios.put(host + "files/" + content.id, {
              code: data[2],
              input: document.getElementById("input-data").value,
            }).then((result) => {
              setOutput(result.data)
            }).finally(()=>setLoad(false))        
        }
    }
    const EditName = (id, name, index)=>{
        axios.put(host + "files/" + id, {
            name: name 
        }).then((e)=>{
            file[index].name= name;
            if(content.id===id)
            {
                content.name = name;
                setContent({...content})
            }
            
            setFile([...file]);
        })
    }
    useEffect(()=>{
        axios.get(host+"files?key="+key())
        .then((result) => {
            setFile(result.data);
        })
        return ()=>setFile([])
    },[])
    return (
        <div className='container-fluid' style={{height:'calc(100vh - 59.5px)'}}>
            <div className="row h-100 align-items-stretch">
                {user.id===undefined?"":
                <div className="col-sm-3 p-0" style={{minHeight:'10rem', background:'#ddd', overflow:'auto'}}>
                    <div className="d-flex p-1">
                        <input id="name-file-new" type="text" className="form-control w-100" placeholder='Enter new file name...'/>
                        <div onClick={newFile} className="btn btn-primary ml-1"> <i className="fi fi-rr-plus"></i> </div>
                    </div>
                    {file.map((item,index)=>
                    <div key={index} className={'data-item m-1 d-flex'+(content.id===item.id?" active":"")}>
                       <span title={item.name} onDoubleClick={(e)=>{
                           e.currentTarget.contentEditable = true;
                       }} onBlur={(e)=>{
                           e.currentTarget.contentEditable = false;
                           EditName(item.id, e.currentTarget.innerText, index);
                       }} onKeyDown={(e)=>{
                           if (e.code==="Enter"){
                                e.preventDefault();
                                e.currentTarget.contentEditable = false;
                                let name = e.currentTarget.innerText.replaceAll(" ", "_") + 
                                (e.currentTarget.innerText.includes(".")?"":".cpp")
                                EditName(item.id, name, index);
                                e.currentTarget.innerText=name;

                           }
                       }} style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}
                       onClick={()=>loadFile(item.id)} className='flex-fill px-1 mr-1'>{item.name}</span>
                       <i onClick={()=>deleteFile(item.id)} className="fi fi-rr-cross-circle text-danger"></i>
                    </div>
                    )}
                </div>}
                <div className="flex-fill d-flex flex-column p-0">
                   <div className={user.id===undefined?"d-none":"my-1"}>
                        <strong><i className="fi fi-rr-file"></i> Name file:</strong> {content.name}
                   </div>
                   <CodeMirror
                    className=''
                    value={content.code}
                    options={{
                        mode: "text/x-csrc",
                        theme: "material",
                        lineNumbers: true,
                    }}
                    onChange={(...data) => {
                        setData(data);
                    }}
                    />
                    <div className="d-flex my-1 mx-2">
                        <input id="input-data" type="text" className='flex-fill form-control' placeholder='Input Data...' />
                        <div onClick={RunCode} className="btn btn-primary ml-1" >
                           {load?
                           <span className="load"><i className="fi fi-rr-spinner"></i></span>
                           :<i className="fi fi-sr-play"></i>} Run
                        </div>
                    </div>
                    <pre className="flex-fill p-3 my-0" style={{background:'#263238', color:'#C3E88D', minHeight:'10rem', overflow:'auto'}}>{output}</pre>
                </div>
            </div>
        </div>
    );
}
