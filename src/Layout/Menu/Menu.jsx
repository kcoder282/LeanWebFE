import Item from "./component/Item";
export default function Menu() {
  const menu = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Courses",
      path: "/courses",
    },
    {
      name: "Topics",
      path: "/topics",
    },
    {
      name: "Blogs",
      path: "/blogs",
    },
    {
      name: "files",
      path: "/files",
    },
  ];

  return (
    <div className="menu mt-0 mt-sm-4 d-flex flex-row flex-sm-column justify-content-around justify-content-sm-start" >
      {menu.map((e, i) => (
        <Item key={i} name={e.name} path={e.path} />
      ))}
    </div>)
}
