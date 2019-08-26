import { youtubeApiKey } from '../../keys'

const vidoyId = 'Yocja_N5s1I';
const captionId1 = 'TLlfC6fxsMkMNiXR_JDSyxU4pYV9Aehn';
const captionId2 = 'iA80G5cFenkN7wCVdVBQqUh2FiJq37-mJCHN-PM7MGc='; // auto generated



const capturesListUrl = `https://content.googleapis.com/youtube/v3/captions?part=snippet&videoId=${vidoyId}&key=${youtubeApiKey}`
const captureUrl = `https://www.googleapis.com/youtube/v3/captions/${captionId1}?key=${youtubeApiKey}&tfmt=sbv`;


// We are serverless, so we need to asc users connect their account???
// chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
//   fetch(captureUrl, {
//     headers: new ;Headers({
//       Authorization: 'Bearer ' + token,
//       Accept: 'application/json',
//     }),
//   })
//     .then(r => r.text())
//     .then(r => parseSbvCaption(r))
//     .catch(e => console.log('e',e));
// });

function parseSbvCaption(caption) {
  let res = caption.split('\n\n')
    .map( sub => sub.match(/(\d:\d\d:\d\d\.\d\d\d),(\d:\d\d:\d\d\.\d\d\d)\s*((.|\s)*)/))
    .filter( matchRes => matchRes)
    .map(matchRes => ({
      from: matchRes[1],
      to: matchRes[2],
      text: matchRes[3].trim().replace(/\s+/g, ' '),
    }))
  ;
  console.log(typeof res, Array.isArray(res), res);
  return res;
};


export default 21

const placeholder = document.createElement('div');
document.body.append(placeholder);


var tag = document.createElement('script');
// tag.onload = onYouTubeIframeAPIReady
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
window.onYouTubeIframeAPIReady = () => {
  console.log('onYouTubeIframeAPIReady')
  player = new YT.Player(placeholder, {
    videoId: vidoyId,
    playerVars: {
      controls: 0,
      cc_load_policy: 0,
      iv_load_policy: 3,
      showinfo: 0,
      rel: 0,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.seekTo(550, true).playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 2000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}
/*

https://youtu.be/uD4izuDMUQA?t=435

<iframe src="https://www.youtube.com/embed/uD4izuDMUQA"
 frameborder="0"
 allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"></iframe>

 */
