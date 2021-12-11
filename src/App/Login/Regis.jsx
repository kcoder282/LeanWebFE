import axios from 'axios';
import React, { useState } from 'react'
import { host, imgurl } from '../../Static';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Regis({setUser}) {
    const [dataUser, setDataUser] = useState({
        id:-1,
        name:"",
        avata:null,
        birth:'',
        sex: true,
        password:'',
        email:""

    });
    const [error, setError] = useState("");
    const [errorP, setErrorP] = useState("");
    const [confirmpass, setConfirmpass] = useState("");
    const [check, setCheck] = useState(false);
    const navi = useNavigate();
    const changeImg = (e)=>{
        if(e.files.length===1)
        {
            let file = new FileReader();
            file.readAsDataURL(e.files[0]);
            file.onload=()=>{
                dataUser.avata = file.result;
                setDataUser({ ...dataUser });
            }
        }
    }
    const saveData=()=>{
        setCheck(true);
        console.log(dataUser);
        if(error===""&&errorP==="")
        {
            if(confirmpass.length>0)
            {

                axios.post(host+"regis", dataUser)
                .then((result) => {
                    if (result.data.result===1)
                    {
                        toast.error("Trùng user name yêu cầu nhap lại");
                        dataUser.username="";
                        setDataUser({...dataUser});
                        setCheck(false);
                    }
                    else if(result.data.result === 0)
                    {
                      toast.error("Trùng gmail yêu cầu nhập lại");
                      dataUser.email = "";
                      setDataUser({ ...dataUser });
                      setCheck(false);
                    }
                    else{
                        setUser(result.data.result);
                        navi("/");
                        toast.success("Đăng ký Thành Công");
                    }
                })
            }else toast.error("bạn chưa nhập password confirm");
        }
    }

    return (
       <div className="container mt-4">
           <h1 className="text-center text-uppercase">Đăng ký tài khoản</h1>
           <hr />
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
                    <h3>Thông tin đăng nhập</h3>
                    <div className="form-control">
                        <div>
                            <label htmlFor="name"><b>User name</b></label>
                            <input id="name" className="form-control w-100 py-2" 
                            placeholder="Enter your name..." value={dataUser.username} 
                            onInput={(e)=>{
                                dataUser.username = e.currentTarget.value;
                                setDataUser({...dataUser});
                            }}/>
                            {!/^[A-Za-z\d_]{4,20}$/.test(dataUser.username)&&check?
                            <small className="text-danger">Tên đăng nhập phải là chữ hoặc số ko chứa kí tự đặc biệt trù "_" đồ dài từ 4 đến 20</small>:''
                            }
                        </div>
                        <div>
                            <label htmlFor="pass"><b>Mật khẩu</b></label>
                            <input type="password" id="pass" className="form-control w-100 my-2" 
                            placeholder="Enter new password" value={dataUser.password} onFocus={()=>setErrorP("")}
                            onBlur={()=>{
                                if((!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(dataUser.password))&&dataUser.password!=="")
                                {
                                    setErrorP("Tối thiểu tám ký tự, ít nhất một chữ cái và một số, không chứa kí tự đặc biệt");
                                }
                            }} onInput={(e)=>{dataUser.password = e.currentTarget.value; setDataUser({...dataUser})}}/>
                            <small className={(errorP.length>0?"text-danger":"d-none")}>{errorP}</small>
                        </div>
                        <div>
                            <label htmlFor="passNew"><b>Xác nhận mật khẩu</b></label>
                            <input type="password" id="passNew" className="form-control w-100 my-2"
                            placeholder="Enter confirm new password" value={confirmpass} onFocus={()=>setError("")} 
                            onInput={(e)=>setConfirmpass(e.currentTarget.value)} onBlur={()=>{
                                if(dataUser.password!==confirmpass)
                                {
                                    setError("Mật khẩu xác nhận không đúng");
                                }
                            }}/>
                            <small className={(error.length>0?"text-danger":"d-none")}>{error}</small>
                        </div>
                    </div>
                    <h2>Thông tin cá nhân</h2>
                    <div className="form-control">
                        <div>
                            <label htmlFor="name"><b>Họ và tên:</b></label>
                            <input id="name" className="form-control w-100 py-2" 
                            placeholder="Enter your name..." value={dataUser.name} 
                            onInput={(e)=>{
                                dataUser.name = e.currentTarget.value;
                                setDataUser({...dataUser});
                            }}/>
                            {dataUser.name.length===0&&check?
                            <small className="text-danger">Tên không được để rỗng</small>:
                            dataUser.name.length>50&&check?
                            <small className="text-danger">Tên quá dài vượt ({dataUser.name.length-50})</small>:''
                            }
                        </div>

                        <div>
                            <label htmlFor="birth"><b>Ngày sinh :</b></label>
                            <input type="date" id="birth" className="form-control w-100 my-2" 
                            value={dataUser.birth}
                            onInput={(e)=>{
                                dataUser.birth = e.currentTarget.value;
                                setDataUser({...dataUser});
                            }}/>
                        </div>

                        <div>
                            <label htmlFor="Email"><b>Email :</b></label>
                            <input type="email" id="Email" className="form-control w-100 my-2" 
                            placeholder="Enter your email..." value={dataUser.email}
                            onInput={(e)=>{
                                dataUser.email = e.currentTarget.value;
                                setDataUser({...dataUser});
                            }}/>
                        </div>
                        <div>
                            <div className="d-inline mr-2"><b>Giới tính :</b></div> 
                            <span onClick={()=>{
                                dataUser.sex = !dataUser.sex;
                                setDataUser({ ...dataUser });
                            }} className={"checkbox mr-2"+(dataUser.sex?" checked":"")}></span>
                            <span>{dataUser.sex?"Nam":"Nữ"}</span>
                        </div>
                    </div>
                    <div className="mt-5 text-right mb-5 pb-5 pb-sm-0">
                        <button onClick={saveData} className="btn btn-primary">
                            <i className="fi fi-rr-key"/>Đăng ký tài khoản
                        </button>
                    </div>
                </div>     
            </div>
        </div>
    )
}
