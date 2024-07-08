import React, {
  useState,
  useEffect,
} from "react";
import { Route, Link, Switch } from "react-router-dom";
import axios from "axios";

import {
  UserContext,
  SiteInfoContext,
  PopoverContext,
  useSiteInfo,
} from "./Contexts";
import { AlertList, useErrorAlert } from "./components/Alerts";
import Game from "./pages/Game/Game";
import Play from "./pages/Play/Play";
import Community from "./pages/Community/Community";
import Learn from "./pages/Learn/Learn";
import Auth from "./pages/Auth/Auth";
import User, { Avatar, useUser } from "./pages/User/User";
import Policy from "./pages/Policy/Policy";
import Fame from "./pages/Fame/Fame";
import Popover, { usePopover } from "./components/Popover";
import Chat from "./pages/Chat/Chat";

import "./css/main.css";
import { setCaptchaVisible } from "./utils";
import { NewLoading } from "./pages/Welcome/NewLoading";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, darkThemeHigherContrast } from "./constants/themes";
import { Announcement } from "./components/alerts/Announcement";
import { BadTextContrast } from "./components/alerts/BadTextContrast";
import { SiteNotifs } from "./components/alerts/SiteNotifs";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

export default function Main() {
  var cacheVal = window.localStorage.getItem("cacheVal");
  const [isLoading, setLoading] = useState(true);
  const [showChatTab, setShowChatTab] = useState(
    localStorage.getItem("showChatTab") == "false" ? false : true
  );
  const [showAnnouncementTemporarily, setShowAnnouncementTemporarily] =
    useState(false);

  if (!cacheVal) {
    cacheVal = Date.now();
    window.localStorage.setItem("cacheVal", cacheVal);
  }

  const user = useUser();
  const siteInfo = useSiteInfo({
    alerts: [],
    cacheVal,
  });
  const popover = usePopover(siteInfo);
  const errorAlert = useErrorAlert(siteInfo);

  function onGameLeave(index) {
    axios
      .post("/game/leave")
      .then(() => {
        siteInfo.hideAlert(index);
      })
      .catch(errorAlert);
  }

  var userColourScheme = "dark";

  if (userColourScheme === "light") {
    if (document.documentElement.classList.contains("dark-mode")) {
      document.documentElement.classList.remove("dark-mode");
    }
    document.documentElement.classList.add("light-mode");
  } else if (userColourScheme === "dark") {
    if (document.documentElement.classList.contains("light-mode")) {
      document.documentElement.classList.remove("light-mode");
    }
    document.documentElement.classList.add("dark-mode");
  } else if (userColourScheme === "auto") {
    if (document.documentElement.classList.contains("light-mode")) {
      document.documentElement.classList.remove("light-mode");
    }
    document.documentElement.classList.add("dark-mode");
  }

  const [theme, setTheme] = useState();
  useEffect(() => {
    if (user?.settings?.accessibilityTheme === "Higher Contrast") {
      setTheme(darkThemeHigherContrast);
    } else {
      setTheme(darkTheme);
    }
  }, [user]);

  var roleIconScheme = user.settings?.roleIconScheme
    ? user.settings.roleIconScheme
    : "vivid";

  let toClear = ["role-icon-scheme-noir", "role-icon-scheme-vivid"];
  for (let scheme of toClear) {
    if (document.documentElement.classList.contains(scheme)) {
      document.documentElement.classList.remove(scheme);
    }
  }
  document.documentElement.classList.add(`role-icon-scheme-${roleIconScheme}`);

  useEffect(() => {
    async function getInfo() {
      try {
        var res = await axios.get("/user/info");

        if (res.data.id) {
          setCaptchaVisible(false);

          axios.defaults.headers.common["x-csrf"] = res.data.csrf;
          axios.post("/user/online");

          res.data.loggedIn = true;
          res.data.loaded = true;
          res.data.rank = Number(res.data.rank);
          user.set(res.data);

          var referrer = window.localStorage.getItem("referrer");

          if (referrer) {
            axios.post("/user/referred", { referrer });
            window.localStorage.removeItem("referrer");
          }
        } else {
          user.clear();
          setCaptchaVisible(true);
        }

        if (res.data.nameChanged === false) {
          siteInfo.showAlert(
            () => (
              <div>
                New account created, you can change your username once in your{" "}
                <Link to={`/user/settings`}>settings</Link>.
              </div>
            ),
            "basic",
            true
          );
        }

        if (res.data.inGame) {
          siteInfo.showAlert(
            (index) => (
              <div>
                Return to game{" "}
                <Link to={`/game/${res.data.inGame}`}>{res.data.inGame}</Link>{" "}
                or <a onClick={() => onGameLeave(index)}>leave</a>.
              </div>
            ),
            "basic",
            true
          );
        }

        res = await axios.get("/roles/all");
        siteInfo.update("roles", res.data);

        res = await axios.get("/roles/raw");
        siteInfo.update("rolesRaw", res.data);

        res = await axios.get("/roles/modifiers");
        siteInfo.update("modifiers", res.data);
      } catch (e) {
        errorAlert(e);
      } finally {
        setLoading(false);
      }
    }

    getInfo();

    var onlineInterval = setInterval(() => {
      axios.post("/user/online");
    }, 1000 * 30);

    return () => {
      clearInterval(onlineInterval);
    };
  }, []);

  if (isLoading) {
    return <NewLoading />;
  }

  return (
    <UserContext.Provider value={user}>
      <SiteInfoContext.Provider value={siteInfo}>
        <PopoverContext.Provider value={popover}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Switch>
              <Route path="/game">
                <Game />
              </Route>
              <Route path="/">
                <div className="site-wrapper">
                  <div className="main-container">
                    <Header
                      setShowChatTab={setShowChatTab}
                      setShowAnnouncementTemporarily={
                        setShowAnnouncementTemporarily
                      }
                    />
                    <Announcement
                      showAnnouncementTemporarily={showAnnouncementTemporarily}
                      setShowAnnouncementTemporarily={
                        setShowAnnouncementTemporarily
                      }
                    />
                    <BadTextContrast
                      colorType="username"
                      color={user?.settings?.warnNameColor}
                    />
                    <BadTextContrast
                      colorType="text"
                      color={user?.settings?.warnTextColor}
                    />

                    <div className="inner-container">
                      <Switch>
                        <Route path="/play" render={() => <Play />} />
                        <Route path="/learn" render={() => <Learn />} />
                        <Route path="/community" render={() => <Community />} />
                        <Route path="/auth" render={() => <Auth />} />
                        <Route path="/user" render={() => <User />} />
                        <Route path="/policy" render={() => <Policy />} />
                        <Route path="/fame" render={() => <Fame />} />
                      </Switch>
                    </div>
                    <Footer />
                    <AlertList />
                    {showChatTab && <Chat
                    setShowChatTab={setShowChatTab} 
                    SiteNotifs={SiteNotifs}  />}
                  </div>
                </div>
              </Route>
            </Switch>
            <Popover />
          </ThemeProvider>
        </PopoverContext.Provider>
      </SiteInfoContext.Provider>
    </UserContext.Provider>
  );
}
