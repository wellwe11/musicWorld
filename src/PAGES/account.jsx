import AccountPageComponent from "../COMPONENTS/accountPage/accountPageComponent";
import classes from "./defaultPage.module.scss";

const AccountPage = ({}) => {
  return (
    <div className={classes.accountPage}>
      <AccountPageComponent />
    </div>
  );
};

export default AccountPage;
