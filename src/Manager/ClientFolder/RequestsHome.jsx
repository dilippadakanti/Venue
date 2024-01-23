import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import app from '../../FirebaseSetup/firebaseConfig';

function RequestsHome() {
  const [currentRequests, setCurrentRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const firestore = getFirestore(app);
      
      // Fetch current requests
      const currentRequestsQuery = query(collection(firestore, 'requests'));
      const currentRequestsSnapshot = await getDocs(currentRequestsQuery);
      const currentRequestsData = currentRequestsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCurrentRequests(currentRequestsData);

      // Fetch approved requests
      const approvedRequestsQuery = query(collection(firestore, 'approved'));
      const approvedRequestsSnapshot = await getDocs(approvedRequestsQuery);
      const approvedRequestsData = approvedRequestsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setApprovedRequests(approvedRequestsData);
    };

    fetchRequests();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Current Requests</h2>
      <div className="row">
        {currentRequests.map((request) => (
          <div key={request.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Requested By: {request.userEmail}</h5>
                <p className="card-text"><strong>Block:</strong> {request.block}</p>
                <p className="card-text"><strong>Venue:</strong> {request.venueId}</p>
                <p className="card-text"><strong>Date:</strong> {request.date}</p>
                <p className="card-text"><strong>Start Time:</strong> {request.startTime}</p>
                <p className="card-text"><strong>End Time:</strong> {request.endTime}</p>
                <p className="card-text"><strong>Title:</strong> {request.eventTitle}</p>
                <p className="card-text"><strong>Description:</strong> {request.eventDescription}</p>
                <p className="card-text"><strong>Status:</strong> <br />
                  {request.isApprovedByDean ? ' Approved by Dean' : 'Not Approved By Dean'} <br />
                   {request.isApprovedByAdmin ? 'Approved by Block Head' :'Not Approved by Block Head'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
  
      <h2 className="mt-5">Approved Requests</h2>
      <div className="row">
        {approvedRequests.map((request) => (
          <div key={request.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Requested By: {request.userEmail}</h5>
                <p className="card-text"><strong>Block:</strong> {request.block}</p>
                <p className="card-text"><strong>Venue:</strong> {request.venueId}</p>
                <p className="card-text"><strong>Date:</strong> {request.date}</p>
                <p className="card-text"><strong>Start Time:</strong> {request.startTime}</p>
                <p className="card-text"><strong>End Time:</strong> {request.endTime}</p>
                <p className="card-text"><strong>Title:</strong> {request.eventTitle}</p>
                <p className="card-text"><strong>Description:</strong> {request.eventDescription}</p>
                <p className="card-text"><strong>Status:</strong> <br />
                  {request.isApprovedByDean ? ' Approved by Dean' : 'Not Approved By Dean'} <br />
                   {request.isApprovedByAdmin ? 'Approved by Block Head' :'Not Approved by Block Head'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

    }

export default RequestsHome;
