import React from 'react';
import { useState } from 'react';
import app from '../FirebaseSetup/firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';

function Auth() {
  return (
    <div className='container-sm'>
      <div className="display-4 mt-4 text-center h5">Venue Booking System </div>
      <div className="mt-4 display-6 text-center">Login</div>
      <Login />

      <div className="my-4 text-center">(or)</div>

      <div className="mt-4 display-6 text-center">Signup</div>
      <div className=""></div>
      <SignUp />
    </div>
  );
}

function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async () => {
    if (loginEmail === '' || loginPassword === '') return;

    const auth = getAuth(app);

    console.log('Logging In');

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log('User Logged in successfully!');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center mt-4">
      <div className="row">
        <div className="col-md-6 container d-flex flex-column align-items-center justify-content-center">
          <input
            type="text"
            id='loginEmail'
            className="form-control"
            placeholder='Login with Email'
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            style={{ width: "300px" }}
          />
          <input
            type="password"
            id="loginPassword"
            placeholder='Password'
            className="form-control mt-3"
            value={loginPassword}
            onChange={(e) => { setLoginPassword(e.target.value) }}
            style={{ width: '300px' }}
          />
          <button type="button" onClick={handleLogin} className="mt-4 btn btn-primary">Login</button>
        </div>
      </div>
    </div>
  );
}

// ... (imports remain unchanged)

function SignUp() {
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [isDean, setIsDean] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSignUp = async () => {
    if (signUpEmail === '' || signUpPassword === '') return;

    const auth = getAuth(app);
    const firestore = getFirestore(app);

    console.log('Signing Up');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      const curUser = userCredential.user;

      // Save additional user data to Firestore
      const userData = {
        uid: curUser.uid,
        email: signUpEmail,
        isAdmin: isDean ? false : isAdmin, // If the user is a dean, isAdmin is false; otherwise, use isAdmin state
        isDean: isDean,
        block: isDean ? '' : (isAdmin ? selectedBlock : ''), // Block is applicable only if not a dean and isAdmin is true
      };

      // Assuming you have a 'users' collection in Firestore
      const userDocRef = doc(firestore, 'users', curUser.uid);
      await setDoc(userDocRef, userData);

      console.log('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center mt-4">
      <div className="row">
        <div className="col-md-6 container d-flex flex-column align-items-center justify-content-center">
          <input
            type="text"
            id='signUpEmail'
            className="form-control"
            placeholder='SignUp with Email'
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
            style={{ width: "300px" }}
          />
          <input
            type="password"
            id="signUpPassword"
            placeholder='Password'
            className="form-control mt-3"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
            style={{ width: '300px' }}
          />
          <div className="form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="isDean"
              checked={isDean}
              onChange={() => {
                setIsDean(!isDean);
                // Reset isAdmin state when changing to/from Dean
                setIsAdmin(false);
              }}
            />
            <label className="form-check-label" htmlFor="isDean">
              Dean
            </label>
          </div>
          {!isDean && (
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="isAdmin"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
              <label className="form-check-label" htmlFor="isAdmin">
                Admin
              </label>

              {isAdmin && (
                <div className="form-group mt-3" style={{width:'300px'}}>
                  <label htmlFor="selectBlock">Select Admin Block:</label>
                  <select
                    className="form-control"
                    id="selectBlock"
                    value={selectedBlock}
                    onChange={(e) => setSelectedBlock(e.target.value)}
                  >
                    <option value="">Select Admin's Block</option>
                    <option value="A">A-block</option>
                    <option value="B">B-block</option>
                    <option value="C">C-block</option>
                    <option value="D">D-block</option>
                    <option value="E">E-block</option>
                    <option value="G">G-block</option>
                    <option value="H">H-block</option>
                  </select>
                </div>
              )}
            </div>
          )}
          <button type="button" onClick={handleSignUp} className="mt-4 btn btn-primary">Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
