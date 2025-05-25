import { useEffect, useState } from "react";
import { isoCountries } from "../defaultPage/searchInput/inputInformation";
import classes from "./homeComponent.module.scss";

import pexelsImageOne from "./images/pexels_imageOne.jpg";
import pexelsImage from "./images/pexels_imageFour.webp";
import { useNavigate } from "react-router-dom";

const MonthsContainer = ({
  eventsArray,
  displayedImage,
  setDateFrom,
  setDateTill,
}) => {
  const navigate = useNavigate();
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

  const handleNavigate = (link) => {
    navigate(`./${link}`);
  };

  const handleDisplayedImage = (n) => {
    const nClicked = n + 1;
    setDateFrom(
      `${todayYear}-${todayMonth > 9 ? todayMonth : "0" + todayMonth}-${
        nClicked > 9 ? nClicked : "0" + nClicked
      }`
    );

    handleNavigate("upcomingEvents");
  };

  useEffect(() => {
    getMOnthlyDays();
  }, []);

  console.log(dailyMonths, eventsArray[0]);

  return (
    <div className={classes.datesContainer}>
      {canLoad &&
        dailyMonths.map((day, index) => (
          <div
            className={`${classes.dateWrapper} ${
              day.dayNr === todayDate
                ? classes.todayHighLight
                : eventsArray.some(
                    (d, indexTwo) =>
                      d.day === day.dayNr &&
                      d.month === day.month &&
                      indexTwo === displayedImage
                  )
                ? classes.displayedImageNumber
                : ""
            }`}
            onClick={() => handleDisplayedImage(index)}
            key={`${day} ${index}`}
          >
            <h4>{day.day}</h4>
            <h4>{day.dayNr}</h4>
          </div>
        ))}
    </div>
  );
};

const CountryImageContainer = ({
  country,
  eventsArray,
  displayedImage,
  setDisplayedImage,
  setDateFrom,
  setDateTill,
}) => {
  const countryMatch = () =>
    Object.entries(isoCountries)?.find((obj) =>
      Object.values(obj)?.includes(country)
    );
  const countryName = countryMatch()[0];
  const fixedCountryName =
    countryName.charAt(0).toUpperCase() + countryName.slice(1);

  return (
    <div className={classes.countryImageContainer}>
      <div className={classes.countryImageWrapper}>
        <img className={classes.countryImage} src={pexelsImage} alt="" />
      </div>
      <MonthsContainer
        eventsArray={eventsArray}
        displayedImage={displayedImage}
        setDisplayedImage={setDisplayedImage}
        setDateFrom={setDateFrom}
        setDateTill={setDateTill}
      />
    </div>
  );
};

export default CountryImageContainer;
