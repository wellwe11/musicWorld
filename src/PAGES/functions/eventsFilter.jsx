// filters the events so it doesnt display a large amount of same events.
// in the coming days I will be storing their future dates as well, returning it to
// the object, and allowing it to be displayed such as "startDate - endDate"(endDate being the final day of the same "days")
// OR if possible, I will try to find final days of tour/event in the fetch
export const addEvents = (array, setter) => {
  // local array to save component from reloading
  const updatedArray = [];

  // create a new set to store unique id's which is related to events. Same events store the same ID, thus avoiding many of the same events to be displayed on the page.
  const idSet = new Set();

  // events.events is the original fetch
  array?.forEach((event) => {
    // add local variable for readable code
    const idToNotMatch = event?._embedded?.attractions?.[0]?.id;
    if (idToNotMatch && !idSet.has(idToNotMatch)) {
      idSet.add(idToNotMatch);
      updatedArray.push(event);
    }
  });

  if (updatedArray.length > 0) {
    // sort items by date
    const sortedUpdatedArray = updatedArray.sort((a, b) => {
      let numOne = a?.dates?.start?.localDate.toString("").replaceAll("-", "");
      let numTwo = b?.dates?.start?.localDate.toString("").replaceAll("-", "");

      return +numOne - +numTwo;
    });

    // finally push array to components local state
    setter(sortedUpdatedArray);
  }
};
