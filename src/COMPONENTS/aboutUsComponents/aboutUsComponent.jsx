import classes from "./aboutUsComponent.module.scss";
import { robinInformation } from "./aboutUsInfo";

import profileIcon from "./media/profile-user.png";

const ImageArea = () => {
  return (
    <div className={classes.bioImageContainer}>
      <img src={profileIcon} alt="" />
    </div>
  );
};

const TextSection = ({ profileKeys, profileObject }) => {
  return (
    <div className={classes.bioInfoContainer}>
      {profileKeys.map((section) => (
        <section key={section}>
          <h3>{section}:</h3>
          {typeof profileObject[section] === "object" &&
          !Array.isArray(profileObject[section]) ? (
            Object.entries(profileObject[section]).map(([key, value]) =>
              typeof value === "object" && value.icon && value.link ? (
                <div key={key}>
                  <a
                    href={value.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={value.icon} alt={`${key} icon`} width={20} />
                  </a>
                </div>
              ) : (
                <p key={key}>{value}</p>
              )
            )
          ) : (
            <p>{profileObject[section]}</p>
          )}
        </section>
      ))}
    </div>
  );
};

const Profile = ({ image, profileKeys, profileObject }) => {
  return (
    <section className={classes.profileSection}>
      <ImageArea image={image} />
      <TextSection profileKeys={profileKeys} profileObject={profileObject} />
    </section>
  );
};

const AboutUsComponent = () => {
  const robinInfo = Object.keys(robinInformation);
  return (
    <div className={classes.aboutUsComponent}>
      <Profile
        image={""}
        profileKeys={robinInfo}
        profileObject={robinInformation}
      />
    </div>
  );
};

export default AboutUsComponent;
