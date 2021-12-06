import "./ImgView.css";
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
export default function ListView({children, className}) {
  const time = useRef();
  const [select, setSelect] = useState(0);

  useEffect(() => {
   time.current = setInterval(() => {
       setSelect((data) => {
         if (data + 1 >= children.length) {
           return 0;
         } else return data + 1;
       });
   }, 5000);

   return () => {
     clearInterval(time.current);
   };
  }, [children.length, select]);

  useEffect(() => {
    setSelect(children.length - 1);
  }, [children.length]);

  return (
    <div className="imgViewData">
      <div className={"view position-relative "+className}
        style={{ transform: `translateX(-${select * 100}%)` }}>

        {children.length>0?children.map((e,i)=>
            <div key={i} style={{ backgroundImage: 'url('+e+')', 
            top: 0, left: (i*100)+"%"}}
              className="imgitem">
              {e}
            </div>
        ):''}

      </div>
      {children.length>1?
      <>
      <div className="btn-img d-flex align-items-center justify-content-center position-absolute">
        {children.map((e, i) => (
          <div key={i}
            onClick={() => setSelect(i)}
            className={"item-img " + (i === select ? "active" : "")}
          />
        ))}
      </div>
      <i onClick={()=>{
          select===0?setSelect(children.length-1):setSelect(select - 1)
        }
        } className="btn-left fi fi-sr-angle-left position-absolute" />
      <i onClick={()=>{
          select===(children.length-1)?setSelect(0):setSelect(select + 1)
        }}  className="btn-right fi fi-sr-angle-right position-absolute" />
      </>:''}
    </div>
  );
}

