export const generateGuid = (greatnessDegree = 3) => {
  const getRndNum36 = () => (+Math.random().toString().split('.')[1]).toString(36);

  let str = '';
  for (let i = 0; i < greatnessDegree; i++) {
    str += getRndNum36();
  }

  return str;
};
