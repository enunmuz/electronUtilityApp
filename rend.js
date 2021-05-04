const { ipcRenderer } = require("electron");

const musicModuleBtn = document.getElementById("music-module");

musicModuleBtn.addEventListener("click", () => {
	const openPlayer = ipcRenderer.send("OPEN-MUSIC-PLAYER");
});
