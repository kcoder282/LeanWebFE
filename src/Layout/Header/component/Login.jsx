import { useEffect, useState } from 'react';
export default function Login({user}) {
  const [name, setName] = useState("")
  useEffect(() => {
    let data = user.name ?? "";
    data = data.split(" ");
    setName(data[data.length - 1]);
  }, [user.name]);

    return (
      <div className="col-sm-3 text-right order-1 col-5 order-sm-2">
        <div className="btn btn-primary rounded-pill">
          {user.id === undefined ? (
            <>
              <i className="fi fi-rr-key" /> login
            </>
          ) : (
            <>
              <i className="fi fi-rr-user d-none d-sm-inline-block" /> Hi {name}
            </>
          )}
        </div>
      </div>
    );
}
