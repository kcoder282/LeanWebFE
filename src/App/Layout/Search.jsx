import React from 'react'
import { IoCloseCircleSharp } from "react-icons/io5";

export default function Search() {
    return (
      <div className="col d-flex ">
        <div className="col search position-relative order-2">
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
