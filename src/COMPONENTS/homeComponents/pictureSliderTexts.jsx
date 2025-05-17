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
      <h5>
        Let the rhythm spark as{" "}
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {bandName}
        </span>{" "}
        unleashes their electrifying take on{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {genre}
        </span>
        . Feel the pulse, the passion, and the power on{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {date}
        </span>
        —where music transcends sound and becomes sensation.
      </h5>
    ),

    textTwo: (
      <h5>
        Dive into the soundscape with{" "}
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {bandName}
        </span>
        , as they lead you deep into the essence of{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {genre}
        </span>
        . On{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {date}
        </span>
        , prepare for a journey through rhythm, story, and soul—music that
        lingers long after the final note.
      </h5>
    ),

    textThree: (
      <h5>
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {bandName}
        </span>{" "}
        channels raw emotion and refined sound in their signature{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {genre}
        </span>{" "}
        performance. Be there on{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {date}
        </span>{" "}
        for a show that stirs the spirit and moves the body.
      </h5>
    ),

    textFour: (
      <h5>
        Step into the vibrant world of{" "}
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {genre}
        </span>{" "}
        with{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {bandName}
        </span>
        , where every chord carries a story. Don’t miss their unforgettable live
        set on{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {date}
        </span>
        —music that resonates beyond the stage.
      </h5>
    ),

    textFive: (
      <h5>
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {bandName}
        </span>{" "}
        is ready to ignite the stage with their unmistakable{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {genre}
        </span>{" "}
        sound. Join them on{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {date}
        </span>{" "}
        and get swept into a sonic storm of grit, fire, and unforgettable
        rhythm.
      </h5>
    ),

    textSix: (
      <h5>
        On{" "}
        <span className={thickTextNr === 1 ? classes.thickText : ""}>
          {date}
        </span>
        ,{" "}
        <span className={thickTextNr === 2 ? classes.thickText : ""}>
          {bandName}
        </span>{" "}
        invites you into the heart of{" "}
        <span className={thickTextNr === 3 ? classes.thickText : ""}>
          {genre}
        </span>
        —a space where music becomes connection, movement, and celebration.
        Don’t just hear it—**feel** it.
      </h5>
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
