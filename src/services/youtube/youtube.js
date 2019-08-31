import { youtubeApiKey } from '../../../keys'
import Caption from  './caption'
import captionMock from './caption.example'

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
  const [, videoId, time] = link.match(/youtu\.be\/(.*)\?t=(\d+)$/);

  const getCaptionsIds = (videoId) => fetch(getCapturesListEndpoint(videoId))
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
        guessedLang,
      }
    });

  const tokenPromise = new Promise((resolve, reject) => {
    // We are serverless, so we need to asc users connect their account???
    chrome.identity.getAuthToken({'interactive': true}, (token) => resolve(token))
  });

  const downloadCaption = (captionId, token) => {
    // return fetch(getCaptureDownloadEndpoint(captionId), {
    //   headers: new Headers({
    //     Authorization: 'Bearer ' + token,
    //     Accept: 'application/json',
    //   }),
    // })
    //   .then(r => r.text())
    return Promise.resolve(captionMock)
      .then(r => Caption.parsePlain(r))
  };

  return Promise.all([/*getCaptionsIds(videoId)*/ Promise.resolve({}), tokenPromise])
    .then(([ { originCaptionId, translationCaptionId, guessedLang }, token ]) => {

      return Promise.all([guessedLang, downloadCaption(originCaptionId, token), downloadCaption(translationCaptionId, token)])
    })
    .then(([guessedLang, originCaption, translationCaption]) => {
      const captionsObject = {
        origin: new Caption({caption: originCaption, time}),
        translation:  new Caption({caption: translationCaption, time}),
      };
      const subscribers = [];

      const onUpdate = () => {
        const newData = videoObject.getData();
        for (const cb of subscribers) {
          cb(newData)
        }
      };

      const videoObject = {
        guessedLang,
        videoId,
        subscribe: (cb) => subscribers.push(cb),
        getData: () => {
          const originSb = captionsObject.origin.getTextAndTime();

          return {
            time: originSb.startTime,
            duration: originSb.duration,
            origin: originSb.text,
            translation: captionsObject.translation.getTextAndTime().text,
          }
        },
        prepend: () => {
          captionsObject.origin.prepend();
          captionsObject.translation.prepend();
          onUpdate();
        },
        append: () => {
          captionsObject.origin.append();
          captionsObject.translation.append();
          onUpdate();
        },
      };

      return videoObject;
    });
};
