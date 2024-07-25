import { useState } from 'react';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';

// import './styles.css';

export default function UploadWidget({ setImgUrl, id }) {
  const [publicId, setPublicId] = useState('');
  // Replace with your own cloud name
  const [cloudName] = useState('hzxyensd5');
  // Replace with your own upload preset
  const [uploadPreset] = useState('aoh4fpwm');

  // Upload Widget Configuration
  // Remove the comments from the code below to add
  // additional functionality.
  // Note that these are only a few examples, to see
  // the full list of possible parameters that you
  // can add see:
  //   https://cloudinary.com/documentation/upload_widget_reference

  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
    cropping: true, //add a cropping step
    showAdvancedOptions: true, //add advanced options (public_id and tag)
    sources: ['local', 'url'], // restrict the upload sources to URL and local files
    multiple: false, //restrict upload to a single file
    // folder: "user_images", //upload files to the specified folder
    // tags: ["users", "profile"], //add the given tags to the uploaded files
    // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
    // clientAllowedFormats: ["images"], //restrict uploading to image files only
    // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
    maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
    theme: 'blue', //change to a purple theme
  });

  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage = cld.image(publicId);

  return (
    <div className="App">
      <CloudinaryUploadWidget
        uwConfig={uwConfig}
        setPublicId={setPublicId}
        setImgUrl={setImgUrl}
        id={id}
      />
      {/* <p>
        <a
          href="https://cloudinary.com/documentation/upload_widget"
          target="_blank"
        >
          Upload Widget User Guide
        </a>
      </p> */}
      {/* <p>
        <a
          href="https://cloudinary.com/documentation/upload_widget_reference"
          target="_blank"
        >
          Upload Widget Reference
        </a>
      </p> */}
      {/* <div style={{ width: '800px' }}>
        <AdvancedImage
          style={{ maxWidth: '100%' }}
          cldImg={myImage}
          plugins={[responsive(), placeholder()]}
        />
      </div> */}
    </div>
  );
}
