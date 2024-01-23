import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../../FirebaseSetup/firebaseConfig';

function AvailableVenues() {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    // Fetch available venues from the backend
    const fetchVenues = async () => {
      try {
        const firestore = getFirestore(app);
        const venuesCollection = collection(firestore, 'venues');
        const venuesSnapshot = await getDocs(venuesCollection);

        const venuesData = venuesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVenues(venuesData);
      } catch (error) {
        console.error('Error fetching venues:', error.message);
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Available Venues</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {venues.map((venue) => (
          <div key={venue.id} className="col">
            <div className="card h-100">
              <img src={venue.image} alt={`Venue ${venue.block}`} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{venue.block} Block</h5>
                <p className="card-text">Room : {venue.roomNumber}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableVenues;
