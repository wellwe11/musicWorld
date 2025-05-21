import { useEffect, useRef, useState } from "react";
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
    if (e.key === "Enter") {
      e.preventDefault();

      const updatedLists = {
        ...listItems,
        [section]: {
          ...listItems[section],
          [tab]: {
            ...listItems[section][tab],
            [input]: {
              ...listItems[section][tab][input],
              initial: changeInputValue,
            },
          },
        },
      };

      setListItems(updatedLists);
      setChangeInputValue("");
    }
  };

  return (
    <input
      onKeyDown={handleInput}
      value={changeInputValue}
      placeholder={`Change ${input}`}
      onChange={(e) => setChangeInputValue(e.target.value)}
      type={listValue.type}
      autoComplete={listValue?.autocomplete || ""}
    />
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

  const handleChangeInputClicked = () => setChangeInputClicked((prev) => !prev);

  return (
    <div className={classes.changeInputButton}>
      <button onClick={handleChangeInputClicked}>
        <h4>Change {input}</h4>
      </button>

      {changeInputClicked && (
        <form>
          <ChangeInput
            tab={tab}
            input={input}
            listValue={inputValue}
            setListItems={setListItems}
            listItems={listItems}
            section={section}
          />
        </form>
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
  console.log(section, listItem, tab, listItems);
  return (
    <div className={classes.activeAccountTabContainer}>
      {Object.keys(listItem)?.length > 0 ? (
        <div className={classes.tabsSection}>
          <h2>{tab}</h2>
          {Object.keys(listItem)?.map((subItem, index) => (
            <div className={classes.subItem} key={index}>
              <h4>
                {subItem}:{" "}
                {listItem[subItem]?.type === "password" ||
                listItem[subItem]?.type === "new-password"
                  ? listItem[subItem]?.initial.replace(/[a-zA-Z0-9]/g, "*")
                  : listItem[subItem]?.initial}
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

const AccountPageComponent = ({}) => {
  const [activeTab, setActiveTab] = useState({});

  const [listItems, setListItems] = useState({
    Account: {
      "User information": {
        Email: {
          initial: "dragonSlayerX2000@hotmail.com",
          type: "email",
        },
        Username: {
          initial: "Destroyer of worlds",
          type: "text",
        },
        Password: {
          initial: "iamfockingcool",
          type: "password",
          autocomplete: "new-password",
        },
      },
    },
    Subscription: {
      "Manage subscription": {},
    },
    Location: {
      "Update location": {},
    },
    "Linked accounts": {
      "Manage linked accounts": {},
    },
  });

  const listKeys = Object.keys(listItems);

  return (
    <div className={classes.accountPageContainer}>
      <ListContainer
        listKeys={listKeys}
        listItems={listItems}
        setActiveTab={setActiveTab}
      />
      <ActiveAccountTab
        section={activeTab?.section || ""}
        tab={activeTab?.tab || ""}
        listItem={listItems?.[activeTab?.section]?.[activeTab?.tab] || {}}
        listItems={listItems}
        setListItems={setListItems}
      />
    </div>
  );
};

export default AccountPageComponent;
