const setCookie = (cName, cValue, expDays) => {
  let date = new Date()
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000)
  const expires = "expires=" + date.toUTCString()
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/backstages"
  console.log(cName + "=" + cValue + "; " + expires + "; path=/backstages", "dcvsdv")
}

export default setCookie
