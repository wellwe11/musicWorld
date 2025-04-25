import { useEffect, useState } from "react";
import classes from "./homeComponent.module.scss";

const PictureSliderTexts = ({ bandName, genre, date, index }) => {
  const [thickTextNr, setThickTextNr] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setThickTextNr((prev) => (prev < 3 ? prev + 1 : 1));
    }, 2500);

    return () => clearTimeout(timer);
  }, [thickTextNr]);

  const texts = {
    textOne: (
      <>
        Feel the rhythm ignite as{" "}
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {bandName}
        </span>{" "}
        brings their electrifying take on{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {genre}
        </span>{" "}
        to the stage. Don't miss the energy, passion, and soul on{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {date}
        </span>
        —where music becomes more than sound.
      </>
    ),
    textTwo: (
      <>
        Join{" "}
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {bandName}
        </span>{" "}
        as they transport you deep into the heart of{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {genre}
        </span>
        . On{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {date}
        </span>
        , they'll guide you through a journey of sound, stories, and powerful
        melodies that stay with you.
      </>
    ),
    textThree: (
      <>
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {bandName}
        </span>{" "}
        blends raw emotion and masterful sound in their{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {genre}
        </span>{" "}
        performance. Be there on{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {date}
        </span>{" "}
        and witness a show that moves the body and the spirit.
      </>
    ),
    textFour: (
      <>
        Step into the world of{" "}
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {genre}
        </span>{" "}
        with{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {bandName}
        </span>
        , where each chord tells a story. Catch their unforgettable live set on{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {date}
        </span>{" "}
        and feel the music like never before.
      </>
    ),
    textFive: (
      <>
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {bandName}
        </span>{" "}
        is set to light up the stage with their signature{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {genre}
        </span>{" "}
        style. On{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {date}
        </span>
        , let yourself get lost in their sound—a pulse of passion, grit, and
        musical fire.
      </>
    ),
    textSix: (
      <>
        On{" "}
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {date}
        </span>
        ,{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {bandName}
        </span>{" "}
        invites you to experience{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {genre}
        </span>{" "}
        at its most alive. It's more than a concert—it's a connection, a
        movement, and a celebration of sound.
      </>
    ),
  };

  return Object.values(texts)[index];
};

const BandText = ({ data, index }) => {
  const [bandName, setBandName] = useState(null);
  const [genre, setGenre] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    setBandName(data?._embedded?.attractions?.[0]?.name);
    setGenre(data?.classifications?.[0]?.genre?.name);
    const updatedDate = new Date(data?.dates?.start?.localDate);
    const newDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
    }).format(updatedDate);

    setDate(newDate);
  }, [data]);

  return (
    <div className={classes.bandTextContainer}>
      <PictureSliderTexts
        bandName={bandName}
        genre={genre}
        date={date}
        index={index}
      />
    </div>
  );
};

export default BandText;
