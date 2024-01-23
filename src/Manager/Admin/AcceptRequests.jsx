import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import app from '../../FirebaseSetup/firebaseConfig';

function AcceptRequests({ email, block }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const firestore = getFirestore(app);
    const requestsCollection = collection(firestore, 'requests');

    try {
      const requestsSnapshot = await getDocs(requestsCollection);
      const requestsData = requestsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching requests:', error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveRequest = async (requestId) => {
    const firestore = getFirestore(app);
    const requestDocRef = doc(firestore, 'requests', requestId);

    try {
      // Update the document based on user role
      if (block === 'dean') {
        await updateDoc(requestDocRef, { isApprovedByDean: true });
      } else if (block && email) {
        // Assuming the user is an admin of a specific block
        const adminBlockRequests = requests.filter((request) => request.block === block);
        const adminRequest = adminBlockRequests.find((request) => request.id === requestId);
        if (adminRequest) {
          await updateDoc(requestDocRef, { isApprovedByAdmin: true });
        }
      }

      // After approving, refresh the requests
      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Accept Requests</h2>
      <div className="row">
        {requests.map((request) => (
            (request.block === block) || (block=='dean') &&
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
                {((block==='dean' && !request.isApprovedByDean) || (block===request.block && !request.isApprovedByAdmin)) && (
                  <button className="btn btn-primary" onClick={() => handleApproveRequest(request.id)}>
                    Approve Request
                  </button> 
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AcceptRequests;
