import React, { useRef, useState } from "react";
import classNames from "classnames/bind";
import style from "./Search.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";

import AccountItem from "./AccountItem/AccountItem";
import SuggetSearch from "./Sugget";
import { SearcSugget, ListAccount } from "~/components/datafake/data";
import HeaderPopper from "../Popper/HeaderPopper";
const listResult = SearcSugget;
const listAccount = ListAccount;

const cx = classNames.bind(style);
function SearchResult({ onClose }) {
  const [searchInput, setSearchInput] = useState("");

  const inputRef = useRef(null);

  const handleChangeSearch = (e) => {
    const newValue = e.target.value;
    if (newValue.trim() !== "" || newValue === "") {
      setSearchInput(newValue);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    inputRef.current.focus();
  };

  return (
    <>
      <HeaderPopper onClose={onClose}>Search</HeaderPopper>
      <div className={cx("search")}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          className={cx("input")}
          value={searchInput}
          onChange={(e) => handleChangeSearch(e)}
        />
        <div className={cx("action")}>
          {searchInput && (
            <button className={cx("btn-clear")} onClick={handleClearSearch}>
              <span>
                <FontAwesomeIcon icon={faCircleXmark} />
              </span>
            </button>
          )}
          {false && (
            <button className={cx("btn-spinner")}>
              <span>
                <FontAwesomeIcon icon={faSpinner} />
              </span>
            </button>
          )}
        </div>
      </div>
      <div className={cx("content")}>
        {!searchInput && <SuggetSearch data={listResult} />}
        {!searchInput && (
          <>
            <h4 className={cx("title-list")}>Accounts</h4>
            <ul className={cx("list-account")}>
              {listAccount.map((account, index) => (
                <li key={index} className={cx("account-item")}>
                  <AccountItem data={account} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default SearchResult;
