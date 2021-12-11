import React from 'react';
import "./Header.css";
import Login from './component/BtnLogin';
import Logo from './component/Logo';
import Search from './component/Search';

export default function Header({user, setUser}) {
    return (
      <header className="container-fluid py-2  shadow bg-white">
        <div className="row">
          <Logo />
          <Search />
          <Login user={user} setUser={setUser}/>
        </div>
      </header>
    );
}

