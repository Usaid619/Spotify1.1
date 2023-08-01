// CSS RELATED

// Selecting Elements
const searchGlass = document.querySelector(".search-glass")
const searchInput = document.querySelector(".search-input")
const scrollDiv = document.querySelector(".right-scrollable-container")
const header = document.querySelector(".right-header")
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
  heart.classList.toggle("liked")
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
<div class="big-card" onclick="playSong('${songsObjInStr}')">
<div class="big-card-img-div">
    <img src="${songsList.image_source}" alt="${songsList.song_name}">
    <div class="big-card-overlay">
        <i class="fa-solid fa-play"></i>
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
const volume = footer.querySelector("#volume")
const timeStart = footer.querySelector("#time-start")
const totalTime = footer.querySelector("#total-time")
const soundControl = footer.querySelector(".volume-control")
const soundMute = footer.querySelector(".fa-volume-xmark")
const soundLow = footer.querySelector(".fa-volume-low")
const soundHigh = footer.querySelector(".fa-volume-high")

// Making Functions

// Playback Functions
function setDefaultVolumeAndTrackDuration(){
  audio.volume = 0.5
  timeline.max = audio.duration.toFixed(2)
}

function togglePlay(){
  if(audio.src == "http://127.0.0.1:5500/"){
    return
  }  
  audio.paused ? audio.play() : audio.pause()
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
}

function playSong(songsObjInStr){
  const songObj = JSON.parse(decodeURIComponent(songsObjInStr))
   audio.src = songObj.quality.high
   updateUI(songObj)
   togglePlay()
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
}

function seekableTimeline(){
  audio.currentTime = this.value
}

function volumeControl(){
audio.volume = this.value/100
if(this.value > 50){
  soundLow.style.display = "none"
  soundMute.style.display = "none"
  soundHigh.style.display = "block"
} if(this.value < 50){
  soundLow.style.display = "block"
  soundMute.style.display = "none"
  soundHigh.style.display = "none"
} if(this.value == 0){
  soundLow.style.display = "none"
  soundMute.style.display = "block"
  soundHigh.style.display = "none"
}
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
    
    case 39:
      skipFive()
    break
  }
}

// Hooking Up Event Listeners

// Listeners For Playback
audio.addEventListener("loadedmetadata", setDefaultVolumeAndTrackDuration)
audio.addEventListener("play",changePlayPauseButton)
audio.addEventListener("pause",changePlayPauseButton)
audio.addEventListener("timeupdate",syncTimeline)
audio.addEventListener("timeupdate",updateTime)


previousSong.addEventListener("click",startOver)
backFiveSeconds.addEventListener("click",backFive)
playPause.addEventListener("click",togglePlay)
skipFiveSeconds.addEventListener("click",skipFive)
nextSong.addEventListener("click",songAhead)
repeat.addEventListener("click",toggleLoop)

timeline.addEventListener("input",seekableTimeline)

volume.addEventListener("input",volumeControl)


// Listeners For Document
document.addEventListener("click", closeSearchInput)
document.addEventListener("keydown",keyBoardFunctions)
