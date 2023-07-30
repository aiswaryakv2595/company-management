// color design tokens export
export const tokensDark = {
 
    grey: {
      0: "#ffff", // manually adjusted
      10: "#f6f6f6", // manually adjusted
      50: "#f0f0f0", // manually adjusted
      100: "#e0e0e0",
      200: "#c2c2c2",
      300: "#a3a3a3",
      400: "#858585",
      500: "#666666",
      600: "#525252",
      700: "#3d3d3d",
      800: "#292929",
      900: "#141414",
      1000: "#000000", // manually adjusted
    },
   
    primary: {
      // blue
      20: "#a1e1ec", //for statbox
      50:"#212a3e",
      100: "#d3d4de",
      200: "#a6a9be",
      300: "#7a7f9d",
      400: "#4d547d",
      500: "#21295c",
      600: "#000000", // manually adjusted
      700: "#141937",
      800: "#0d1025",
      900: "#070812",
    },
   
    secondary: {
      // yellow
      20: "#e1f3f9",
      50: "#f0f0f0", // manually adjusted
      100: "#fff6e0",
      200: "#ffedc2",
      // 300: "#ffe3a3",
      // 400: "#ffda85",
      300:"#35605A",
      500: "#ffd166",
      600: "#cca752",
      700: "#997d3d",
      800: "#665429",
      900: "#332a14",
      1000:"#ffffff"

    },
  };
  
  // function that reverses the color palette
  function reverseTokens(tokensDark) {
    const reversedTokens = {};
    Object.entries(tokensDark).forEach(([key, val]) => {
      const keys = Object.keys(val);
      const values = Object.values(val);
      const length = keys.length;
      const reversedObj = {};
      for (let i = 0; i < length; i++) {
        reversedObj[keys[i]] = values[length - i - 1];
      }
      reversedTokens[key] = reversedObj;
    });
    return reversedTokens;
  }
  export const tokensLight = reverseTokens(tokensDark);
  
  // mui theme settings
  // mui theme settings
export const themeSettings = () => {
  return {
    palette: {
      mode: "light",
      common: {
        white: "#ffffff", // Add the common.white color
      },
      primary: {
        ...tokensDark.primary,
        main: tokensDark.grey[50],
        light: tokensDark.grey[100],
      },
      secondary: {
        ...tokensDark.secondary,
        main: "#a1dbec",
        light: tokensDark.secondary[700],
      },
      neutral: {
        ...tokensDark.grey,
        main: tokensDark.grey[500],
      },
      background: {
        default: tokensDark.grey[0],
        alt: tokensDark.grey[50],
      },
      text: {
        primary: '#000', // Set the text color to white
      },
    },
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
