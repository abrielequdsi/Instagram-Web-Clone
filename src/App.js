import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from "react-instagram-embed";


function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);


  useEffect(() => {
    // Gonna Listen , if any auth change happen , log in out create
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser); // will keep track of everytime the page is refresh
        if (authUser.displayName) {
          //dont update username
        } else {
          // if we just created someone....
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // user has logged out....
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]) //the useEffect , will listen to the user and username
  //everytime you include a variable inside , you must include it here as a dependency
  // so the code update when the value get revised






  // useEffect --> Runs Once when we launch the app // Runs a piece of code based on as specific condition
  useEffect(() => {
    // This will executed everytime the page is refreshes
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //  Every time a new post is added , this code fires (snapShot)
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);
  // [] -> indicates the situation when the code will be executed







  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }





  return (
    <div className="app">






      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" >
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            </center>
            <Input type="text" onChange={(e) => setUsername(e.target.value)} value={username} placeholder="username" />
            <Input type="text" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="email" />
            <Input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password" />
            <Button type="submit" onClick={signUp}>SignUp</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" >
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            </center>
            <Input type="text" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="email" />
            <Input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password" />
            <Button type="submit" onClick={signIn}>SignIn</Button>
          </form>
        </div>
      </Modal>








      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""></img>

        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) : <div className="app__logininContainer">
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          </div>
        }


      </div>





      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }

        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/CCf9aDsghRf/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>








      {/* specifying the id , so that react won't render all the docs (posts). Only one added object (new post), not all */}



      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
          <h3>Sorry you need to login to upload</h3>
        )}



    </div>
  );
}

export default App;
