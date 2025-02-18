// Logo Import
import logo from "@src/assets/images/logo/logo.ico"


// You can customize the template with the help of this file
// Get user data from localStorage

const getUserData = () => {
  const userData = localStorage.getItem("ISLOGIN")
  return userData ? userData : null
}
getUserData()
//Template config options
const themeConfig = {
  app: {
    appName: "Dream Discover",
    appLogoImage: logo
  },
  layout: {
    isRTL: false,
    skin: "light", // light, dark, bordered, semi-dark
    type: "vertical", // vertical, horizontal
    contentWidth: "full", // full, boxed
    menu: {
      get isHidden() {
        return localStorage.getItem("ISLOGIN") !== 'ADMIN' // Dynamically check localStorage
      },
      isCollapsed: false
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: "floating", // static , sticky , floating, hidden
      backgroundColor: '' // BS color options [primary, success, etc]
    },
    footer: {
      type: "static" // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true, // Enable scroll to top button
    toastPosition: "top-right" // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  }
}

export default themeConfig
