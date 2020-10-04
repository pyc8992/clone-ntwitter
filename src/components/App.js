import React, {useState} from "react";
import AppRouter from './AppRouter';
import { authService } from "../fbase";

function App() {
  console.log();

  const [ isLoggedIn, setIsLoggedIn ] = useState(authService.currentUser);

  return (
    <div> 
      <AppRouter isLoggedIn={isLoggedIn}/>
      <footer>&copy; {new Date().getFullYear()} Clone Ntwitter</footer>
    </div>
  );
}

export default App;
