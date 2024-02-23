// CSS RELATED

// Selecting Elements
const searchGlass = document.querySelector(".search-glass")
const searchInput = document.querySelector(".search-input")
const scrollDiv = document.querySelector(".right-scrollable-container")
const header = document.querySelector(".right-header")
const greeting = document.querySelector(".greeting")

const heart = document.querySelector(".heart")

// Making Functions
function toggleState(){
  searchInput.classList.toggle("clicked")
}

function changeHeaderBackground(){
  const y = scrollDiv.scrollTop
  y > 20 ? header.classList.add("scrolled") : header.classList.remove("scrolled")
}

function toggleLike(){
  if(audio.src == "http://127.0.0.1:5500/"){
    return
  } else{
     heart.classList.toggle("liked")
  }
}

function changeGreeting(){
  const now = new Date()
  const hour = now.getHours()

  if(hour >= 0 && hour <= 6){
    greeting.textContent = "Good Night"
  }
  if(hour > 6 && hour < 12){
    greeting.textContent = "Good Morning"
  }
  if(hour > 12 && hour < 16){
    greeting.textContent = "Good Afternoon"
  }
  if(hour > 16 && hour < 19){
    greeting.textContent = "Good Evening"
  }
  if(hour > 19){
    greeting.textContent = "Good Night"
  }
  
}

// Hooking Up Event Listeners
searchGlass.addEventListener("click",toggleState)
scrollDiv.addEventListener("scroll",changeHeaderBackground)
heart.addEventListener("click",toggleLike)

//////////////////////////////////////////
//////////////////////////////////////////

// JSON RELATED

// Hooking Up Event Listeners
window.addEventListener("load",init)

// Making Functions
function init(){
fetchAndRenderAllSections()
changeGreeting()
}

function fetchAndRenderAllSections(){
  fetch("./gaana.json")
  .then(res => res.json())
  .then(res => {
        const {cardbox} = res
        if(Array.isArray(cardbox) && cardbox.length){
          cardbox.forEach(section =>{
            const {songsbox, songscards} = section
            renderSection(songsbox,songscards)
          })
        }
  })
  .catch(err => console.error(err))
}

function renderSection(title,songsList){
  const section = makeSectionDom(title,songsList)
  const rightScrollableContainer = document.querySelector(".right-scrollable-container")
  rightScrollableContainer.appendChild(section)
}

function makeSectionDom(title,songsObj){
  const div = document.createElement("div")
  div.className = "big-cards-div"
  div.innerHTML = `
  <div class="heading-wrap">
               <h3 class="heading">${title}</h3> 
               <p>Show All</p>
            </div>
            <div class="big-cards">
                 ${songsObj.map(song => makeBigCardDom(song)).join("")}
            </div>
  `
  return div
}

function makeBigCardDom(songsList){
  const songsObjInStr = encodeURIComponent(JSON.stringify(songsList))

return `
<div class="big-card" onclick="setSong(this, '${songsObjInStr}')">
<div class="big-card-img-div">
    <img src="${songsList.image_source}" alt="${songsList.song_name}">
    <div class="big-card-overlay">
        <i class="fa-solid fa-play"></i>
        <i class="fa-solid fa-pause"></i>
    </div>
</div>
<div class="big-card-title-div">
    <h3>${songsList.song_name}</h3>
    <p>${songsList.singers}</p>
</div>
</div>
`
}

//////////////////////////////////////////
//////////////////////////////////////////

// CONTROLS RELATED

// Selecting Elements
// Elements For Playback
const footer = document.querySelector("footer")
const audio = footer.querySelector("audio")
audio.volume = 0.5

const currentSongImg = footer.querySelector(".current-song-img")
const currentSongTitle = footer.querySelector(".current-song-title")
const currentSongSinger = footer.querySelector(".current-song-singer")
const shuffle = footer.querySelector(".fa-shuffle")
const previousSong = footer.querySelector(".fa-backward")
const backFiveSeconds = footer.querySelector(".fa-backward-step")
const nextSong = footer.querySelector(".fa-forward")
const skipFiveSeconds = footer.querySelector(".fa-forward-step")
const playPause = document.querySelector(".play-pause")
const play = footer.querySelector("#play")
const pause = footer.querySelector("#pause")
const repeat = footer.querySelector(".fa-repeat")
const timeline = footer.querySelector("#song-progress")
const progress = footer.querySelector("progress")
const volume = footer.querySelector("#volume")
const volumeProgress = footer.querySelector("#volume-progress")
const timeStart = footer.querySelector("#time-start")
const totalTime = footer.querySelector("#total-time")
const soundControl = footer.querySelector(".volume-control")
const soundMute = footer.querySelector(".volume-mute")
const soundLow = footer.querySelector(".volume-low")
const soundMedium = footer.querySelector(".volume-medium")
const soundHigh = footer.querySelector(".volume-high")

// Making Functions

// Playback Functions
function setTrackDuration(){
  timeline.max = audio.duration.toFixed(2)
}

function changeIcon(card){
  if(!card){
    const focusedCard = document.querySelector(".focused")

    if(focusedCard){
      card = focusedCard
    } else{
      console.error("card not found")
      return
    }
  }
  
  const thisPlay = card.querySelector(".fa-play")
  const thisPause = card.querySelector(".fa-pause")

  audio.paused ? (thisPlay.style.display ="block",thisPause.style.display = "none") : (thisPlay.style.display ="none",thisPause.style.display = "block")
}

function togglePlay(card){
  if(audio.paused){
    audio.play()
    changeIcon(card)
  } else{
    audio.pause()
    changeIcon(card)
  }
}

function resetIcons(){
  const allPauseIcons = document.querySelectorAll(".fa-pause")
  const allPlayIcons = document.querySelectorAll(".fa-play")

  allPauseIcons.forEach(btn => btn.style.display = "none")
    allPlayIcons.forEach(btn => btn.style.display = "block")
    
}

function updateTime(){
  // currentTime
  const currentTime = audio.currentTime
  const minutes = ~~(currentTime / 60)
  const seconds = ~~(currentTime % 60)
  const formattedCurrentTime = minutes + ":" + (seconds < 10 ? "0" : "") + seconds
  timeStart.innerHTML =  formattedCurrentTime

  // totalTime
  const totalDuration = audio.duration
  const totalMinutes = ~~(totalDuration / 60)
  const totalSeconds = ~~(totalDuration % 60)
  const formattedTotalTime = totalMinutes + ":" + (totalSeconds < 10 ? "0" : "") + totalSeconds
  totalTime.innerHTML = formattedTotalTime

  // Setting progressBar
  let progressValue = (audio.currentTime / audio.duration) * 100
  
  !isNaN(progressValue) ?  progress.value = progressValue : null
}

let currentlyPlaying = null
let lastCard = null
function setSong(card,songsObjInStr){

   const songObj = JSON.parse(decodeURIComponent(songsObjInStr))

   if(currentlyPlaying === songObj.quality.high){
    togglePlay(card)
    return
   } else{
    if(lastCard){
       lastCard.classList.remove("focused")
    }
     card.classList.add("focused") 
     lastCard = card

    currentlyPlaying = songObj.quality.high
    audio.src = currentlyPlaying
    updateUI(songObj)
    resetIcons()
    togglePlay(card)
   }
    
   if(heart.classList.contains("liked")){
    toggleLike()
   }
   }
  
function updateUI(currentSongObj){
currentSongImg.src = currentSongObj.image_source
currentSongTitle.innerHTML = currentSongObj.song_name
currentSongSinger.innerHTML = currentSongObj.singers
}

function changePlayPauseButton(){
    switch (this.paused) {
      case true:
        play.style.display = "block"
        pause.style.display = "none"
        break

      case false:
        pause.style.display = "block"
        play.style.display = "none"
        break
    }
}

function syncTimeline(){
timeline.value = audio.currentTime
progress.value = timeline.value
}

function seekableTimeline(){
  audio.currentTime = this.value
}

function changeVolumeBar(){
  if(audio.volume == 0){
    soundMute.style.display = "block"
    soundLow.style.display = "none"
    soundMedium.style.display = "none"
    soundHigh.style.display = "none"
  } if(audio.volume > 0){
    soundMute.style.display = "none"
    soundLow.style.display = "block"
    soundMedium.style.display = "none"
    soundHigh.style.display = "none"
  } if(audio.volume > .3){
    soundMute.style.display = "none"
    soundLow.style.display = "none"
    soundMedium.style.display = "block"
    soundHigh.style.display = "none"
  } if(audio.volume > .7){
    soundMute.style.display = "none"
    soundLow.style.display = "none"
    soundMedium.style.display = "none"
    soundHigh.style.display = "block"
  }
}

function volumeControl(val){
 if(!isNaN(val)){
   if(val > 0){
     audio.volume = Math.min(1, audio.volume + 0.05) 
     volume.value = audio.volume
   } else if(val < 0){
    audio.volume = Math.max(0, audio.volume - 0.05) 
    volume.value = audio.volume
   }
 
 } else{
  audio.volume = this.value/100
 }

 volumeProgress.value = audio.volume * 100

}

function toggleLoop(){
  repeat.classList.toggle("looping")
  repeat.classList.contains("looping") ? audio.setAttribute("loop","") : audio.removeAttribute("loop","")
}

function startOver(){
  audio.currentTime = 0
}

function songAhead(){
  audio.currentTime = audio.duration
}

function backFive(){
  audio.currentTime += -5
}

function skipFive(){
  audio.currentTime += 5
}  

// UI Functions
function closeSearchInput(e){
  !e.target.classList.contains("search-glass") && !e.target.classList.contains("search-input")
  ? searchInput.classList.remove("clicked")
  : null
}

// Keyboard Functions
function keyBoardFunctions(e){
  switch(e.keyCode){
    case 32:
      e.preventDefault()
      togglePlay()
    break

    case 37:
      backFive()
    break

    case 38:
      audio.volume < 1 && e.ctrlKey ? volumeControl(0.05) : null
      break
    
    case 39:
      skipFive()
    break
    
    case 40:
      audio.volume > 0 && e.ctrlKey ?  volumeControl(-0.05): null
      break
  }
  
}

// Hooking Up Event Listeners

// Listeners For Playback
audio.addEventListener("loadedmetadata", setTrackDuration)
audio.addEventListener("play",changePlayPauseButton)
audio.addEventListener("pause",changePlayPauseButton)
audio.addEventListener("timeupdate",syncTimeline)
audio.addEventListener("timeupdate",updateTime)
audio.addEventListener("volumechange",changeVolumeBar)

previousSong.addEventListener("click",startOver)
backFiveSeconds.addEventListener("click",backFive)
playPause.addEventListener("click",()=>{
  togglePlay()
})
skipFiveSeconds.addEventListener("click",skipFive)
nextSong.addEventListener("click",songAhead)
repeat.addEventListener("click",toggleLoop)

timeline.addEventListener("input",seekableTimeline)
volume.addEventListener("input",volumeControl)

// Listeners For Document
document.addEventListener("click", closeSearchInput)
document.addEventListener("keydown",keyBoardFunctions)