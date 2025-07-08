const song = sessionStorage.getItem("currentSong");
const audio = document.getElementById("audio");
const audio8D = document.getElementById("audio8D");
const toggle8D = document.getElementById("toggle8D");
const songTitle = document.getElementById("songTitle");
const songImage = document.getElementById("songImage");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const seekSlider = document.getElementById("seekSlider");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");

songTitle.innerText = song;
songImage.src = `images/${song}.jpg`;

const extensions = ['mp3', 'm4a', 'wav'];
let found = false;

for (let ext of extensions) {
  const mainSrc = `songs/${song}.${ext}`;
  const altSrc = `8D_songs/${song}.${ext}`;
  fetch(mainSrc, { method: 'HEAD' }).then(res => {
    if (!found && res.ok) {
      audio.src = mainSrc;
      found = true;
    }
  });

  fetch(altSrc, { method: 'HEAD' }).then(res => {
    if (res.ok) {
      audio8D.src = altSrc;
    }
  });
}

let songs = [];
let index = 0;
fetch("song.txt")
  .then(res => res.text())
  .then(text => {
    songs = text.trim().split('\n');
    index = songs.indexOf(song);
  });

function playSong(i) {
  index = (i + songs.length) % songs.length;
  sessionStorage.setItem("currentSong", songs[index]);
  window.location.reload();
}

nextBtn.onclick = () => playSong(index + 1);
prevBtn.onclick = () => playSong(index - 1);
backBtn.onclick = () => window.location.href = "index.html";

playPauseBtn.onclick = () => {
  const current = toggle8D.checked ? audio8D : audio;
  if (current.paused) {
    current.play();
    playPauseBtn.innerText = "pause";
  } else {
    current.pause();
    playPauseBtn.innerText = "play_arrow";
  }
};

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

function updateSlider(audioRef) {
  seekSlider.max = Math.floor(audioRef.duration || 0);
  durationDisplay.innerText = formatTime(audioRef.duration || 0);
  seekSlider.value = Math.floor(audioRef.currentTime || 0);
  currentTimeDisplay.innerText = formatTime(audioRef.currentTime || 0);
}

audio.addEventListener("loadedmetadata", () => updateSlider(audio));
audio8D.addEventListener("loadedmetadata", () => updateSlider(audio8D));

audio.addEventListener("timeupdate", () => {
  if (!toggle8D.checked) updateSlider(audio);
});
audio8D.addEventListener("timeupdate", () => {
  if (toggle8D.checked) updateSlider(audio8D);
});

seekSlider.addEventListener("input", () => {
  if (toggle8D.checked) {
    audio8D.currentTime = seekSlider.value;
  } else {
    audio.currentTime = seekSlider.value;
  }
});

// 8D toggle handler
toggle8D.addEventListener("change", () => {
  const from = toggle8D.checked ? audio : audio8D;
  const to = toggle8D.checked ? audio8D : audio;

  const currentTime = from.currentTime;
  const wasPlaying = !from.paused;

  from.pause();
  to.currentTime = currentTime;

  if (wasPlaying) {
    to.play();
    playPauseBtn.innerText = "pause";
  } else {
    playPauseBtn.innerText = "play_arrow";
  }
});
