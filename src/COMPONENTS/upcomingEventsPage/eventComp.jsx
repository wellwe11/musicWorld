import classes from "./upcomingEvents.module.scss";

const Event = ({ title, date, image, location }) => {
  return (
    <div className={classes.event}>
      <h4>{title}</h4>
      <h5>{date}</h5>
      <h6>{location}</h6>
      <img src={image.url} alt="" />
    </div>
  );
};

export default Event;
