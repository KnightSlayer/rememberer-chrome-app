import { youtubeApiKey } from '../../keys'

const vidoyId = 'Yocja_N5s1IYocja_N5s1I';
const captionId = 'TLlfC6fxsMkNxTGbh5uc_PSHfRrtHqFh';
const captionId2 = 'iA80G5cFenkN7wCVdVBQqUh2FiJq37-mJCHN-PM7MGc=';



console.log('${youtubeApiKey}', youtubeApiKey)
'GET https://www.googleapis.com/youtube/v3/captions?part=id&videoId=Yocja_N5s1I&key={YOUR_API_KEY}';
const captureUrl = `https://www.googleapis.com/youtube/v3/captions/iA80G5cFenkN7wCVdVBQqUh2FiJq37-mJCHN-PM7MGc%3D?key=${youtubeApiKey}`;
const chanelsUrl = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails';
const capturesExampleUrl = `https://content.googleapis.com/youtube/v3/captions?part=snippet&videoId=Yocja_N5s1I&key=${youtubeApiKey}`


const theUrl = `https://www.googleapis.com/youtube/v3/captions/iA80G5cFenkN7wCVdVBQqUh2FiJq37-mJCHN-PM7MGc=?key=${youtubeApiKey}`;

chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
  console.log('token', token);

  // fetch(theUrl, {
  //   withCredentials: true,
  //   headers: new Headers({
  //     Authorization: 'Bearer ' + token,
  //     Accept: 'application/json',
  //   }),
  // })
  //   .then(r => r.text())
  //   .then(r => console.log('fetch r',r))
  //   .catch(e => console.log('e',e));
});


export default 21
