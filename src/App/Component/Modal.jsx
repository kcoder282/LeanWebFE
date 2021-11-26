import React from 'react'
import './Modal.css'

export default function Modal({children}) {
    return (
      <div className="Modal d-flex justify-content-center align-items-center">
        <div className="Model-container bg-white rounded animate__animated animate__fadeInDown animate__faster shadow">
          <div className="m-4">{children}</div>
        </div>
      </div>
    );
}
