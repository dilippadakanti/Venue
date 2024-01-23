import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { signOut, getAuth } from 'firebase/auth';
import app from '../FirebaseSetup/firebaseConfig';
import CreateVenue from './Admin/CreateVenue';
import AcceptRequests from './Admin/AcceptRequests';

function Admin({block, email}) {
  return (
    <div>
        <NavComponent block={block} email={email}/>
        {block==='dean' && <p>Hello Dean,</p>}
        <Routes>
            <Route path='/' element={<AcceptRequests block={block} email={email} /> } />
            {block==='dean' && <Route path='/createvenue' element={<CreateVenue />} />}
        </Routes>
    </div>
  )
}


function NavComponent({block, email}){

    const handleLogOut = () => {
        const auth = getAuth(app)
        signOut(auth)
    }

    return (
        <Navbar bg="body-tertiary" expand="lg">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Venue Booking - Admin</Link>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="navbar-nav">
              <Nav.Item>
                <Link className="nav-link" to="/">Home</Link>
              </Nav.Item>
              { block==='dean' &&
                <Nav.Item>
                  <Link className="nav-link" to="/createvenue">Create a Venue</Link>
                </Nav.Item>
              }

              <button onClick={handleLogOut} className="nav-link">Logout</button>

              <div className="nav-link">{email}</div>



              {/* <Nav.Item>
                <Link className="nav-link" to="/pricing">Pricing</Link>
              </Nav.Item> */}



            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    )
}

export default Admin