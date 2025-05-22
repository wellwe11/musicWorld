import { useState } from "react";
import classes from "./accountPageComponent.module.scss";
import { isoCountries } from "../defaultPage/searchInput/inputInformation";

// this is to access and update listItems which contains specifics for inputs and how they manage their inputs
const handleInput = (
  listItems,
  section,
  tab,
  input,
  changeInputValue,
  setListItems
) => {
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
};

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
  listValue,
  section,
  tab,
  input,
  listItems,
  setListItems,
}) => {
  return (
    <input
      placeholder={"Change information..."}
      onKeyDown={(e) =>
        e.key === "Enter"
          ? handleInput(
              listItems,
              section,
              tab,
              input,
              e.target.value,
              setListItems
            )
          : ""
      }
      type={listValue.type || "text"}
      autoComplete={listValue?.autocomplete || ""}
    />
  );
};
const RadioInput = ({
  listValue,
  section,
  tab,
  input,
  listItems,
  setListItems,
}) => {
  return (
    <input
      onChange={(e) =>
        handleInput(
          listItems,
          section,
          tab,
          input,
          e.target.checked,
          setListItems
        )
      }
      type={listValue.type}
      autoComplete={listValue?.autocomplete || ""}
      checked={listValue.initial}
    />
  );
};
const ListInput = ({
  listValue,
  section,
  tab,
  input,
  listItems,
  setListItems,
}) => {
  const countries = Object.keys(isoCountries);

  return (
    <select
      value={listValue.initial}
      onChange={(e) =>
        handleInput(
          listItems,
          section,
          tab,
          input,
          e.target.value,
          setListItems
        )
      }
    >
      <option>{listValue.initial}</option>
      {countries.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
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
  const handleChangeInputClicked = (e) => {
    e.preventDefault();
    setChangeInputClicked((prev) => !prev);
  };

  return inputValue.type !== "checkbox" && !inputValue.extended ? (
    <div className={classes.changeInputButton}>
      <button onClick={(e) => handleChangeInputClicked(e)}>
        <h4>Change {input}</h4>
      </button>

      {changeInputClicked && (
        <ChangeInput
          listValue={inputValue}
          input={input}
          section={section}
          tab={tab}
          listItems={listItems}
          setListItems={setListItems}
        />
      )}
    </div>
  ) : inputValue.type === "checkbox" ? (
    <div>
      <RadioInput
        listValue={inputValue}
        input={input}
        section={section}
        tab={tab}
        listItems={listItems}
        setListItems={setListItems}
      />
    </div>
  ) : inputValue.extended ? (
    <ListInput
      listValue={inputValue}
      input={input}
      section={section}
      tab={tab}
      listItems={listItems}
      setListItems={setListItems}
    />
  ) : (
    ""
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
      "Manage subscription": {
        "Subscribe to our newsletter": {
          type: "checkbox",
          initial: true,
        },
      },
    },
    Location: {
      "Update location": {
        Location: {
          type: "text",
          initial: "Germany",
          extended: true,
        },
      },
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
