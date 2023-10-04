window.addEventListener("load",()=>{
  window.addEventListener("pywebviewready",()=>{
    console.log('pywebviewready');
    pywebview.api.say_hi("juan").then((value) => {
      console.log(value);
    })
  })
})






