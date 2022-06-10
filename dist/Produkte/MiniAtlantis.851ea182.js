/* Wurde auf die Produktseite abgestimmt. Also dieses Skript funktioniert nur so wie gewollt auf der Produktseite */ const videos = document.getElementsByTagName("video");
var current_video;
function pause_unpause_videos() {
    current_video = undefined;
    const headerbar_position_data = document.getElementsByClassName("Headerbar")[0].getBoundingClientRect();
    for(let i = 0; i < videos.length; i++){
        if ((window.innerHeight - headerbar_position_data.bottom) / 1.5 > Math.abs(headerbar_position_data.bottom - videos[i].getBoundingClientRect().top)) current_video = videos[i];
        videos[i].pause();
    }
    if (current_video) current_video.play();
}
setInterval(pause_unpause_videos, 200);

//# sourceMappingURL=MiniAtlantis.851ea182.js.map
