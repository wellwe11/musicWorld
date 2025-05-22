import { useEffect, useRef, useState } from "react";
import classes from "./accountPageComponent.module.scss";

const handleInput = (
  e,
  listItems,
  section,
  tab,
  input,
  changeInputValue,
  setListItems,
  setChangeInputValue
) => {
  console.log(e);
  if (e.key === "Enter" || e.mouse === 0) {
    console.log("asd");
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
  changeInputValue,
  setChangeInputValue,
}) => {
  return (
    <input
      value={changeInputValue}
      placeholder={`Change ${input}`}
      onChange={(e) => setChangeInputValue(e.target.value)}
      type={listValue.type}
      autoComplete={listValue?.autocomplete || ""}
    />
  );
};

const RadioInput = ({ listValue, changeInputValue, setChangeInputValue }) => {
  return (
    <input
      onChange={() => setChangeInputValue((prevState) => !prevState)}
      type={listValue.type}
      autoComplete={listValue?.autocomplete || ""}
      checked={changeInputValue}
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
  const handleChangeInputClicked = (e) => {
    e.preventDefault();
    setChangeInputClicked((prev) => !prev);
  };

  const [changeInputValue, setChangeInputValue] = useState("");
  const [changeradioValue, setChangeRadioValue] = useState(false);

  console.log(listItems, section, tab, input);
  return (
    <form
      onKeyDown={(e) =>
        handleInput(
          e,
          listItems,
          section,
          tab,
          input,
          changeInputValue,
          setListItems,
          setChangeInputValue
        )
      }
    >
      {inputValue.type !== "checkbox" ? (
        <div className={classes.changeInputButton}>
          <button onClick={(e) => handleChangeInputClicked(e)}>
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
              changeInputValue={changeInputValue}
              setChangeInputValue={setChangeInputValue}
            />
          )}
        </div>
      ) : (
        <div>
          <RadioInput
            tab={tab}
            input={input}
            listValue={inputValue}
            setListItems={setListItems}
            listItems={listItems}
            section={section}
            changeInputValue={changeradioValue}
            setChangeInputValue={setChangeRadioValue}
          />
        </div>
      )}
    </form>
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
