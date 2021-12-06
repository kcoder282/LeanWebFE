import React from 'react'

export default function Search() {
    return (
      <div className="col col-sm-5 order-2 mt-2 order-sm-1 mt-sm-0">
        <div className="search position-relative">
          <input
            type="text"
            className="form-control rounded-pill pl-3 pr-5 w-100"
            placeholder="Bạn muốn học điều gì?"
          />
          <i
            size="1.5rem "
            className="text-primary position-absolute btn-close fi fi-rr-cross-circle d-block"
          />
        </div>
      </div>
    );
}
