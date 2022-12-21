let nav = document.querySelector('nav');

if(getCurrentUser()) {
  nav.innerHTML = `
    <ul>
      <li><a href="bmi.html">Calculate</a></li>
      <li><a href="profile.html">Profile</a></li>
      <li><a id="logout-btn">Logout</a></li>
    </ul>
  `
} else {
  nav.innerHTML = `
    <ul>
      <li><a href="bmi.html">Calculate</a></li>
      <li><a href="login.html">Login</a></li>
      <li><a href="register.html">Sign Up</a></li>
    </ul>
  `
}

// Fetch method implementation:
export async function fetchData(route = '', data = {}, methodType) {
  const response = await fetch(`http://localhost:3000${route}`, {
    method: methodType, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  if(response.ok) {
    return await response.json(); // parses JSON response into native JavaScript objects
  } else {
    throw await response.json();
  }
} 

// logout event listener
let logout = document.getElementById("logout-btn");
if(logout) logout.addEventListener('click', removeCurrentUser)

// stateful mechanism for user
// logging in a user
export function setCurrentUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// getting current user function
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user'));
}

// logout function for current user
export function removeCurrentUser() {
  localStorage.removeItem('user');
  window.location.href = "login.html";
}

import { fetchData, setCurrentUser } from './main.js'

// user class
class User {
  constructor(userName, password, fullName) {
    this.userName = userName;
    this.password = password;
    this.fullName = fullName;
  }

  getUsername() {
    return this.userName;
  }
}

// login functionality
let loginForm = document.getElementById("login-form");
if(loginForm) loginForm.addEventListener('submit', login);

function login(e) {
  e.preventDefault();

  let userName = document.getElementById("username").value;
  let password = document.getElementById("pswd").value;
  let user = new User(userName, password);

  fetchData("/users/login", user, "POST")
  .then((data) => {
    setCurrentUser(data);
    window.location.href = "note.html";
  })
  .catch((err) => {
    let p = document.querySelector('.error');
    p.innerHTML = err.message;
  }) 
}
 
// register functionality
let regForm = document.getElementById("reg-form");
if(regForm) regForm.addEventListener('submit', register);

function register(e) {
  e.preventDefault();

  let userName = document.getElementById("username").value;
  let password = document.getElementById("pswd").value;
  let user = new User(userName, password);

  fetchData("/users/register", user, "POST")
  .then((data) => {
    setCurrentUser(data);
    window.location.href = "note.html";
  })
  .catch((err) =>{
    let p = document.querySelector('.error');
    p.innerHTML = err.message;
  })
}
//Note Functionality
class Note{
  constructor(noteContent) {
    this.noteContent = noteContent;
  }
  getNotes() {
    return this.noteContent;
  }
}
let user=getCurrentUser();
let note = document.getElementById("noteForm");
if(note) note.addEventListener('submit',notePageFunction)
function notePageFunction(e){
  e.preventDefault();
  let noted= document.getElementById('note').value;
  const note = new Note(noted);
  note.userID = user.userID;
  fetchData("/notes/create", note, "POST")
  .then((data) => {
    //setCurrentUser(data);
    alert("note added")
    window.location.href = "note.html";
  })
  .catch((err) =>{
    console.log(err);
  })
document.getElementById("noteForm").reset();
}
if(user&&note) getallnotes();

function getallnotes(){
let notedata =document.getElementById('note');
fetchData("/notes/getNote",user,"POST")
.then((data)=>{
  console.log(data);
  for(let i=0;i<data.length;i++){
    notedata.value+=data[i].noteContent;
  }
})
}


