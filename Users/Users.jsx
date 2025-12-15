/*

import "./Users.css"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../Utils/Socketio.js";

export default function Users() {
  const socket = createSocketConnection();
  const [users, setUsers] = useState([]);
  const loggedInUser = useSelector((store) => store?.user?.User);
  
  const [accountUser, setAccountUser] = useState()
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true)
  const GET_USERS_URL =
    "http://localhost:5491" || "https://chat-app-backend-2-ab1j.onrender.com";
  const navigate = useNavigate();
   const socketRef = useRef(null);
  async function getUsers() {
    
    try {
      
      const res = await fetch("http://localhost:5491/users" , {
        credentials: "include"
      });
     if(!res.ok) {
        throw new Error("Failed to load users");
     }
      
      const data = await res.json();

      if (!data.users || data.users.length === 0) {
        throw new Error("No user here");
      } 

      setUsers(data.users);
      setAccountUser(data.accountUser)
      //const accounthandler = JSON.parse(localStorage.getItem("user"))
      //setAccountUser(accounthandler.User)
      console.log(data.accountUser.name + " logged in")
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false)
    }
  }
   useEffect(() => {
    if(!loggedInUser) {
      navigate("Login")
    }
   },[loggedInUser])


  useEffect(() => {
    getUsers();
    socketRef.current = createSocketConnection();
    return () => {
      if(socketRef.current) {
        socketRef.current.disconnect();
      }
    }
    // 👇 Re-register user as online when page refreshes
    
  }, [loggedInUser]);

  
socket.on("update-online", ({ userId, status }) => {
  setUsers(prev =>
    prev.map(user =>
      user._id.toString() === userId.toString()
        ? { ...user, status } // spread all user properties and update status
        : user
    )
  );
});
socket.on("update-offline", ({ userId, statusOffline }) => {
  setUsers(prev =>
    prev.map(user =>
      user._id.toString() === userId.toString()
        ? { ...user, status: statusOffline} // spread all user properties and update status
        : user
    )
  );
});


  function getUserId(id) {
    navigate("/chat/" + id);
  }

  async function logOut() {
    try {
      const loggedOut = await fetch("http://localhost:5491/logout", {
        method: "POST",
        credentials: "include"
      });
      if (!loggedOut.ok) {
        alert("logout failed");
      }

      alert("logout successful");
    
      console.log(accountUser?.name + " logged out");
      socket.emit("user-logout", accountUser)
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  }

  function changeValue() {
    setIsActive(!isActive);
  }


  
  return (
    <div>
      <div className={isActive ? "menu showmenu" : "menu"}>
        <button onClick={logOut}>logout</button>
      </div>
      <nav>
        <h1>Users</h1>
        <div className="right">
          <p>{accountUser?.name}</p>
          <button onClick={changeValue}>
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>
      <div id="userContainer">
        <ul id="userList">
      
          <li>
                <div className="icon"></div>
                <div className="content">
                  <p className="userName"></p>
                  <p
                    className="status"
                    style={{
                    color: 'green' }}
                  >online
                  </p>
                </div>
                <button className="chat">
                  Chat
                </button>
              </li>
          {
           loading ?
             (<p id="loading">Loading users....</p>)
           :
           users && users?.map((user, index) => {
          
            return (
              <li key={index}>
                <div className="icon"></div>
                <div className="content">
                  <p className="userName">{user?.name}</p>
                  <p
                    className="status"
                    style={{
                      color: user.status === "online" ? "green" : "darkgrey"
                    }}
                  >
                    {user.status}
                  </p>
                </div>
                <button onClick={() => getUserId(user._id)} className="chat">
                  Chat
                </button>
              </li>
            );
          })} 
         
        </ul>
      </div>
    </div>
  );
}
  */



import "./Users.css"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../Utils/Socketio.js";

export default function Users() {

  const [users, setUsers] = useState([]);
  const loggedInUser = useSelector((store) => store?.user?.User);
  
  const [accountUser, setAccountUser] = useState()
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const GET_USERS_URL =
    "http://localhost:5491" || "https://chat-app-backend-2-ab1j.onrender.com";
  const navigate = useNavigate();
  
  async function getUsers() {
    
    try {
      
      const res = await fetch("https://react-messaging-app-backend.onrender.com/users" , {
        credentials: "include"
      });
     if(!res.ok) {
        throw new Error("Failed to load users");
     }
      
      const data = await res.json();

      if (!data.users || data.users.length === 0) {
        throw new Error("No user here");
      } 

      setUsers(data.users);
      setAccountUser(data.accountUser)
  
      console.log(data.accountUser.name + " logged in")
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false)
    }
  }
   
  useEffect(() => {
    getUsers();
   const socket = createSocketConnection();
   socketRef.current = socket
    return () => {
      if(socketRef.current) {

socketRef.current.on("update-online", ({userId, userStatus}) => {
  setUsers(prev =>
    prev.map(user =>
      user._id.toString() === userId.toString()
        ? { ...user, status: userStatus } // spread all user properties and update status
        : user
    )
  );
});
socketRef.current.on("update-offline", ({userId, userStatus}) => {
  setUsers(prev =>
    prev.map(user =>
      user._id.toString() === userId.toString()
        ? { ...user, status: userStatus} // spread all user properties and update status
        : user
    )
  );
});
      }
    }
  }, []);



  function getUserId(id) {
    navigate("/chat/" + id);
  }

  async function logOut() {
    try {
      const loggedOut = await fetch("https://react-messaging-app-backend.onrender.com/logout", {
        method: "POST",
        credentials: "include"
      });
      socketRef.current.emit("user-logout", {userId: loggedInUser?._id, firstName: loggedInUser?.names})
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  }

  function changeValue() {
    setIsActive(!isActive);
  }


  
  return (
    <div>
      <div className={isActive ? "menu showmenu" : "menu"}>
        <button onClick={logOut}>logout</button>
      </div>
      <nav>
        <h1>Users</h1>
        <div className="right">
          <p>{accountUser?.name}</p>
          <button onClick={changeValue}>
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>
      <div id="userContainer">
        <ul id="userList">
    
          {
           loading ?
             (<p id="loading">Loading users....</p>)
           :
           users && users?.map((user, index) => {
          
            return (
              <li key={index}>
                <div className="icon"></div>
                <div className="content">
                  <p className="userName">{user?.name}</p>
                  <p
                    className="status"
                    style={{
                      color: user.status === "online" ? "#00A86B" : "darkgrey"
                    }}
                  >
                    {user.status}
                  </p>
                </div>
                <button onClick={() => getUserId(user._id)} className="chat">
                  Chat
                </button>
              </li>
            );
          })} 
         
        </ul>
      </div>
    </div>
  );
}
  