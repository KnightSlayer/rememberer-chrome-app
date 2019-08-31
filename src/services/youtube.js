import { youtubeApiKey } from '../../keys'

const originLang = 'en';
const translationLang = 'ru';

const getCapturesListEndpoint = (videoId) => `https://content.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${youtubeApiKey}`;
const getCaptureDownloadEndpoint = (captionId) => `https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${youtubeApiKey}&tfmt=sbv`;



function googleTranslate ({q, source, target}) {
  fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${q}`)
    .then(r => r.json())
    .then(r => console.log('r', r) || r[0][0][0]);
}
googleTranslate({q: 'hello', source: 'en', target: 'ru'})

export const analyzeLink = (link) => {
  console.log('analyzeLink', link);
  function parseSbvCaption(caption) {
    function getSeconds(timeStr) {
      const [, h, m, s] = timeStr.match(/^(\d):(\d\d):(\d\d)\.\d\d\d$/);

      return +s + m*60 + h*3600;
    }
    let res = caption.split('\n\n')
      .map( sub => sub.match(/(\d:\d\d:\d\d\.\d\d\d),(\d:\d\d:\d\d\.\d\d\d)\s*((.|\s)*)/))
      .filter( matchRes => matchRes)
      .map(matchRes => ({
        from: getSeconds(matchRes[1]),
        to: getSeconds(matchRes[2]),
        text: matchRes[3].trim().replace(/\s+/g, ' '),
      }));

    return res;
  };

  function getSubIndex({caption, time}) {
    // TODO: caption is sorted, so I can use here binary search later
    for (const index in caption) {
      if (time >= caption[index].from && time <= caption[index].to) {
        return index;
      }
    }
  }

  function getTextAndTime({caption, fromIndex, toIndex}) {
    let text = '';

    for (let i = fromIndex; i <= toIndex; i++) {
      text += caption[i].text;
    }

    return {
      text,
      startTime: caption[fromIndex].from,
      duration: caption[toIndex].to - caption[fromIndex].from + 1,
    }
  }

  const [, videoId, time] = link.match(/youtu\.be\/(.*)\?t=(\d+)$/);

  const captionsIdsPromise = fetch(getCapturesListEndpoint(videoId))
    .then(r => r.json())
    .then(r => r.items)
    .then(captions => {
      let guessedLang, originCaption, translationCaption;

      for (const caption of captions) {
        // if generated automatic speech
        if (caption.snippet.trackKind == 'ASR') {
          originCaption = caption;
          guessedLang = caption.snippet.language;
          break;
        }
      }

      const fromLang = originLang || guessedLang;

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

  const downloadCaption = (captionId, token) => {
    return fetch(getCaptureDownloadEndpoint(captionId), {
      headers: new Headers({
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      }),
    })
      .then(r => r.text())
      .then(r => parseSbvCaption(r))
      .then(captArr => captArr.filter(sb => sb.text))
  };

  return Promise.all([captionsIdsPromise, tokenPromise])
    .then(([{originCaptionId, translationCaptionId}, token]) => {

      return Promise.all([downloadCaption(originCaptionId, token), downloadCaption(translationCaptionId, token)])
    })
    .then(([originCaption, translationCaption]) => {
      const CaptionObj = function ({caption, time}) {
        const initIndex = getSubIndex({caption, time});

        const theEntity = {
          indexFrom: initIndex,
          indexTo: initIndex,
        };
        theEntity.getTextAndTime = () => getTextAndTime({caption, fromIndex: theEntity.indexFrom, toIndex: theEntity.indexTo});

        return theEntity;
      };
      const captionsObject = {
        origin: new CaptionObj({caption: originCaption, time}),
        translation:  new CaptionObj({caption: translationCaption, time}),
      };

      const videoObject = {
        getData: () => {
          const originSb = captionsObject.origin.getTextAndTime();

          return {
            videoId,
            time: originSb.startTime,
            duration: originSb.duration,
            origin: originSb.text,
            translation: captionsObject.translation.getTextAndTime().text,
          }
        }
      };

      return videoObject;
    });
};














const getYoutubeIframeApi = () => new Promise( (resolve, reject) => {
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

    controller.player = player;
    controller.play = () => {
      player.seekTo(time, true);
      const intervalId = setInterval(() => {
        if (player.getPlayerState() !== 1) return;

        player.playVideo();
        setTimeout(() => player.pauseVideo(), duration * 1000);
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
