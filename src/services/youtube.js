import { youtubeApiKey } from '../../keys'

const vidoyId = 'Yocja_N5s1I';
const captionId1 = 'TLlfC6fxsMkMNiXR_JDSyxU4pYV9Aehn';
const captionId2 = 'iA80G5cFenkN7wCVdVBQqUh2FiJq37-mJCHN-PM7MGc='; // auto generated



const capturesListUrl = `https://content.googleapis.com/youtube/v3/captions?part=snippet&videoId=${vidoyId}&key=${youtubeApiKey}`
const captureUrl = `https://www.googleapis.com/youtube/v3/captions/${captionId1}?key=${youtubeApiKey}&tfmt=sbv`;


// We are serverless, so we need to asc users connect their account???
chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
  fetch(captureUrl, {
    headers: new Headers({
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    }),
  })
    .then(r => r.text())
    .then(r => parseSbvCaption(r))
    .catch(e => console.log('e',e));
});

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
