import React from 'react';
import "./Header.css";
import Login from './component/Login';
import Logo from './component/Logo';
import Search from './component/Search';

export default function Header({user}) {
    return (
      <header className="container-fluid py-2  shadow bg-white">
        <div className="row">
          <Logo />
          <Search />
          <Login user={user} />
        </div>
      </header>
    );
}

