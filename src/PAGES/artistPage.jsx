import { useEffect } from "react";

const ArtistPage = ({ artistEvents }) => {
  useEffect(() => {
    console.log(artistEvents);
  }, [artist]);
  return (
    <div>
      <h1>Artist name</h1>
    </div>
  );
};

export default ArtistPage;
