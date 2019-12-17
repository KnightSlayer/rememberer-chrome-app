export default googleTranslate

function googleTranslate ({q, source = 'en', target = 'ru'}) {
  return fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${q}`)
    .then(r => r.json())
    .then(r => r[0][0][0])
    // .then( r => console.log(r) || r);
}

// googleTranslate({q: 'hello', source: 'en', target: 'ru'})
