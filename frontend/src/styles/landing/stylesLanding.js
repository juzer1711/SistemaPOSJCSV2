import { styles as loginStyles } from "../login/stylesLogin";

export const styles = {

  root: loginStyles.root,

  branding: loginStyles.branding,

  brandingContent: loginStyles.brandingContent,

  card: {
    ...loginStyles.card,
    maxWidth: 550
  },

  contentBox: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 4
  }

};