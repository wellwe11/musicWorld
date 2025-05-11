import { useEffect, useState } from "react";
import ArtistPageComponent from "../COMPONENTS/artistPageComponents/artistPageComponent";

const ArtistPage = ({
  artistEvents,
  artist,
  interestedArtists,
  setInterestedArtists,
  loading,
}) => {
  return (
    <ArtistPageComponent
      artistEvents={artistEvents}
      artist={artist}
      interestedArtists={interestedArtists}
      setInterestedArtists={setInterestedArtists}
    />
  );
};

export default ArtistPage;
