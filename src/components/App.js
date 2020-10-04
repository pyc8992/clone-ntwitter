import React, {useState, useEffect} from "react";
import AppRouter from './AppRouter';
import { authService } from "../fbase";

function App() {
  const [init, setInit] = useState(false);
  const [ isLoggedIn, setIsLoggedIn ] = useState(authService.currentUser);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, []);

  return (
    <div>
      { init ? <AppRouter isLoggedIn={isLoggedIn}/> : "initializing..."} 
      <footer>&copy; {new Date().getFullYear()} Clone Ntwitter</footer>
    </div>
  );
}

export default App;
