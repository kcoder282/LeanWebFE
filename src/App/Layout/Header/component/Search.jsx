import React from 'react'
import { IoCloseCircleSharp } from "react-icons/io5";

export default function Search() {
    return (
      <div className="col col-sm-5 order-2 mt-2 order-sm-1 mt-sm-0">
        <div className="search position-relative">
          <input
            type="text"
            className="form-control rounded-pill px-4"
            placeholder="Bạn muốn học điều gì?"
          />
          <IoCloseCircleSharp
            size="1.5rem "
            className="text-primary position-absolute btn-close"
          />
        </div>
      </div>
    );
}
