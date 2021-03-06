const getYoutubeIframeApi = () => new Promise( (resolve, reject) => {
  if (window.YT) return resolve(window.YT);

  // TODO: remove lib and do nativly
  const tag = document.createElement('script');
  tag.onencrypted = () => reject();
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = () => resolve(window.YT)
});


export const initVideo = ({placeholder, videoId, time = 0, duration = 1}) => getYoutubeIframeApi().then((YT) => {
  return new Promise( resolve => {
    const controller = {};

    const player = new YT.Player(placeholder, {
      videoId,
      playerVars: {
        controls: 0,
        cc_load_policy: 0,
        iv_load_policy: 3,
        showinfo: 0,
        rel: 0,
      },
      events: {
        onReady: () => resolve(controller),
      }
    });

    let intervalId, timeoutId;
    controller.player = player;
    controller.play = () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);

      player.seekTo(time, true);
      player.playVideo();
      intervalId = setInterval(() => {
        const s = player.getPlayerState();

        if (s !== 1) return;
        timeoutId = setTimeout(() => player.pauseVideo(), duration * 1000);
        clearInterval(intervalId)
      }, 200)
    };
  })
});


/*

https://youtu.be/uD4izuDMUQA?t=435

<iframe src="https://www.youtube.com/embed/uD4izuDMUQA"
 frameborder="0"
 allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"></iframe>

 */
