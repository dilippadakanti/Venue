import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../FirebaseSetup/firebaseConfig';
import AvailableVenues from './AvailableVenues';

function BookAVenue({email}) {
  const [selectedBlock, setSelectedBlock] = useState('');
  const [venues, setVenues] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [beginningTime, setBeginningTime] = useState('');
  const [endingTime, setEndingTime] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventPoster, setEventPoster] = useState(null);
  const [eventDescription, setEventDescription] = useState('');

  

  useEffect(() => {
    // Fetch available venues based on the selected block
    const fetchVenues = async () => {
      const firestore = getFirestore(app);
      const venuesCollection = collection(firestore, 'venues');
  
      try {
        // Fetch unique blocks from venues
        const blocksSnapshot = await getDocs(venuesCollection);
        const uniqueBlocks = new Set(blocksSnapshot.docs.map((doc) => doc.data().block));
        setBlocks([...uniqueBlocks]);
  
        if (selectedBlock) {
          // Fetch venues for the selected block
          const venuesSnapshot = await getDocs(query(venuesCollection, where('block', '==', selectedBlock)));
          const venuesData = venuesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setVenues(venuesData);
  
          // Reset selected venue and room numbers
          setSelectedVenue('');
          setRoomNumbers([]);
        }
      } catch (error) {
        console.error('Error fetching venues:', error.message);
      }
    };
  
    fetchVenues();
  }, [selectedBlock]);

  




  const handleFileChange = (e) => {
    // Handle file input change for event poster
    const file = e.target.files[0];
    setEventPoster(file);
  };

  const handleReservationSubmit = async () => {
    const user = getAuth(app);
  
    try {
      const firestore = getFirestore(app);
      const requestsCollection = collection(firestore, 'requests');
  
      // Upload the event poster to Firebase Storage
      let eventPosterUrl = ''; // Default value if no poster is provided
      if (eventPoster) {
        const storage = getStorage(app);
        const posterRef = ref(storage, `event_posters/${eventPoster.name}`);
        await uploadBytes(posterRef, eventPoster);
        eventPosterUrl = await getDownloadURL(posterRef);
      }
  
      // Create a new request document
      const newRequest = {
        userEmail: email, 
        block: selectedBlock,
        venueId: selectedVenue,
        date: reservationDate,
        startTime: beginningTime,
        endTime: endingTime,
        eventTitle: eventTitle,
        eventDescription: eventDescription,
        eventPoster: eventPosterUrl,
        isApprovedByAdmin: false,
        isApprovedByDean: false,
      };
  
      // Add the request to the 'requests' collection
      await addDoc(requestsCollection, newRequest);
  
      console.log('Reservation request submitted successfully!');
      alert('Request Submitted Successfully!')
      
    } catch (error) {
      console.error('Error submitting reservation request:', error.message);
    }
  };

  

  return (
    <div className="container mt-5">
      
      <AvailableVenues />

      <h2 className='mt-4'>Book A Venue</h2>

      <div className="mb-3">
        <label htmlFor="block" className="form-label">Select Block:</label>
        <select
          className="form-select"
          id="block"
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
        >
          <option value="">Select Block</option>
          <option value="A">A Block</option>
          <option value="B">B Block</option>
          <option value="C">C Block</option>
          <option value="D">D Block</option>
          <option value="E">E Block</option>
          <option value="G">G Block</option>
          <option value="H">H Block</option>
          {blocks.map((block) => (
            <option key={block} value={block}>
              {block}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="venue" className="form-label">Select Venue:</label>
        <select
          className="form-select"
          id="venue"
          value={selectedVenue}
          onChange={(e) => setSelectedVenue(e.target.value)}
        >
          <option value="">Select Venue</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.block} - Room {venue.roomNumber}
            </option>
          ))}
        </select>
      </div>



      <div className="mb-3">
        <label htmlFor="reservationDate" className="form-label">Reservation Date:</label>
        <input
          type="date"
          className="form-control"
          id="reservationDate"
          value={reservationDate}
          onChange={(e) => setReservationDate(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="beginningTime" className="form-label">Beginning Time:</label>
        <input
          type="time"
          className="form-control"
          id="beginningTime"
          value={beginningTime}
          onChange={(e) => setBeginningTime(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="endingTime" className="form-label">Ending Time:</label>
        <input
          type="time"
          className="form-control"
          id="endingTime"
          value={endingTime}
          onChange={(e) => setEndingTime(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="eventTitle" className="form-label">Event Title / Purpose of Booking:</label>
        <input
          type="text"
          className="form-control"
          id="eventTitle"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="eventPoster" className="form-label">Event Poster(if any):</label>
        <input
          type="file"
          className="form-control"
          id="eventPoster"
          onChange={handleFileChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="eventDescription" className="form-label">Event Description:</label>
        <textarea
          className="form-control"
          id="eventDescription"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        />
      </div>

      <button type="button" className="btn btn-primary" onClick={handleReservationSubmit}>
        Submit Reservation Application
      </button>
    </div>
  );
}

export default BookAVenue;
