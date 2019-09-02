export default googleTranslate

function googleTranslate ({q, source, target}) {
  fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${q}`)
    .then(r => r.json())
    .then(r => console.log('r', r) || r[0][0][0]);
}

googleTranslate({q: 'hello', source: 'en', target: 'ru'})
