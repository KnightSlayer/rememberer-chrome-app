import { youtubeApiKey } from '../../../keys'
import Caption from  './caption'
import captionMock from './caption.example'

const originLang = 'en';
const translationLang = 'ru';

const getCapturesListEndpoint = (videoId) => `https://content.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${youtubeApiKey}`;
const getCaptureDownloadEndpoint = (captionId) => `https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${youtubeApiKey}&tfmt=sbv`;


export const analyzeLink = (link) => {
  const [, videoId, time] = link.match(/youtu\.be\/(.*)\?t=(\d+)$/);

  const getCaptionsIds = (videoId) => fetch(getCapturesListEndpoint(videoId))
    .then(r => r.json())
    .then(r => r.items)
    .then(captions => {
      let guessedLang, originCaptionId, translationCaptionId;

      for (const caption of captions) {
        // if generated automatic speech
        if (caption.snippet.trackKind == 'ASR') {
          originCaptionId = caption.id;
          guessedLang = caption.snippet.language;
          break;
        }
      }

      const fromLang = originLang || guessedLang;

      for (const caption of captions) {
        if (caption.snippet.trackKind != 'ASR' && caption.snippet.language == fromLang) {
          originCaptionId = caption.Id;
        }
        if (caption.snippet.language == translationLang) {
          translationCaptionId = caption.id;
        }
      }

      return {
        originCaptionId,
        translationCaptionId,
        guessedLang,
      }
    });

  const tokenPromise = new Promise((resolve, reject) => {
    // We are serverless, so we need to asc users connect their account???
    chrome.identity.getAuthToken({'interactive': true}, (token) => resolve(token))
  });

  const downloadCaption = (captionId, token) => {
    if (!captionId) return null;

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
      const originController = new Caption({caption: originCaption, time});
      const translationController = new Caption({caption: translationCaption, time});
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
          const originSb = originController.getTextAndTime();

          return {
            time: originSb.startTime,
            duration: originSb.duration,
            origin: originSb.text,
            translation: translationController.getTextAndTime().text,
          }
        },
        prepend: () => {
          originController.prepend();
          translationController.prepend();
          onUpdate();
        },
        append: () => {
          originController.append();
          translationController.append();
          onUpdate();
        },
      };

      return videoObject;
    });
};
