// filters the events so it doesnt display a large amount of same events.
// in the coming days I will be storing their future dates as well, returning it to
// the object, and allowing it to be displayed such as "startDate - endDate"(endDate being the final day of the same "days")
// OR if possible, I will try to find final days of tour/event in the fetch
export const addEvents = (array, setter) => {
  // local array to save component from reloading
  const updatedArray = [];

  // create a new set to store unique id's which is related to events. Same events store the same ID, thus avoiding many of the same events to be displayed on the page.
  const artistsArray = [];

  let canPush = false;
  // events.events is the original fetch
  array?.forEach((event) => {
    if (event?.classifications?.[0]?.segment?.name === "Music") {
      event?._embedded?.attractions?.forEach((artist) => {
        if (artist?.classifications?.[0]?.segment?.name === "Music") {
          // local variable for readable code
          const idToNotMatch = artist.id;
          if (
            idToNotMatch &&
            !artistsArray.some((a) => a.artist.id === idToNotMatch)
          ) {
            artistsArray.push({
              artist: artist,
              event: event,
              otherEvents: [],
            });
          } else {
            const artistObj = artistsArray?.find(
              (obj) => obj?.artist.name === artist?.name
            );

            if (artistObj) {
              artistObj.otherEvents.push({ event });
            }
          }
        }
      });
    }
    canPush = true;
  });

  if (canPush) {
    updatedArray.push(artistsArray);
  }

  if (updatedArray.length > 0) {
    console.log("will sort by time", updatedArray);
    // sort items by date
    const sortedUpdatedArray = updatedArray[0].sort((a, b) => {
      let numOne = a?.event?.dates?.start?.localDate
        .toString("")
        .replaceAll("-", "");
      let numTwo = b?.event?.dates?.start?.localDate
        .toString("")
        .replaceAll("-", "");

      return +numOne - +numTwo;
    });

    // finally push array to components local state
    return setter(sortedUpdatedArray);
  }
};
