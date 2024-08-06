import { useState } from 'react';
import CloudinaryUploadWidgetMultiple from './CloudinaryUploadWidgetMultiple';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';

export default function MultipleUploadWidget({ setImgUrls, id }) {
  const [cloudName] = useState('hzxyensd5');
  const [uploadPreset] = useState('aoh4fpwm');
  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
    // cropping: true,
    showAdvancedOptions: true,
    sources: ['local', 'url'],
    multiple: true, // Allow multiple file uploads
    maxImageWidth: 2000,
    theme: 'blue',
  });

  const cld = new Cloudinary({ cloud: { cloudName } });

  return (
    <div className="App">
      <CloudinaryUploadWidgetMultiple
        uwConfig={uwConfig}
        setImgUrls={setImgUrls}
        id={id}
      />
    </div>
  );
}
