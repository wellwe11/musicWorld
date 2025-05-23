import classes from "./aboutUsComponent.module.scss";
import { robinInformation, websiteInformation } from "./aboutUsInfo";

import profileIcon from "./media/profile-user.png";

const ImageArea = ({ image }) => {
  return (
    <div className={classes.bioImageContainer}>
      {image && <img src={profileIcon} alt="" />}
    </div>
  );
};

const TextSection = ({ profileKeys, profileObject }) => {
  console.log(profileKeys, profileObject);
  return (
    <div className={classes.bioInfoContainer}>
      {profileKeys?.map((section, index) => (
        <section key={section || index}>
          {typeof profileObject[section] === "object" &&
          !Array.isArray(profileObject[section]) ? (
            Object.entries(profileObject[section]).map(([key, value]) =>
              typeof value === "object" && value.icon && value.link ? (
                <div key={key || value}>
                  <a href={value.link} target="_blank">
                    {value.link.length > 2 ? (
                      <img
                        src={value.icon}
                        alt={`${key || " "} icon`}
                        width={20}
                      />
                    ) : (
                      ""
                    )}
                  </a>
                </div>
              ) : (
                <p key={key}>{value}</p>
              )
            )
          ) : (
            <p>asd{profileObject[section]}</p>
          )}
        </section>
      ))}
    </div>
  );
};

const Profile = ({ image, profileKeys, profileObject }) => {
  return (
    <div className={classes.profileSection}>
      <ImageArea image={image} />
      <TextSection profileKeys={profileKeys} profileObject={profileObject} />
    </div>
  );
};

const AboutUsComponent = () => {
  const robinInfo = Object.keys(robinInformation);
  const websiteInfo = Object.keys(websiteInformation);
  return (
    <div className={classes.aboutUsComponent}>
      <Profile
        image={"asd"}
        profileKeys={robinInfo}
        profileObject={robinInformation}
      />

      <Profile
        image={""}
        profileKeys={websiteInfo}
        profileObject={websiteInformation}
      />
    </div>
  );
};

export default AboutUsComponent;
