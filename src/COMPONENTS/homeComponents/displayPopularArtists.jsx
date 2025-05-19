import { useEffect, useState } from "react";
import classes from "./homeComponent.module.scss";

import {
  musicGenres,
  dailyMusicGenre,
} from "../defaultPage/searchInput/inputInformation";

const EventIcon = ({ displayArtist, eventDay }) => {
  const date = eventDay?.dates?.start?.localDate;

  return (
    <div
      className={classes.artistContainer}
      style={{ opacity: displayArtist ? "1" : "0" }}
    >
      <h2>{date}</h2>
    </div>
  );
};

const ArtistSection = ({ isHovering, event }) => {
  const [displayArtist, setDisplayArtist] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (
      (isHovering && !hasStarted) ||
      (hasStarted && displayArtist < event?.events?.length)
    ) {
      if (!hasStarted) setHasStarted(true);

      const timer = setTimeout(() => {
        setDisplayArtist((prev) => prev + 1);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isHovering, displayArtist, hasStarted]);

  return (
    <div className={classes.artistsContainer}>
      {event?.events.map((event, index) => (
        <EventIcon
          key={index}
          displayArtist={index < displayArtist}
          eventDay={event}
        />
      ))}
    </div>
  );
};

const CenterGenreButton = ({}) => {
  const dayInWeekNumber = new Date().getDay();
  const todaysGenre = dailyMusicGenre[dayInWeekNumber - 1];

  return (
    <div className={classes.genreList}>
      <div>
        <h4>{todaysGenre}</h4>
      </div>
    </div>
  );
};

const CenterSection = ({ setIsHovering, events }) => {
  console.log(events);
  return (
    <div className={classes.centerSection}>
      <CenterGenreButton />
      <div className={classes.circleContainer}>
        {events.map((artist, index) => (
          <div
            className={classes.circleContentContainer}
            onMouseEnter={() => setIsHovering((prevN) => [...prevN, index + 1])}
            key={index}
          >
            <p>{artist.artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SideSection = ({ isHovering, event }) => {
  return (
    <div className={classes.sideSectionContainer}>
      <div className={classes.sideSection}>
        <div className={classes.sideSectionArtists}>
          <ArtistSection isHovering={isHovering} event={event} />
        </div>
      </div>
    </div>
  );
};

const LeftSection = ({ isHovering, events }) => {
  return (
    <div className={classes.leftSection}>
      <div className={`${classes.leftTop}`}>
        <SideSection
          isHovering={isHovering.some((n) => n === 3)}
          event={events[0]}
        />
      </div>
      <div className={classes.leftBottom}>
        <SideSection
          isHovering={isHovering.some((n) => n === 1)}
          event={events[1]}
        />
      </div>
    </div>
  );
};

const RightSection = ({ isHovering, events }) => {
  return (
    <div className={classes.rightSection}>
      <div className={classes.rightTop}>
        <SideSection
          isHovering={isHovering.some((n) => n === 4)}
          event={events[0]}
        />
      </div>
      <div className={classes.rightBottom}>
        <SideSection
          isHovering={isHovering.some((n) => n === 2)}
          event={events[1]}
        />
      </div>
    </div>
  );
};

const DisplayFamousArtistsComponent = ({ eventsArray }) => {
  const [isHovering, setIsHovering] = useState([]);
  const [activeGenre, setActiveGenre] = useState("");

  // To decide which genre is today based on the day of the week.
  const [genreOfToday, setGenreOfToday] = useState("");

  // An object containing 4 artists and their next 3 concerts
  const [artistsOfToday, setArtistsOfToday] = useState([]);

  useEffect(() => {
    const localArray = [];

    if (!eventsArray || eventsArray.length === 0) return;

    for (let i = 0; i < eventsArray?.length; i++) {
      const artistEvent = eventsArray?.[i];

      if (artistEvent.otherEvents.length === 2) {
        localArray.push({
          artist: artistEvent.artist,
          events: [artistEvent.event, ...artistEvent.otherEvents],
        });
      }

      if (localArray.length === 4) break;
    }

    setArtistsOfToday(localArray);
  }, [eventsArray]);

  return (
    <div className={classes.displayFamousArtistsContainer}>
      <div>
        <h1>See whats currently trending</h1>
      </div>
      <div className={classes.displayFamousArtistsWrapper}>
        <div className={classes.artstSectionLeft}>
          <LeftSection
            isHovering={isHovering}
            events={[artistsOfToday[0], artistsOfToday[1]].filter(Boolean)}
          />
        </div>
        <CenterSection setIsHovering={setIsHovering} events={artistsOfToday} />
        <div>
          <RightSection
            isHovering={isHovering}
            events={[artistsOfToday[2], artistsOfToday[3]].filter(Boolean)}
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayFamousArtistsComponent;
