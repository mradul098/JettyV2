import logo from '../logo.svg';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {NavBar} from "./NavBar"
import {Banner} from "./Banner"
import {useEffect, useState} from "react"
import Axios from "axios";

import {incNumber} from "./actions";
import {decNumber} from "./actions";

import { useSelector, useDispatch } from "react-redux";

function Home() {
  const [listofUsers,setlistofUsers]=useState([]);
  const changeTheNumber = useSelector(state => state.changeTheNumber);
  
  const dispatch = useDispatch();
  useEffect(()=>{
    Axios.post("api/auth/", {         
        email: "kira5@dn.com",
        password: "12345678@aA"
    }).then(function(response) {
      console.log('Authenticated');
    }).catch(function(error) {
      console.log(error);
      console.log('Error on Authentication');
    });
  },[]);

  return (
    <div className="App">
      <NavBar/>
      
      <Banner/>
      <div class="quantity">
        <a class="quantity__minus" title="Decrement" onClick={() => dispatch(decNumber())}><span>-</span></a>
        <input name="quantity" type="text" class="quantity__input" value={changeTheNumber} />
        <a class="quantity__plus" title="Increment" onClick={() => dispatch(incNumber())}><span>+</span></a>
      </div>
      {listofUsers.map((user)=>{
          return(
            <div>

              {user.name}
            </div>
          )
      })}
      fei
    </div>
  );
}

export default Home;
