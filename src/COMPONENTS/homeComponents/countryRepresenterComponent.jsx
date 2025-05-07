import { useEffect, useState } from "react";
import { createClient } from "pexels";
import {
  bigCities,
  isoCountries,
} from "../defaultPage/searchInput/inputInformation";
import classes from "./homeComponent.module.scss";

const PexelsApiFetch = (country) => {
  const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
  const client = createClient(PEXELS_API_KEY);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    client.photos.search({ query: country, per_page: 1 }).then((photo) => {
      setImageUrl(photo?.photos[0].src.landscape);
    });
  }, [country]);

  return { imageUrl };
};

const MonthsContainer = ({
  eventsArray,
  displayedImage,
  setDisplayedImage,
  setDateFrom,
}) => {
  const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const today = new Date();

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  const amountOfDays = daysInMonth(todayYear, todayMonth, todayMonth);
  const [dailyMonths, setDailyMonths] = useState([]);
  const [canLoad, setCanLoad] = useState(false);

  const getMOnthlyDays = () => {
    const localArray = [];
    for (let i = 1; i <= amountOfDays; i++) {
      const getDay = new Date(
        `${todayYear}-${todayMonth < 10 ? "0" + todayMonth : todayMonth}-${
          i < 10 ? "0" + i : i
        }T23:15:30`
      );
      const dayName = getDay.toLocaleDateString("us-US", { weekday: "short" });

      localArray.push({
        day: dayName,
        dayNr: i,
        month: todayMonth,
        fullDate: getDay,
      });
    }

    setDailyMonths(localArray);
    setCanLoad(true);
  };

  const handleDisplayedImage = (n) => {
    console.log(n);
    setDateFrom(
      `${todayYear}-${todayMonth > 9 ? todayMonth : "0" + todayMonth}-${
        n > 9 ? n : "0" + n
      }`
    );
  };

  useEffect(() => {
    getMOnthlyDays();
  }, []);

  return (
    <div>
      {canLoad && (
        <div className={classes.datesContainer}>
          {dailyMonths.map((day, index) => (
            <div
              className={`${classes.dateWrapper} ${
                day.dayNr === todayDate
                  ? classes.todayHighLight
                  : index === todayDate + displayedImage &&
                    day.dayNr !== todayDate
                  ? classes.displayedImageNumber
                  : ""
              }`}
              onClick={() => handleDisplayedImage(index)}
            >
              <h4>{day.day}</h4>
              <h4>{day.dayNr}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CountryImageContainer = ({
  country,
  eventsArray,
  displayedImage,
  setDisplayedImage,
  setDateFrom,
}) => {
  const countryMatch = () =>
    Object.entries(isoCountries)?.find((obj) =>
      Object.values(obj)?.includes(country)
    );
  const countryName = countryMatch()[0];
  const fixedCountryName =
    countryName.charAt(0).toUpperCase() + countryName.slice(1);

  const { imageUrl } = PexelsApiFetch(countryName + " capital cityscape");

  return (
    <div className={classes.countryImageContainer}>
      <div className={classes.countryImageWrapper}>
        <img className={classes.countryImage} src={imageUrl} alt="" />
        <h1 className={classes.countryTitle}>{fixedCountryName}</h1>
      </div>
      <MonthsContainer
        eventsArray={eventsArray}
        displayedImage={displayedImage}
        setDisplayedImage={setDisplayedImage}
        setDateFrom={setDateFrom}
      />
    </div>
  );
};

export default CountryImageContainer;
