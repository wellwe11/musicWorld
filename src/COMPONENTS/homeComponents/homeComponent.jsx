import classes from "./homeComponent.module.scss";

const EventsImagesWheel = ({ events }) => {
  console.log(events?.events?.[0]?.images?.[0]?.url);

  const logStuff = (e) => {
    console.log(e);
  };
  return (
    <div>
      {events?.events?.map((event, index) => (
        <>
          {index < 6 && (
            <div onClick={() => logStuff(event)}>
              <img src={event?.images?.[0]?.url} alt="" />
            </div>
          )}
        </>
      ))}
    </div>
  );
};

const HomePageComponent = ({ events }) => {
  return (
    <div className={classes.homePageComponentContainer}>
      <h1>Welcome home</h1>
      <EventsImagesWheel events={events} />
    </div>
  );
};

export default HomePageComponent;
