export const styles = {
  page: {
    p: { xs: 2, sm: 3, md: 4 },
    backgroundColor: "background.default",
    minHeight: "100vh",
  },

  welcomeBar: (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 2,
    p: 3,
    mb: 4,
    borderRadius: 3,
    backgroundColor: "background.paper",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    borderLeft: `5px solid ${theme.palette.primary.main}`,
  }),

  sectionLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "text.disabled",
    mb: 1.5,
    mt: 1,
  },

  card: {
    height: "100%",
    borderRadius: 3,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    border: "1px solid",
    borderColor: "divider",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 28px rgba(0,0,0,0.10)",
    },
    display: "flex",
    flexDirection: "column",
  },

  cardContent: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    p: 2.5,
  },

  iconWrapper: (bgColor) => ({
    width: 52,
    height: 52,
    borderRadius: 2.5,
    backgroundColor: bgColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 2,
  }),

  roleBadge: (theme) => ({
    backgroundColor: theme.palette.primary.light + "22",
    color: theme.palette.primary.dark,
    fontWeight: 600,
    fontSize: "0.72rem",
    letterSpacing: "0.08em",
    px: 2,
    py: 0.5,
    borderRadius: 10,
    border: `1px solid ${theme.palette.primary.light}`,
  }),
};