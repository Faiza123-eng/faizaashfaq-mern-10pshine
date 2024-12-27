import Home from "./pages//Home/Home";
import SignUp from "./pages/Signup/SignUp";
import Login from "./pages/Login/Login";
import{BrowserRouter as Router,Routes,Route} from "react-router-dom";


const App=() =>{
  return( 
    <div>
      <Home/>
      <Login/>
      <SignUp/>
    </div>
    )
}

export default App;
