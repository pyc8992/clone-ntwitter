import React, {useState, useEffect} from "react";
import AppRouter from './AppRouter';
import { authService } from "../fbase";

function App() {
  const [init, setInit] = useState(false);
  const [ isLoggedIn, setIsLoggedIn ] = useState(authService.currentUser);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }

  return (
    <div>
      { init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} /> : "initializing..."} 
      <footer>&copy; {new Date().getFullYear()} Clone Ntwitter</footer>
    </div>
  );
}

export default App;
