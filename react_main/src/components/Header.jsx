import React, {
  useState,
  useContext,
  useEffect
} from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { UserContext } from "../Contexts";
import { Nav } from "./Nav";
import UserNotifications from "../pages/User/UserNotifications";
import { SiteNotifs } from "./alerts/SiteNotifs";

export function Header({ setShowChatTab, setShowAnnouncementTemporarily }) {
  const user = useContext(UserContext);

  const openChatTab = () => {
    setShowChatTab(true);
    localStorage.setItem("showChatTab", true);
  };

  const openAnnouncements = () => {
    setShowAnnouncementTemporarily(true);
  };

  const [expandedMenu, setExpandedMenu] = useState(false);

  const toggleMenu = () => {
    setExpandedMenu(!expandedMenu);
  };

  const [smallWidth, setSmallWidth] = useState(window.innerWidth <= 700);

  const handleResize = () => {
    setSmallWidth(window.innerWidth <= 700);
  };

  const location = useLocation();

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      // smallWidth ? {
      // } : {
      // };
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    return () => {
      setExpandedMenu(false);
    };
  }, [location]);

  return (
    <div className="header">
      <Link to="/" className="logo-wrapper">
        <div className="logo" />
      </Link>
      <div className="navbar nav-wrapper" style={{ display: smallWidth === false ? 'none' : 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', fontSize: '24px', flexDirection: 'row' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, fontWeight: 'bold' }} onClick={toggleMenu}>
          <Icon icon="material-symbols:menu-rounded" style={{ marginRight: 8 }} />
          <span>
            {expandedMenu === false ? "Menu" : "Close"}
          </span>
        </div>
        {user.loggedIn && (
          <div className="nav" style={{ flexGrow: 0 }}>
            <div className="user-wrapper" style={{ display: 'flex', alignItems: 'flex-start' }}>
              <UserNotifications
                openChatTab={openChatTab}
                user={user}
                SiteNotifs={SiteNotifs} />
            </div></div>
        )}
      </div>
      <div className="nav-wrapper" style={{ display: smallWidth === true ? (expandedMenu ? 'flex' : 'none') : 'flex' }}>
        <Nav>
          {/* melodic-e: implement mobile-friendly menu
                TODO: refactor into css files (need help or more time to do it myself)
              */}
          <NavLink to="/play" className={"glow-on-hover"} style={expandedMenu ? { width: '100%' } : { width: 'auto' }}>
            <span>Play</span>
          </NavLink>
          <NavLink to="/community" className={"glow-on-hover"} style={expandedMenu ? { width: '100%' } : { width: 'auto' }}>
            <span>Community</span>
          </NavLink>
          <NavLink to="/fame" className={"glow-on-hover"} style={expandedMenu ? { width: '100%' } : { width: 'auto' }}>
            <span>Fame</span>
          </NavLink>
          <NavLink to="/learn" className={"glow-on-hover"} style={expandedMenu ? { width: '100%' } : { width: 'auto' }}>
            <span>Learn</span>
          </NavLink>
          <NavLink to="/policy" className={"glow-on-hover"} style={expandedMenu ? { width: '100%' } : { width: 'auto' }}>
            <span>Policy</span>
          </NavLink>
          {user.loggedIn && (
            <div className="user-wrapper" style={{ display: smallWidth === true ? 'none' : 'flex' }}>
              <UserNotifications
                openChatTab={openChatTab}
                user={user}
                SiteNotifs={SiteNotifs} />
            </div>
          )}
          {/* {!user.loggedIn && (
              <NavLink to="/auth" className="nav-link">
                Log In
              </NavLink>
            )} */}
          {/* TODO: is above REALLY necessary? */}
        </Nav>
      </div>
    </div>
  );
}
