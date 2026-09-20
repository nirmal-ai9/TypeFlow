// preventing paste

txt.addEventListener("paste", (e) => {
  e.preventDefault()
})
txt.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
    e.preventDefault()
  }
})

// accessibility 

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "r") {
    e.preventDefault();
    changePara();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    document.getElementById("typing-area").scrollIntoView({
      behavior: "smooth"
    });
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    document.getElementById("landing-page").scrollIntoView({
      behavior: "smooth"
    });
  }
});
