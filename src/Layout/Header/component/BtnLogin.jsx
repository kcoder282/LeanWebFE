import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imgurl, setKey } from '../../../Static';
import './login.css';
import { key, host } from './../../../Static';

export default function BtnLogin({user, setUser}) {
  const [name, setName] = useState("");
  const [menu, setMenu] = useState(false);

  const navi = useNavigate()
  useEffect(() => {
    let data = user.name ?? "";
    data = data.split(" ");
    setName(data[data.length - 1]);
  }, [user]);

    const logout = () =>{
      axios.delete(host+'auth?key='+key());
      setKey("");
      setUser({});
      setMenu(false)
    }
    const login=()=>{
        if(user.id===undefined)
        navi("/login");
        else
        setMenu(!menu);
    }
    return (
      <div className="col-sm-3 text-right order-1 col-5 order-sm-2 position-relative">
        <div onClick={login} className="btn btn-primary rounded-pill">
          {user.id === undefined ? (
            <>
              <i className="fi fi-rr-key" /> login
            </>
          ) : (
            <>
              <img className='rounded-pill' src={imgurl(user.avata)} alt="" style={{width:'1rem', height:'1rem', background:'#fff'}} /> Hi {name}
            </>
          )}
        </div>
        {user.id!==undefined?
        <div className={(menu?"d-flex":"d-none")+" flex-column position-absolute bg-white shadow rounded"}
        style={{top:'calc(100%)', right:'2rem', overflow:'hidden', textAlign:'left', zIndex:2048}}> 
          <div onClick={()=>{navi("/login");setMenu(false)}} className="px-3 py-2 hover"><i className='fi fi-rr-settings'></i> Sửa thông tin</div>
          {user.type===1?<div onClick={()=>{navi("/users");setMenu(false)}} className="px-3 py-2 hover"><i className='fi fi-rr-list'></i> Danh sách User</div>:""}
          <div onClick={()=>{logout();navi("/login");setMenu(false)}} className="px-3 py-2 text-danger hover"><i className='fi fi-rr-sign-out-alt'></i> Đăng xuất</div>
        </div>:''}
      </div>
    );
}
