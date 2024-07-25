import React, { createContext, useEffect, useState } from 'react';

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function CloudinaryUploadWidget({ uwConfig, setPublicId, setImgUrl, id }) {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state

  useEffect(() => {
    if (!loaded) {
      const uwScript = document.getElementById('uw');
      if (!uwScript) {
        const script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('id', 'uw');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.addEventListener('load', () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        setLoaded(true);
      }
    }
  }, [loaded]);

  // Define the handleButtonClick function
  const handleButtonClick = () => {
    if (loaded) {
      setLoading(true); // Set loading to true when button is clicked
      var myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          setLoading(false); // Set loading to false when upload is done
          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info: ', result.info);
            setImgUrl(result.info.url);
            setPublicId(result.info.public_id);
          }
        },
      );

      myWidget.open();
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id={id}
        className="cloudinary-button mb-2"
        onClick={handleButtonClick}
        disabled={loading} // Disable button when loading
      >
        {loading ? <div>Loading...</div> : 'Select File'}
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default CloudinaryUploadWidget;
export { CloudinaryScriptContext };
