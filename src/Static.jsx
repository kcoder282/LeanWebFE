import icon from './Icon/svg/fi-rr-user.svg';
export const host = "http://192.168.1.10:8000/api/";
export const imgurl = (name)=>{
  if(name===null)
  return icon;
  else
  if((name+"").includes("data:"))
  return name
  else
  return "http://192.168.1.10:8000/storage/"+name;
}
function setCookie(cname, cvalue, extime) {
  const d = new Date();
  d.setTime(d.getTime() + extime*10000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export function key(){
    return getCookie("key");
}
export function setKey(value,time) {
  return setCookie("key",value,time);
}
export function setTitle(name)
{
  document.title= name;
}