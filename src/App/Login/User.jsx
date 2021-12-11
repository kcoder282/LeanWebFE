import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { host, imgurl, key } from '../../Static';
import './user.css';
import Modal from './../Component/Modal';
import { toast } from 'react-toastify';

export default function User({id_user}) {
    const [user, setUser] = useState([]);
    const [load, setLoad] = useState(-1);
    const [load1, setLoad1] = useState(-1);
    const [modal, setModal] = useState(false)
    useEffect(() => {
        axios.get(host+"user?key="+key())
        .then((result) => {
            setUser(result.data)
        })
        return ()=>setUser([]);
    }, [])

    const BlockData = (id, index)=>{
        setLoad(index);
        axios.get(host+`user/${id}?key=${key()}`)
        .then((result) => {
            if(result.data.type !== 0)
            {
                user[index].type = result.data.type; 
                setUser([...user]);
            }
        }).finally(()=>setLoad(-1));
    }
    const admin_change = (id, index) => {
      setLoad1(index);
      axios
        .put(host + `user/${id}?key=${key()}`)
        .then((result) => {      
          if (result.data.type !== 0) {
            user[index].type = result.data.type;
            setUser([...user]);
          }
        })
        .finally(() => setLoad1(-1));
    };
    const deleteUser = ()=>{
        setLoad(true);
        axios.delete(host+"user/"+modal+"?key="+key())
        .then((result) => {
            setUser(result.data);
            setModal(false);
            toast.success("Xóa tài khoản thành công")
        }).catch((err)=>toast.error(""+err)).finally(()=>setLoad(-1));
    }
    return (
        <div className='mb-5 mb-sm-0 pb-3' style={{maxWidth:'100vw', overflowX: 'auto'}}>
            {modal!==false?
            <Modal>
                <div>Ban thật sự muốn xóa tài khoản này</div>
                <div className="d-flex justify-content-around mt-3">
                    <div onClick={deleteUser} className="btn btn-danger">
                        {load===true? <span className="load"><i className="fi fi-rr-spinner"></i></span> : <i className="fi fi-rr-trash"></i>} Xóa
                    </div>
                    <div onClick={()=>setModal(false)} className="btn btn-primary">Hủy</div>
                </div>
            </Modal>:""}
            <div className='container mt-3'>
                <table className='w-100' style={{borderCollapse: 'collapse'}}>
                    <thead>
                        <tr className='bg-primary text-white'>
                            <th>#</th>
                            <th>User name</th>
                            <th>Email</th>
                            <th>Sex</th>
                            <th>Birth</th>
                            <th>Block</th>
                            <th>Admin</th>
                            <th>Del</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.map((item, index)=>
                            <tr key={index} className='animate__animated animate__fadeInUp animate__faster' style={{animationDelay:(index*50)+'ms'}}>
                                <td>{index+1}</td>
                                <td>
                                    <div>
                                        <img style={{width:'1rem', height:'1rem', borderRadius:'50%', transform:'scale(2.25) translateX(-.25rem)'}} src={imgurl(item.avata)} alt="" />
                                        <span className='mx-1'>{item.username}</span>
                                        <span className={item.type?" text-admin":'d-none'}>{item.type===1?"ad":""}</span>
                                    </div>
                                </td>
                                <td>{item.email}</td>
                                <td>{item.sex?"Nam":"Nữ"}</td>
                                <td>{item.birth}</td>
                                <td>
                                    <div className='d-flex'>
                                        {load===index?<span className="load"><i className="fi fi-rr-spinner"/></span>:<i className='fi fi-sr-key' style={{color:'#0000'}}/>} 
                                    <div onClick={()=>item.type===1?"":BlockData(item.id, index)} className={"ml-1 checkbox"+(item.type===5?" checked":item.type===1?" disable":"")}/></div>
                                </td>
                                <td>
                                    <div className='d-flex'>{load1===index?<span className="load"><i className="fi fi-rr-spinner"/></span>:<i className='fi fi-sr-key' style={{color:'gold'}}/>} 
                                    <div onClick={()=>item.id===id_user?"":admin_change(item.id, index)} className={"ml-1 checkbox"+(item.id===id_user?" checked disable":item.type===1?" checked":"")}/></div>
                                </td>
                                <td>
                                    <div onClick={()=>item.type===1?"":setModal(item.id)} className={"btn btn-danger"+(item.type===1?" disable":"")}>
                                        <i className="fi fi-rr-trash"></i>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>  
            </div>
        </div>
    )
}
