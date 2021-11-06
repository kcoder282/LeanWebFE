import React from 'react';
import {BiAtom} from 'react-icons/bi'
import './Layout.css'
import Login from './Login';
import Search from './Search';

export default function Header() {
    return (
      <header className="container-fluid py-2 px-3 shadow">
        <div className="row">
            <div className="col">
                <div className="col fs-3 text-uppercase text-primary font-weight-bold order-0">
                <BiAtom /> Learn
                </div>
            </div>
            <Search />
            <Login />
        </div>
      </header>
    );
}

