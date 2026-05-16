// src/styles/login/stylesLogin.js
import FondoLogin from "../../assets/FondoLogin.png";

export const styles = {
  root: (theme) => ({
    height: "100vh",
    display: "flex",
    backgroundColor: theme.palette.background.default,
  }),

  branding: (theme) => ({
    flex: 1,
    display: { xs: "none", md: "flex" },
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    color: "white",
    p: 6,
    // Imagen de fondo
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${FondoLogin})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 0,
    },
    // Overlay con el gradiente encima de la imagen
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: `linear-gradient(160deg,
        ${theme.palette.primary.main}CC 0%,
        ${theme.palette.secondary.main}DD 100%)`,
      zIndex: 1,
    },
  }),

  brandingContent: {
    position: "relative",
    zIndex: 2, // encima del overlay
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  loginBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    p: 3,
  },

  card: {
    width: 420,
    borderRadius: 4,
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    p: 3,
  },
};