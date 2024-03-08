const toogle = document.querySelector(".bar_toggle");
const sidebar = document.querySelector(".filterBox");
const close =document.querySelector(".close")

toogle.addEventListener("click", ()=>{
    if (sidebar.classList.contains("show")) {
        sidebar.classList.remove("show")
    }else{
        sidebar.classList.add("show")
    }
})

close.addEventListener("click", ()=>{
    sidebar.classList.remove("show")
})