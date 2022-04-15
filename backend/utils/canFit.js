const canFit = (item, space) => {
  const {width: x, length: y, height: z} = item;
  const {width: a, length: b, height: c} = space;

  const caseA = a >= x && ((b >= y && c >= z) || (b >= z && c >= y));
  const caseB = a >= y && ((b >= x && c >= z) || (b >= z && c >= x));
  const caseC = a >= z && ((b >= x && c >= y) || (b >= y && c >= x));

  return caseA || caseB || caseC;
};

module.exports = {
  canFit,
};
