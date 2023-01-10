import React, { useEffect } from 'react'
import FormComponent from './components/FormComponent'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useStateValue } from './context/StateProvider'
import './App.css';
import { auth } from './config/firebase'
import Main from './components/Main';
import AddSchool from './components/AddSchool';
import Landing from './components/Landing';
import Admin from './components/Admin';
import View from './components/View';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [state, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // a user has logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // no user logged in
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (state.user !== null) {
      console.log(' logged in')
    }
  })

  console.log(state.user)


  return (
    <BrowserRouter>
      <div className="App">
        <Routes>

          <Route path='/view' element={<><Main /> <View /> </>} />
          <Route path="/" element={state.user !== null ? <><Main /><Landing /></> : <><Main /> <Landing /> </>} />
          <Route path="/manage" element={state.user !== null ? <><Main /> <Admin /></> : <> <Landing /> </>} />


        </Routes>

      </div>
    </BrowserRouter>
  );
}




export default App;
