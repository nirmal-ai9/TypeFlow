document.getElementById("btn-kb").onclick =  function goToKb() {
  window.location.href = "keyboard.html"
}
document.getElementById("git").onclick = function goTogit() {
  window.location.href = "https://github.com/nirmal-ai9/TypeFlow"
}
document.getElementById("discord").onclick = function goTodiscord() {
  window.location.href = "https://discord.gg/dKa2wEJGF9"
}


circumference = 2 * Math.PI * 70;

function getParagraphs() {
  const curruntLevel = localStorage.getItem("lastlevel");
  const curruntLine = localStorage.getItem("lastline");
  
  let x = levelName.indexOf(curruntLevel)
  let y = lineName.indexOf(curruntLine)
  let z = Math.floor(Math.random() * 5)
  
  guessedPara = paragraph[x][y][z]
}

function setDefaultLayout() {
  section.classList.replace("non-d", "default");
  levelWrap.classList.replace("non-dlevel", "default-level");
  lineWrap.classList.replace("non-dline", "default-line");
}
function removeDefaultLayout() {
  section.classList.replace("default", "non-d");
  levelWrap.classList.replace("default-level", "non-dlevel");
  lineWrap.classList.replace("default-line", "non-dline");
}

function changePara() {
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  
  isUserStarted = false
  txt.disabled = false
  isCompleted = false
  
  txt.value = "";
  [lpm, accuracy, time, percent].forEach(el => {
    el.textContent = "-";
  });
  
  getParagraphs() 
  clearInterval(interval)
  setDefaultLayout()
  fadeout.forEach(e => e.classList.remove("done"))
  
  lbl.innerHTML = guessedPara
  .split("")
  .map(char => `<span>${char}</span>`)
  .join("");
}

function stat() {
  const chars = lbl.querySelectorAll("span");
  if (txt.value.length === 0 || txt.value.length > chars.length) {
    changePara()
    
  } else if (txt.value.length === 1 && isUserStarted === false ) {
    
    isUserStarted = true
    
    fadeout.forEach(e => {
      e.classList.add("done")
    })
    
    setTimeout( () => {
      removeDefaultLayout()
    },1000)
    
    clearInterval(interval)
    startTime = 0
    interval = setInterval(() => {
      startTime += 0.01
      time.textContent = startTime.toFixed(2);
    }, 10)
    
  }
  
  chars.forEach((span, i) => {
    span.classList.remove("correct", "wrong", "current");
    
    if (i < txt.value.length) {
      span.classList.add(
        txt.value[i] === span.textContent ? "correct" : "wrong"
      );
    } else if (i === txt.value.length) {
      span.classList.add("current");
    }
  });

  if (isCompleted === false && txt.value.length > 1) {
    // calculating accuracy
   let differentChars = (a, b) => [...a].filter((c, i) => c !== b[i]).length;
    let mistake = differentChars(txt.value, lbl.textContent.slice(0, txt.value.length));
    let result = ((txt.value.length - mistake) / txt.value.length) * 100;
    accuracy.textContent = result.toFixed(2)
    
    // calculating lpm
    let newLpm = (txt.value.length / startTime) * 60
    lpm.textContent = newLpm.toFixed(1)
  
  }
  
    // calculating progress
  let progress = ((txt.value.length / lbl.textContent.length) * 100).toFixed(2)
  if (progress <= 100) {
    percent.textContent = progress
  } 
  
  function setProgress(el) {
    const offset = circumference - (el / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }
  
  setProgress(progress);
  
  // final calculation
  if(txt.value.length === lbl.textContent.length){
    clearInterval(interval)
    isCompleted = true
    txt.disabled = true
  }
}


// running function 

changePara();

[...buttonLevel, ...buttonLine, btn].forEach(button => {
  button.addEventListener("click", changePara);
});

txt.addEventListener("input", stat)
