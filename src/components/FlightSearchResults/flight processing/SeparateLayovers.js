//divide the  route into two parts, going and return
const SeparateLayovers = (route) => {
  let goingLayovers = [];
  let returnLayovers = [];
  let isReturn = false;

  //If the 'cityFrom' of the stop is the same as the destination city of the first flight it means we reached the return journey.
  for (const r of route) {
    if (r.return === 0) {
      goingLayovers.push(r);
    } else {
      returnLayovers.push(r);
      isReturn = true;
    }
  }

  return {
    goingLayovers,
    returnLayovers,
    isReturn,
  };
};

export default SeparateLayovers;
