import React, { useEffect, useState } from "react";
import ArtistPageComponent from "../COMPONENTS/artistPageComponents/artistPageComponent";

const ArtistPage = React.memo(function ArtistPage({
  artistEvents,
  artist,
  interestedArtists,
  setInterestedArtists,
  eventsArray,
  setArtist,
}) {
  return (
    <ArtistPageComponent
      artistEvents={artistEvents}
      artist={artist}
      interestedArtists={interestedArtists}
      setInterestedArtists={setInterestedArtists}
      eventsArray={eventsArray}
      setArtist={setArtist}
    />
  );
});

export default ArtistPage;
