import React, { useState } from 'react';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../FirebaseSetup/firebaseConfig';
import AvailableVenues from '../ClientFolder/AvailableVenues';

function CreateVenue() {
  const [block, setBlock] = useState('');
  const [image, setImage] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  const handleImageChange = (e) => {
    // Handle file input change
    const file = e.target.files[0];
    setImage(file);
  };

  const handleCreateVenue = async () => {
    const firestore = getFirestore(app);
    const storage = getStorage(app);

    try {
      // Upload the image to Firebase Storage
      const imageRef = ref(storage, `venue_images/${image.name}`);
      await uploadBytes(imageRef, image);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(imageRef);

      // Create a new document in the 'venues' collection with the image URL
      const venueRef = await addDoc(collection(firestore, 'venues'), {
        block,
        image: imageUrl,
        roomNumber,
      });

      console.log('Venue created successfully with ID: ', venueRef.id);

      // Create subcollection for the block
      const blockCollectionRef = collection(firestore, `venues/${block}/rooms`);

      // Add room number as a document to the subcollection
      await addDoc(blockCollectionRef, {
        roomNumber,
      });

      // Reset the form fields
      setBlock('');
      setImage('');
      setRoomNumber('');
    } catch (error) {
      console.error('Error creating venue:', error);
    }
  };

  return (
    <div className="container mt-5">
      
      <h2>Create Venue</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="block" className="form-label">Block:</label>
          <select
            className="form-select"
            id="block"
            value={block}
            onChange={(e) => setBlock(e.target.value)}
          >
            <option value="">Select Block</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="G">G</option>
            <option value="H">H</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image:</label>
          <input type="file" className="form-control" id="image" onChange={handleImageChange} accept="image/*" />
        </div>
        <div className="mb-3">
          <label htmlFor="roomNumber" className="form-label">Room Number:</label>
          <input type="text" className="form-control" id="roomNumber" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleCreateVenue}>Create Venue</button>
      </form>

      <AvailableVenues />
    </div>
  );
}

export default CreateVenue;
