/*
 import "./Chat.css"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { createSocketConnection } from "../Utils/Socketio.js"

export default function Userchats() {
  const userInStore = useSelector((store) => store.user)
  const loggedInUser = userInStore?.User._id;
//const loggedInUser = JSON.parse(localStorage.getItem("user"))?.User?._id;
const loggedInUserName = JSON.parse(localStorage.getItem("user"))?.User?.name;
  const userName = userInStore?.User?.name;
  const navigate = useNavigate();
  // ensure nested User object
  const { id } = useParams()
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setTyping] = useState(false);
  const [userId, setUserId] = useState("");
  const loggedInUserId = loggedInUser ? loggedInUser.toString() : "";

  const typingTimeoutRef = useRef(null);


  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = createSocketConnection();
    return () => {
      socketRef.current.disconnect();
    }
  },[])
  
  async function getUser() {
    try {
      const isUser = await fetch("http://localhost:5491/chat/" + id, {
        credentials: "include"
      })
      if (!isUser.ok) {
        alert("User not found")
        return
      }
      const user = await isUser.json()
      setName(user?.user?.name)
      setStatus(user?.user?.status)
      console.log(user?.user?.name)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUser()
  }, [id])

  useEffect(() => {
    // only connect when both values are available
    if (!loggedInUser || !id) {
      console.log("⚠️ Waiting for both loggedInUser and id before connecting")
      return
    }

    socketRef.current.on("connect", () => {
      
      socketRef.current.emit("joinChat", {firstName: userName, loggedInUser, id })
    })

    socketRef.current.on("disconnect", () => {
      console.log("❌ Disconnected")
    })

socketRef.current.on("messageReceived", ({firstName, text, senderId}) => {
 // if (senderId === loggedInUser) return;
  console.log(firstName + ": " + text)
setMessage((prev) => [...prev, {text, senderId}]);
})

   
  }, [loggedInUser, id])   // runs only when both are set
const sendMessage = (message) => {
 
  socketRef.current.emit("sendMessage", {
    firstName: userName,
    senderId: loggedInUser,
    id,
    text: newMessage
  })
  setMessage((prev) => [...prev, {text: newMessage, senderId: loggedInUser} ])
  setNewMessage("")
}
socketRef?.current?.on("displayTyping", ({username, typing, userTyping}) => {
   // console.log(username + " is typing: " + typing)
  //  console.log("loggedInUser: " + loggedInUser)
   // console.log("id: " + id)
   
   if(userTyping.toString("") !== loggedInUser.toString("")) {
   console.log(username + " is typing: " + typing)

   }
   setTyping(typing);
setUserId(userTyping)
})
  return (
    
    <div id="chatContainer">
      <nav id="topbar">
        <button id="back" onClick={()=>navigate("/")}><i className="fa-solid fa-arrow-left"></i></button>
        <div id="content">
          <p id="name">{name}</p>
          <p id="status">{status}</p>
        </div>
      </nav>
      <section>
        <div id="chatSection">

          
{message?.map((msg, index) => {
  const isSender = msg.senderId === loggedInUser;
  console.log(JSON.stringify(msg))
// check if current user sent it
  return (
    <div 
      key={index} 
      className={`message ${isSender ? "myMessage" : "otherMessage"}`}
    >
      {msg.text}
    </div>
  )
})}
         
        </div>

    <div id="typingIndicator" className={ userId !== loggedInUserId &&  isTyping ? "showTyping" : "hideTyping"} >typing...</div>

        <div id="input">
          <input value={newMessage} onChange={(e)=>{setNewMessage(e.target.value);
        
             socketRef.current.emit("userTyping", {username: userName, typing: true, loggedInUser, id});
             if(typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
         }
         typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit("userTyping",{username: userName, typing: false, loggedInUser, id})
         }, 1000)
          }} type="text" />
          <button onClick={sendMessage} id="send">send</button>
        </div>
      </section>
    </div>
  )
}
*/


import "./Chat.css"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { createSocketConnection } from "../Utils/Socketio.js"

export default function Userchats() {
 
  const userInStore = useSelector((store) => store.user)
  const loggedInUserId = userInStore?.User._id;
  const loggedInUserName = userInStore?.User?.name;

  const navigate = useNavigate();
  const { targetUserId } = useParams()
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setTyping] = useState(false);
  const [userId, setUserId] = useState("");
  const isIdDifferent = targetUserId?.toString() !== userId?.toString();
  async function getUser() {
    try {
      const isUser = await fetch("https://react-messaging-app-backend.onrender.com/chat/" + targetUserId, {
        credentials: "include"
      })
      if (!isUser.ok) {
        alert("User not found")
        return
      }
      const user = await isUser.json()
      setName(user?.user?.name)
      setStatus(user?.user?.status)
      console.log(user?.user?.name)
    } catch (error) {
      console.log(error)
    }
  }
const socketRef = useRef(null);

useEffect(() => {
  getUser();

const socket = createSocketConnection();
  socketRef.current = socket;

  
  socketRef.current.on("connect", () => {
    socketRef.current.emit("joinChat", {
      firstName: loggedInUserName,
      loggedInUserId,
      targetUserId
    });
  });
  socketRef.current.on("messageReceived", ({firstName, text, senderId}) => {
   // console.log(firstName + ": " + text + " from " + senderId)
    setMessages(prev => [...prev, {firstName, text, senderId}])
  //console.log(JSON.stringify(messages))
  
  })

  socketRef.current.on("update-online", ({userId, userStatus}) => {
    if(userId.toString() === targetUserId.toString()) {
      setStatus(userStatus)
    }
  })
  socketRef.current.on("update-offline", ({userId, userStatus}) => {
    if(userId.toString() === targetUserId.toString()) {
      setStatus(userStatus)
    }
    
  })
   socketRef.current.on("typingResponse", ({userName, isTyping, userTypingId}) => {
    const isIdSame = loggedInUserId.toString() === userTypingId.toString();
    if(isIdSame) {
     console.log(userName + " is typing: " + isTyping + " from " + userTypingId)
    }
    setTyping(isTyping);
    setUserId(userTypingId);
    })
  
  return () => {
    socketRef.current.disconnect()
  }
}, []);
 

 /* useEffect(() => {
    console.log(JSON.stringify(messages))
  }, [messages]) */
  
  const sendMessage = () => {
 // const socket = createSocketConnection();
  socketRef.current.emit("sendMessage", {firstName: loggedInUserName, senderId: loggedInUserId, targetUserId, text: newMessage})
  setNewMessage("")
  
  }
   const timeoutRef = useRef(null);
  const sendIndicator = (event) => {
   
    
  }

const typingTimeoutRef = useRef(null);
  return (
    
    <div id="chatContainer">
      <nav id="topbar">
        <button id="back" onClick={()=>navigate("/")}><i className="fa-solid fa-arrow-left"></i></button>
        <div id="content">
          <p id="name">{name}</p>
          <p id="status">{status}</p>
        </div>
      </nav>
      <section>
        <div id="chatSection">

          
{messages?.map((msg, index) => {

  const isSender = msg.senderId === loggedInUserId;
  
  console.log(msg.text)
  return (
    <div 
      key={index} 
      className= {`message ${isSender ? "myMessage" : "otherMessage"}`}
    >
      {msg.text}
    </div>
  )
})}
         
        </div>

    <div id="typingIndicator" className={ isIdDifferent && isTyping ? "showTyping" : "hideTyping"}>typing...</div>

        <div id="input">
          <input value={newMessage} onChange={(e)=>{ setNewMessage(e.target.value);

        socketRef.current.emit("userTyping", {userName: loggedInUserName, isTyping: true, loggedInUserId, targetUserId});
        if(typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
          socketRef.current.emit("userTyping", {userName: loggedInUserName, isTyping: false, loggedInUserId, targetUserId})
        }, 1000)
          }} type="text" />
          <button id="send" onClick={() => sendMessage()}>send</button>
        </div>
      </section>
    </div>
  )
}