export const host = "http://192.168.1.10:8000/api/";
export function setCookie(cname, cvalue, extime) {
  const d = new Date();
  d.setTime(d.getTime() + extime);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
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