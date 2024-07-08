import React from "react";
import { Icon } from "@iconify/react";

export function Footer() {
  let year = new Date().getYear() + 1900;

  return (
    <div className="footer">
      <div className="footer-inner">
        {/*<a*/}
        {/*  href="https://discord.gg/C5WMFpYRHQ"*/}
        {/*  target="blank"*/}
        {/*  style={{*/}
        {/*    display: "flex",*/}
        {/*    justifyContent: "center",*/}
        {/*    alignItems: "flex-end",*/}
        {/*    color: "var(--theme-color-text)",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <i className="fab fa-discord" />*/}
        {/*  <Box sx={{ mx: 0.5 }}>Join us on Discord</Box>*/}
        {/*  <i className="fab fa-discord" />*/}
        {/*</a>*/}
        <div
          style={{
            fontSize: "xx-large",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "8px",
          }}
        >
          <a
            href="https://github.com/UltiMafia/Ultimafia"
            style={{ display: "flex", opacity: 0.5 }}
            rel="noopener noreferrer nofollow"
          >
            <i className="fab fa-github" />
          </a>
          <a
            href="https://www.patreon.com/Ultimafia/membership"
            style={{ display: "flex", opacity: 0.5 }}
            rel="noopener noreferrer nofollow"
          >
            <i className="fab fa-patreon" />
          </a>
          <a
            href="https://ko-fi.com/ultimafia"
            style={{ display: "flex", opacity: 0.5 }}
            rel="noopener noreferrer nofollow"
          >
            <Icon icon="simple-icons:kofi" />
          </a>
          <a
            href="https://discord.gg/C5WMFpYRHQ"
            target="blank"
            rel="noopener noreferrer nofollow"
          >
            <Icon
              icon="simple-icons:discord"
              style={{ color: "#5865F2", display: "flex", opacity: 1 }} />
          </a>
        </div>
        <div className="footer-inner" style={{ opacity: 0.5 }}>
          <span>
            Built on code provided by
            <a
              style={{ color: "var(--theme-color-text)" }}
              href="https://github.com/r3ndd/BeyondMafia-Integration"
              rel="noopener noreferrer nofollow"
            >
              rend
            </a>
          </span>
          <span>
            <a
              target="_blank"
              href="https://www.youtube.com/@fredthemontymole"
              rel="noopener noreferrer nofollow"
            >
              <i className="fab fa-youtube"></i> Featuring music by FredTheMole
            </a>
          </span>
          <div>© {year} UltiMafia</div>
        </div>
      </div>
    </div>
  );
}
