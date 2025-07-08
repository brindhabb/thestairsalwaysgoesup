async function loadSongs() {
  const response = await fetch("song.txt");
  const text = await response.text();
  const songs = text.trim().split("\n");

  const list = document.getElementById("songList");
  songs.forEach(song => {
    const item = document.createElement("div");
    item.className = "song-item";
    item.innerHTML = `
      <img src="images/${song}.jpg" alt="${song}">
      <span>${song}</span>
    `;
    item.onclick = () => {
      sessionStorage.setItem("currentSong", song);
      sessionStorage.setItem("allSongs", JSON.stringify(songs));
      window.location.href = "song.html";
    };
    list.appendChild(item);
  });

  const current = sessionStorage.getItem("currentSong");
  if (current) {
    document.getElementById("miniTitle").textContent = current;
    document.getElementById("miniArt").src = `images/${current}.jpg`;
    document.getElementById("miniToggle").onclick = () => {
      window.location.href = "song.html";
    };
  }
}
window.onload = loadSongs;