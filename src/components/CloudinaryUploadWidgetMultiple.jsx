import React, { createContext, useEffect, useState } from 'react';

const CloudinaryScriptContext = createContext();

function CloudinaryUploadWidgetMultiple({ uwConfig, setImgUrls, id }) {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleButtonClick = () => {
    if (loaded) {
      setLoading(true);
      var myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          setLoading(false);
          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info: ', result.info);
            setImgUrls((prevUrls) => [...prevUrls, result.info.url]);
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
        disabled={loading}
      >
        {loading ? <div>Loading...</div> : 'Select Files'}
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default CloudinaryUploadWidgetMultiple;
export { CloudinaryScriptContext };
