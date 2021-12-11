import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { host, imgurl, key } from '../../Static';
import './login.css';

export default function Login({user, setLogin}) {
    const navi = useNavigate();
    const [dataUser, setdataUser] = useState(user);
    const [pass, setPass] = useState("");
    const [confirmpass, setconfirmpass] = useState("");
    const [error, setError] = useState("")
    const [errorP, setErrorP] = useState("");
    const [load, setLoad] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const changeImg = (e)=>{
        if(e.files.length===1)
        {
            let file = new FileReader();
            file.readAsDataURL(e.files[0]);
            file.onload=()=>{
                dataUser.avata = file.result;
                setdataUser({...dataUser});
            }
        }
    }
    const saveData =()=>{
        if(pass!==confirmpass)
        setError("Mật khẩu xác nhận không đúng");
        if(errorP===""&& error==="")
        {
            setLoad(true);
            dataUser.password = pass;
            axios.put(host+'auth?key='+key(),dataUser)
            .then((result) => {
               setLogin(result.data); 
            }).finally(()=>setLoad(false));
        }
    }
    const LoginData = (e)=>{
        e.preventDefault();
        setLoad(true);
        axios.post(host+"auth",{
            username: username,
            password: password
        })
        .then((result) => {
            if(result.data.id===-1)
                setError(result.data.messen);
            else
            {
                setLogin(result.data);
                navi("/");
            }
        }).catch((err) => {
            setError(""+err);
            setPassword(false);
        }).finally(()=>setLoad(false))
    }
    return dataUser.id===undefined?
    <div className="container mt-4">
        <div className="row justify-content-center">
            <div className="col-12 col-sm-7 col-md-6 col-lg-4 mt-3">
                <h1 className='mb-2 mx-3 text-center text-uppercase'>Login Web</h1>
                <form onSubmit={LoginData} className='shadow bg-white p-3 position-relative' style={{borderRadius:'.5rem'}}>
                    <div className="text-danger text-center" dangerouslySetInnerHTML={{__html:error}}/>
                    <div className="d-flex align-items-center position-relative">
                        <i className="position-absolute fi fi-rr-user ml-2"></i> 
                        <input value={username} onInput={(e)=>setUsername(e.currentTarget.value)} onClick={()=>setError("")} 
                        id="username_login" type="text" className=' form-control flex-fill' placeholder='user name...' style={{paddingLeft:'1.75rem'}} />
                    </div>
                    <div className="d-flex align-items-center mt-3 position-relative">
                        <i className="position-absolute fi fi-rr-key ml-2"></i> 
                        <input value={password} onInput={(e)=>setPassword(e.currentTarget.value)} onClick={()=>setError("")} 
                        id="password_login" type="password" className=' form-control flex-fill' placeholder='Password...' style={{paddingLeft:'1.75rem'}} />
                    </div>
                    <div className='px-3'>
                        <button type="submit" className='w-100 btn-login mt-4 py-2 fs-6 text-uppercase'>
                            <i className="fi fi-rr-sign-in-alt mr-2"></i><strong>Đăng nhập</strong>
                        </button>
                    </div>
                    <div className='text-right mx-3'>
                        <a className='text-primary ' href="/forgot_password" target="_blank">Quên mật khẩu.</a>
                    </div>
                    <div className='text-center mt-4'>
                        Nếu chưa có tài khoản? <Link to="/regis" className='btn-a text-primary' >Đăng ký</Link>
                    </div>
                </form>
            </div>
        </div>
    </div>:
    (
        <div className="container mt-4">
            <div className="row align-items-stretch">
                <div className="col-12 col-sm-5 col-md-4 col-lg-3">
                    <div className="shadow rounded-pill mx-auto"
                    style={{width:"80%", paddingTop:'80%',backgroundImage:`url(${imgurl(dataUser.avata)})`,
                    backgroundPosition:'center center', backgroundSize:'cover'}}>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="fs-5">{dataUser.username} </div>
                        <div className="shadow d-inline-block px-2 rounded ml-1" 
                        style={{background:dataUser.type===1?"#ffae00":"#eee"}}>
                            {dataUser.type===1?"ADMIN":"NOMAL"}
                        </div>
                    </div>
                    <label htmlFor="img" className="btn btn-primary d-block mt-2">
                        <input onChange={(e)=>changeImg(e.currentTarget)} type="file" id="img" hidden accept="image/*" />
                        <i className="fi fi-rr-upload mr-2"></i>
                        <span>Tải ảnh đại diện</span>
                    </label>
                </div>
                <div className="col-12 col-sm-7 col-md-8 col-lg-9">
                    <h2>Thông tin cá nhân</h2>
                    <div className="form-control">
                        <div>
                            <label htmlFor="name"><b>Họ và tên:</b></label>
                            <input id="name" className="form-control w-100 py-2" 
                            placeholder="Enter your name..." value={dataUser.name} 
                            onInput={(e)=>{
                                dataUser.name = e.currentTarget.value;
                                setdataUser({...dataUser});
                            }}/>
                            {dataUser.name.length===0?
                            <small className="text-danger">Tên không được để rỗng</small>:
                            dataUser.name.length>200?
                            <small className="text-danger">Tên quá dài vượt ({dataUser.name.length-200})</small>:''
                            }
                        </div>

                        <div>
                            <label htmlFor="birth"><b>Ngày sinh :</b></label>
                            <input type="date" id="birth" className="form-control w-100 my-2" 
                            value={dataUser.birth}
                            onInput={(e)=>{
                                dataUser.birth = e.currentTarget.value;
                                setdataUser({...dataUser});
                            }}/>
                        </div>

                        <div>
                            <label htmlFor="Email"><b>Email :</b></label>
                            <input type="email" id="Email" className="form-control w-100 my-2" 
                            placeholder="Enter your email..." value={dataUser.email}
                            onInput={(e)=>{
                                dataUser.email = e.currentTarget.value;
                                setdataUser({...dataUser});
                            }}/>
                        </div>
                        <div>
                            <div className="d-inline mr-2"><b>Giới tính :</b></div> 
                            <span onClick={()=>{
                                dataUser.sex = !dataUser.sex;
                                setdataUser({ ...dataUser });
                            }} className={"checkbox mr-2"+(dataUser.sex?" checked":"")}></span>
                            <span>{dataUser.sex?"Nam":"Nữ"}</span>
                        </div>
                    </div>
                    <h3>Thay đổi mật khẩu</h3>
                    <div className="form-control">
                        <div>
                            <label htmlFor="pass"><b>Mật khẩu</b></label>
                            <input type="password" id="pass" className="form-control w-100 my-2" 
                            placeholder="Enter new password" value={pass} onFocus={()=>setErrorP("")}
                            onBlur={()=>{
                                if((!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pass))&&pass!=="")
                                {
                                    setErrorP("Tối thiểu tám ký tự, ít nhất một chữ cái và một số, không chứa kí tự đặc biệt");
                                }
                            }} onInput={(e)=>setPass(e.currentTarget.value)}/>
                            <small className={(errorP.length>0?"text-danger":"d-none")}>{errorP}</small>
                        </div>
                        <div>
                            <label htmlFor="passNew"><b>Xác nhận mật khẩu</b></label>
                            <input type="password" id="passNew" className="form-control w-100 my-2"
                            placeholder="Enter confirm new password" value={confirmpass} onFocus={()=>setError("")} 
                            onInput={(e)=>setconfirmpass(e.currentTarget.value)} onBlur={()=>{
                                if(pass!==confirmpass)
                                {
                                    setError("Mật khẩu xác nhận không đúng");
                                }
                            }}/>
                            <small className={(error.length>0?"text-danger":"d-none")}>{error}</small>
                        </div>
                    </div>
                    <div className="mt-5 text-right mb-5 pb-5 pb-sm-0">
                        <button onClick={saveData} className="btn btn-primary">
                            {load? <span className="load"><i className='fi fi-rr-spinner'/></span>:<i className="fi fi-rr-disk"/> } Lưu Thay đổi
                        </button>
                    </div>
                </div>     
            </div>
        </div>
    )
}
