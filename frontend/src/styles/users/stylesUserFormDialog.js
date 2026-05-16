export const styles = {
  dialog: {
    "& .MuiDialog-paper": {
      borderRadius: 3,
    },
  },

  dialogHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    pb: 1.5,
    borderBottom: "1px solid",
    borderColor: "divider",
  },

  sectionLabel: (theme) => ({
    fontSize: "0.68rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1.5,
    mt: 0.5,
    "&::after": {
      content: '""',
      flex: 1,
      height: "1px",
      backgroundColor: theme.palette.primary.light + "55",
    },
  }),

  grid2: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
    gap: 1.5,
    mb: 1.5,
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
    gap: 1.5,
    mb: 1.5,
  },

  changePasswordBtn: {
    borderStyle: "dashed",
    borderRadius: 2,
    py: 1.2,
    fontSize: 13,
  },

  dialogActions: {
    px: 3,
    py: 2,
    borderTop: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.default",
  },
};