import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { host } from "../../../Static";
import Item from "./component/Item";

export default function Menu() {
  const [menu, setMenu] = useState();
  const [load, setLoad] = useState(true);
  useEffect(() => {
    axios
      .get(host + "menu")
      .then((result) => {
        setMenu(result.data);
        setLoad(false);
      })
      .catch((err) => {
        toast.error(err + "");
      });
  }, []);
  return load ? null : (
    <div className="menu order-1 order-sm-0 mt-0 mt-sm-4 d-flex flex-row flex-sm-column justify-content-around justify-content-sm-start">
      {menu.map((e, i) => (
        <Item key={i} name={e.name} path={e.path} />
      ))}
    </div>
  );
}
