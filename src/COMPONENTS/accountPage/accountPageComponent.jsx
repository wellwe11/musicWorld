import { useEffect, useState } from "react";
import classes from "./accountPageComponent.module.scss";

const ListContainer = ({ listKeys, listItems, setActiveTab }) => {
  return (
    <div className={classes.listContainer}>
      {listKeys.map((listItem) => (
        <section key={listItem}>
          <h3>{listItem}</h3>
          <ul className={classes.listSectionsContainer}>
            {Object.keys(listItems[listItem]).map((listValue, index) => (
              <li key={index}>
                <button
                  onClick={() =>
                    setActiveTab({
                      section: listItem,
                      tab: listValue,
                      sub: listItems[listItem][listValue],
                    })
                  }
                >
                  <h6>{listValue}</h6>
                  <div className={classes.underline}></div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

const ChangeInput = ({
  input,
  listValue,
  listItems,
  setListItems,
  tab,
  section,
}) => {
  const [changeInputValue, setChangeInputValue] = useState("");

  const handleInput = (e) => {
    e.preventDefault();

    const updatedLists = {
      ...listItems,
      [section]: {
        [tab]: {
          ...listItems[section][tab],
          [input]: changeInputValue.target.value,
        },
      },
    };

    setListItems(updatedLists);
  };

  return (
    <form onSubmit={(e) => handleInput(e)}>
      <input placeholder={`Change ${input}`} onChange={setChangeInputValue} />
    </form>
  );
};

const ChangeInputButton = ({
  input,
  inputValue,
  listItems,
  setListItems,
  tab,
  section,
}) => {
  const [changeInputClicked, setChangeInputClicked] = useState(false);

  const handleChangeInputClicked = () =>
    changeInputClicked
      ? setChangeInputClicked(false)
      : setChangeInputClicked(true);

  return (
    <div className={classes.changeInputButton}>
      <button onClick={handleChangeInputClicked}>
        <h4>Change {input}</h4>
      </button>

      {changeInputClicked && (
        <ChangeInput
          tab={tab}
          input={input}
          listValue={inputValue}
          setListItems={setListItems}
          listItems={listItems}
          section={section}
        />
      )}
    </div>
  );
};

const ActiveAccountTab = ({
  section,
  listItem,
  tab,
  listItems,
  setListItems,
}) => {
  return (
    <div className={classes.activeAccountTabContainer}>
      {Object.keys(listItem)?.length > 0 ? (
        <div className={classes.tabsSection}>
          <h2>{tab}</h2>
          {Object.keys(listItem)?.map((subItem, index) => (
            <div className={classes.subItem} key={index}>
              <h4>
                {subItem}: {listItem[subItem]}
              </h4>
              <ChangeInputButton
                input={subItem}
                inputValue={listItem[subItem]}
                setListItems={setListItems}
                listItems={listItems}
                tab={tab}
                section={section}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.listSection}>
          <h2>{tab}</h2>
        </div>
      )}
    </div>
  );
};

const AccountPageComponent = () => {
  const [activeTab, setActiveTab] = useState({});

  const [listItems, setListItems] = useState({
    Account: {
      "User information": {
        Email: "dragonSlayerX2000@hotmail.com",
        Username: "Destroyer of worlds",
        Password: "iamfockingcool",
      },
    },
    subscription: {
      "Manage subscription": {},
    },
    Notifications: {
      "Manage notifications": {},
    },
    location: {
      "Update location": {},
    },
    linkedAccounts: {
      "Manage linked accounts": {},
    },
  });

  const listKeys = Object.keys(listItems);

  useEffect(() => {
    console.log(listItems);
  }, [listItems]);

  return (
    <div className={classes.accountPageContainer}>
      <ListContainer
        listKeys={listKeys}
        listItems={listItems}
        setActiveTab={setActiveTab}
      />
      <ActiveAccountTab
        section={activeTab?.section || []}
        listItem={activeTab?.sub || []}
        tab={activeTab?.tab || []}
        listItems={listItems}
        setListItems={setListItems}
      />
    </div>
  );
};

export default AccountPageComponent;
