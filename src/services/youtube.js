import { youtubeApiKey } from '../../keys'

const videoId = 'Yocja_N5s1I';
const captionId1 = 'TLlfC6fxsMkMNiXR_JDSyxU4pYV9Aehn';
const captionId2 = 'iA80G5cFenkN7wCVdVBQqUh2FiJq37-mJCHN-PM7MGc='; // auto generated

const originLang = 'en';
const translationLang = 'ru';

const capturesListUrl = `https://content.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${youtubeApiKey}`;
const captureUrl = `https://www.googleapis.com/youtube/v3/captions/${captionId1}?key=${youtubeApiKey}&tfmt=sbv`;

export const analyzeLink = (link) => {
  console.log('analyzeLink', link);
  const [, videoId, time] = link.match(/youtu\.be\/(.*)\?t=(\d+)$/);

  const captionsListPromise = fetch(`https://content.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${youtubeApiKey}`)
    .then(r => r.json())
    .then(r => r.items)
    .then(captions => {
      let fromLang, originCaption, translationCaption;

      for (const caption of captions) {
        // if generated automatic speech
        if (caption.snippet.trackKind == 'ASR') {
          originCaption = caption;
          fromLang = caption.snippet.language;
          break;
        }
      }

      for (const caption of captions) {
        if (caption.snippet.trackKind != 'ASR' && caption.snippet.language == fromLang) {
          originCaption = caption;
        }
        if (caption.snippet.language == translationLang) {
          translationCaption = caption;
        }
      }

      return {
        originCaptionId: originCaption.id,
        translationCaptionId: translationCaption.id,
      }
    });

  const tokenPromise = new Promise((resolve, reject) => {
    // We are serverless, so we need to asc users connect their account???
    chrome.identity.getAuthToken({'interactive': true}, (token) => resolve(token))
  });

  return Promise.all([captionsListPromise, tokenPromise])
    .then(([{originCaptionId, translationCaptionId}, token]) => {
      console.log('captionsList', originCaptionId, translationCaptionId)
      console.log('token', token)
    })
    .then(captions => {
      // fetch(captureUrl, {
      //   headers: new Headers({
      //     Authorization: 'Bearer ' + token,
      //     Accept: 'application/json',
      //   }),
      // })
      //   .then(r => r.text())
      //   .then(r => parseSbvCaption(r))
      //   .catch(e => console.log('e',e));

      return {videoId, time};
    });
};

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

const getYoutubeIframeApi = () => new Promise( (resolve, reject) => {
  const tag = document.createElement('script');
  tag.onencrypted = () => reject();
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = () => resolve(window.YT)
});


export const initVideo = (placeholder, videoId, time = 0) => getYoutubeIframeApi().then((YT) => {
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

    controller.player = player;
    controller.play = ({fromSecond, duration}) => {
      player.seekTo(fromSecond, true).playVideo();
      setTimeout(() => player.pauseVideo(), duration * 1000);
    };
  })
});


/*

https://youtu.be/uD4izuDMUQA?t=435

<iframe src="https://www.youtube.com/embed/uD4izuDMUQA"
 frameborder="0"
 allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"></iframe>

 */
