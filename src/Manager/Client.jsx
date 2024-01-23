import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { signOut, getAuth } from 'firebase/auth';
import app from '../FirebaseSetup/firebaseConfig';
import BookAVenue from './ClientFolder/BookVenue';
import RequestsHome from './ClientFolder/RequestsHome';

function Client({email}) {

    

  return (
    <div>
      <NavComponent email={email} />
      <Routes>
        <Route path='/' element={<RequestsHome /> } />
        <Route path="/booking" element={<BookAVenue email={email} />} />
      </Routes>
    </div>
  );
}

function NavComponent({email}){

    const handleLogOut = () => {
        const auth = getAuth(app)
        signOut(auth)
    }

    return (
        <Navbar bg="body-tertiary" expand="lg">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Venue Booking</Link>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="navbar-nav">
              <Nav.Item>
                <Link className="nav-link" to="/">Home</Link>
              </Nav.Item>
              <Nav.Item>
                <Link className="nav-link" to="/booking">Book a Venue</Link>
              </Nav.Item>

              <button onClick={handleLogOut} className="nav-link">Logout</button>



              <Nav.Item>
                <div className="nav-link">{email}</div>
              </Nav.Item>



            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    )
}


export default Client;
