// caption - то, что вернет Caption.parsePlain
// time - int, секунды. // TODO: переделать на float
function Caption({caption, time}) {
  const initIndex = Caption.getSubIndex({caption, time});

  const theEntity = {
    indexFrom: initIndex,
    indexTo: initIndex,

    getTextAndTime: () => Caption.getTextAndTime({caption, fromIndex: theEntity.indexFrom, toIndex: theEntity.indexTo}),
    prepend: () => theEntity.indexFrom = Math.max(theEntity.indexFrom - 1, 0),
    append: () => theEntity.indexTo = Math.min(+theEntity.indexTo + 1, caption.length - 1)
  };

  return theEntity;
};

Caption.parsePlain = (plainCaption) => {
  function getSeconds(timeStr) {
    const [, h, m, s] = timeStr.match(/^(\d):(\d\d):(\d\d)\.\d\d\d$/);

    return +s + m*60 + h*3600;
  }
  let res = Array.from(new Set( // Set to remove duplicates
    plainCaption.split('\n\n')
    .map( str => str.trim())
  ))
    .map( sub => sub.match(/(\d:\d\d:\d\d\.\d\d\d),(\d:\d\d:\d\d\.\d\d\d)\s*((.|\s)*)/))
    .filter( matchRes => matchRes)
    .map(matchRes => ({
      from: getSeconds(matchRes[1]),
      to: getSeconds(matchRes[2]),
      text: matchRes[3].trim().replace(/\s+/g, ' '),
    }))
    .filter(sb => sb.text);

  return res;
};

Caption.getSubIndex = ({caption, time}) => {
  // TODO: caption is sorted, so I can use here binary search later
  for (const index in caption) {
    if (time >= caption[index].from && time <= caption[index].to) {
      return index;
    }
  }
};

Caption.getTextAndTime = ({caption, fromIndex, toIndex}) => {
  let text = '';

  for (let i = fromIndex; i <= toIndex; i++) {
    if (text) text += ' ';
    text += caption[i].text;
  }

  return {
    text,
    startTime: caption[fromIndex].from,
    duration: caption[toIndex].to - caption[fromIndex].from + 1,
  }
};

export default Caption
