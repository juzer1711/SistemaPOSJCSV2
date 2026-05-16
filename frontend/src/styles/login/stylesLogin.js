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
    background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    color: "white",
    p: 6,
  }),
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