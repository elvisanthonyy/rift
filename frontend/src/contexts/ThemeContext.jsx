import { createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const handleThemeChange = () => {
    const newTheme = theme == "light" ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem("riftTheme", newTheme);
  };
  useEffect(() => {
    setTheme(localStorage.getItem("riftTheme"));
  }, []);
  return (
    <ThemeContext.Provider value={{ theme, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
