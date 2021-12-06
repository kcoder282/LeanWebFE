import "./ImgView.css";
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import img from "../../Icon/svg/fi-rr-picture.svg"
export default function ImgView({ setListImg, listImg, edit, ratio = '60%' }) {
  const time = useRef();
  const [select, setSelect] = useState(0);

  useEffect(() => {
   time.current = setInterval(() => {
     if (!edit)
       setSelect((data) => {
         if (data + 1 >= listImg.length) {
           return 0;
         } else return data + 1;
       });
   }, 5000);

   return () => {
     clearInterval(time.current);
   };
  }, [edit, listImg.length, select]);

  useEffect(() => {
    setSelect(listImg.length - 1);
  }, [listImg.length]);

    const DeleteImg = (index) =>{
        let list = [];
        listImg.forEach((e,i)=>{if(i!==index)list.push(e)});
        console.log(list);
        setListImg(list);
    }

  return (
    <div className="imgViewData">
      <div className="view position-relative"
        style={{ transform: `translateX(-${select * 100}%)` }}>

        {listImg.length>0?listImg.map((e,i)=>
            <div key={i} style={{ backgroundImage: 'url('+e+')', 
            top: 0, left: (i*100)+"%", paddingTop:ratio }}
              className="imgitem">
                {edit?<i onClick={()=>DeleteImg(i)} className="fi fi-sr-cross-circle"/>:''}
            </div>
        ):
          <div style={{
          top: 0, left: 0, paddingTop:ratio }}
            className="imgitem img-tmp">
              <img style={{position:"absolute", top:'50%', left:'50%', height:'25%'}}
              src={img} alt="" />
          </div>
        }

      </div>
      {listImg.length>1?
      <>
      <div className="btn-img d-flex align-items-center justify-content-center position-absolute">
        {listImg.map((e, i) => (
          <div
            onClick={() => setSelect(i)}
            key={i}
            className={"item-img " + (i === select ? "active" : "")}
          />
        ))}
      </div>
      <i onClick={()=>{
          select===0?setSelect(listImg.length-1):setSelect(select - 1)
        }
        } className="btn-left fi fi-sr-angle-left position-absolute" />
      <i onClick={()=>{
          select===(listImg.length-1)?setSelect(0):setSelect(select + 1)
        }}  className="btn-right fi fi-sr-angle-right position-absolute" />
      </>:''}
    </div>
  );
}

