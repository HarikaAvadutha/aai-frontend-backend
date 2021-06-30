import React, { useState, useEffect } from 'react';
import { get } from 'axios';
import { Main } from '../styled';

const GetImages = () => {
  const [images, setImages] = useState([]);
  const SERVER_ENDPOINT = 'http://localhost:5000/api/art/';

  const getCollections = () => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    };
    return get(SERVER_ENDPOINT, config);
  };

  useEffect(() => {
    getCollections().then(res => {
      console.log('hello', res.data);
      setImages(res.data);
    });
  }, []);

  return (
    <div style={{ marginBottom: '100px' }}>
      {images.length &&
        images.map(image => {
          return (
            <>
              <div
                style={{ border: '1px solid white', width: 300, height: 300, margin: 'auto' }}
                className="text-center"
              >
                <img src={image.originalImage} width="300" height="300" alt={image.id} />
              </div>
              <br />
            </>
          );
        })}
      <div className="text-center">
        <h3 style={{ color: "green" }}>FINAL SUBMITTED RESPONSE</h3>
        <br />
        <span><b style={{ color: "greenyellow" }}>Name: </b>{JSON.parse(localStorage.getItem('final')).name}</span><br />
        <span><b style={{ color: "greenyellow" }}>Confidence: </b>{JSON.parse(localStorage.getItem('final')).Confidence}</span>
      </div>
    </div>
  );
};

export default GetImages;
