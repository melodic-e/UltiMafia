import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useLayoutEffect
} from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { SiteInfoContext } from "../../Contexts";
import {
  NotificationHolder,
  useOnOutsideClick,
  Time
} from "../Basic";
import { useNotifInfoReducer } from "./useNotifInfoReducer";

export function SiteNotifs() {
  const [showNotifList, setShowNotifList] = useState(false);
  const [notifInfo, updateNotifInfo] = useNotifInfoReducer();
  const [nextRestart, setNextRestart] = useState();
  const siteInfo = useContext(SiteInfoContext);
  const history = useHistory();

  const bellRef = useRef();
  const notifListRef = useRef();

  useOnOutsideClick([bellRef, notifListRef], () => setShowNotifList(false));

  useEffect(() => {
    getNotifs();
    var notifGetInterval = setInterval(() => getNotifs(), 10 * 1000);
    return () => clearInterval(notifGetInterval);
  }, []);

  useEffect(() => {
    if (showNotifList) viewedNotifs();
  }, [notifInfo.notifs]);

  useEffect(() => {
    if (nextRestart && nextRestart > Date.now()) {
      var restartMinutes = Math.ceil((nextRestart - Date.now()) / 1000 / 60);
      siteInfo.showAlert(
        `The server will be restarting in ${restartMinutes} minutes.`,
        "basic",
        true
      );
    }
  }, [nextRestart]);

  useLayoutEffect(() => {
    if (!showNotifList) return;

    const listRect = notifListRef.current.getBoundingClientRect();
    const listRight = listRect.left + listRect.width;

    if (listRight > window.innerWidth)
      notifListRef.current.style.left = window.innerWidth - listRight + "px";

    notifListRef.current.style.visibility = "visible";
  });

  function getNotifs() {
    axios
      .get("/notifs")
      .then((res) => {
        var nextRestart = res.data[0];
        var notifs = res.data.slice(1);

        setNextRestart(nextRestart);

        updateNotifInfo({
          type: "add",
          notifs: notifs,
        });
      })
      .catch(() => { });
  }

  function viewedNotifs() {
    axios
      .post("/notifs/viewed")
      .then(() => {
        updateNotifInfo({ type: "viewed" });
      })
      .catch(() => { });
  }

  function onShowNotifsClick() {
    setShowNotifList(!showNotifList);

    if (!showNotifList && notifInfo.unread > 0) viewedNotifs();
  }

  function onNotifClick(e, notif) {
    if (!notif.link) e.preventDefault();
    else if (window.location.pathname === notif.link.split("?")[0])
      history.go(0);
  }

  const notifs = notifInfo.notifs.map((notif) => (
    <Link
      className="notif"
      key={notif.id}
      to={notif.link}
      onClick={(e) => onNotifClick(e, notif)}
    >
      {notif.icon && <i className={`fas fa-${notif.icon}`} />}
      <div className="info">
        <div className="time">
          <Time millisec={Date.now() - notif.date} suffix=" ago" />
        </div>
        <div className="content">{notif.content}</div>
      </div>
    </Link>
  ));

  return (
    <div className="notifs-wrapper">
      <NotificationHolder
        lOffset
        notifCount={notifInfo.unread}
        onClick={onShowNotifsClick}
        fwdRef={bellRef}
      >
        <i className="fas fa-bell" />
      </NotificationHolder>
      {showNotifList && (
        <div className="notif-list" ref={notifListRef}>
          {notifs}
          {notifs.length === 0 && "No unread notifications"}
        </div>
      )}
    </div>
  );
}
