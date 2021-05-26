const space = document.querySelector('.space')
const musicContainer = document.querySelector('.music-container')
const playBtn = document.querySelector('#play')
const backwardsBtn = document.querySelector('#backward')
const forwardsBtn = document.querySelector('#forward')
const prevBtn = document.querySelector('#previous')
const nextBtn = document.querySelector('#next')
const addBtn = document.querySelector("#add")
const fileInput = document.querySelector("#file-input")
const audio = document.querySelector('#audio')
const startTime = document.querySelector("#start-time")
const endTime = document.querySelector("#end-time")
const progress = document.querySelector('.progress')
const progressContainer = document.querySelector('.progress-container')
const title = document.querySelector('#title')
const cover = document.querySelector('#cover')

let songs = [];
let currentSongPosition;

// Helper functions
function extractFileName(name) {
  const split = name.split('.');
  split.pop();
  let nameString = "";
  split.forEach(text => nameString += text + ".")
  nameString = nameString.slice(0, -1)
  return nameString
}

function convertToHoursAndMinutes(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time % 3600 / 60)
  const seconds = Math.floor(time % 3600 % 60)

  const hDisplay = hours > 0 ? (hours < 10 ? "0" : '') + hours + ':' : ''
  const mDisplay = (minutes < 10 ? "0" : '') + minutes + ':'
  const sDisplay = (seconds < 10 ? "0" : '') + seconds

  return hDisplay + mDisplay + sDisplay
}

function loadSongFromComputer(file) {
  audio.src = URL.createObjectURL(file)
  startTime.innerText = "00:00"
  title.innerText = extractFileName(file.name)
}

function updateEndTime() {
  const duration = audio.duration
  endTime.innerText = convertToHoursAndMinutes(duration)
}

function playSong() {
  if (audio.src !== "") {
    space.classList.add('play')
    musicContainer.classList.add('play')
    playBtn.querySelector('i.fas').classList.remove('fa-play')
    playBtn.querySelector('i.fas').classList.add('fa-pause')

    audio.play()
  }
}

function pauseSong() {
  space.classList.remove('play')
  musicContainer.classList.remove('play')
  playBtn.querySelector('i.fas').classList.add('fa-play')
  playBtn.querySelector('i.fas').classList.remove('fa-pause')

  audio.pause()
}

function seekBackwards() {
  const { duration, currentTime } = audio
  let updatedCurrentTime
  if (currentTime < 10) {
    updatedCurrentTime = 0
  } else {
    updatedCurrentTime = currentTime - 10
  }

  audio.currentTime = updatedCurrentTime
  const progressPercent = (updatedCurrentTime / duration) * 100
  progress.style.width = `${progressPercent}%`
  startTime.innerText = convertToHoursAndMinutes(updatedCurrentTime)
}

function seekForwards() {
  const { duration, currentTime } = audio
  let updatedCurrentTime
  if (duration - currentTime < 10) {
    updatedCurrentTime = duration
    pauseSong()
    return
  } else {
    updatedCurrentTime = currentTime + 10
  }

  audio.currentTime = updatedCurrentTime
  const progressPercent = (updatedCurrentTime / duration) * 100
  progress.style.width = `${progressPercent}%`
  startTime.innerText = convertToHoursAndMinutes(updatedCurrentTime)
}

function prevSong() {
  if (songs.length !== 0) {
    if (currentSongPosition === 0) {
      currentSongPosition = songs.length - 1;
    } else {
      currentSongPosition--;
    }
    loadSongFromComputer(songs[currentSongPosition]);
    playSong();
  }
}

function nextSong() {
  if (songs.length !== 0) {
    if (currentSongPosition === songs.length - 1) {
      currentSongPosition = 0;
    } else {
      currentSongPosition++;
    }
    loadSongFromComputer(songs[currentSongPosition]);
    playSong();
  }
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement
  const progressPercent = (currentTime / duration) * 100
  progress.style.width = `${progressPercent}%`
  startTime.innerText = convertToHoursAndMinutes(currentTime)
}

function setProgress(e) {
  const width = this.clientWidth
  const clickX = e.offsetX
  const duration = audio.duration

  audio.currentTime = (clickX / width) * duration
}

function addNewSong() {
  fileInput.click()
}

function readFile() {
  songs = fileInput.files
  currentSongPosition = 0;
  loadSongFromComputer(songs[currentSongPosition]);
  playSong()
}

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play')
  if (isPlaying) {
    pauseSong()
  } else {
    playSong()
  }
})

// Change song events
backwardsBtn.addEventListener('click', seekBackwards)
forwardsBtn.addEventListener('click', seekForwards)
prevBtn.addEventListener('click', prevSong)
nextBtn.addEventListener('click', nextSong)

audio.addEventListener('durationchange', updateEndTime)
audio.addEventListener('timeupdate', updateProgress)
audio.addEventListener('ended', seekForwards)

progressContainer.addEventListener('click', setProgress)

addBtn.addEventListener('click', addNewSong)

fileInput.addEventListener('change', readFile)