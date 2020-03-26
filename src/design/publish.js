import { apiUrl } from './urls';

export const publish = ({
  design,
  email,
  password,
  pin,
  onChange,
  onError,
}) => {
  // add some metadata to the site
  const nextDesign = JSON.parse(JSON.stringify(design));
  nextDesign.email = email;
  const date = new Date();
  date.setMilliseconds(pin);
  nextDesign.date = date.toISOString();
  nextDesign.password = password;

  const body = JSON.stringify(nextDesign);
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Content-Length': body.length,
    },
    body,
  })
    .then(response => {
      if (response.ok) {
        return response.text().then(id => {
          const nextUploadUrl = [
            window.location.protocol,
            '//',
            window.location.host,
            window.location.pathname,
            `?id=${encodeURIComponent(id)}`,
            window.location.hash,
          ].join('');
          nextDesign.publishedUrl = nextUploadUrl;
          onChange(nextDesign);
        });
      }
      return response.text().then(onError);
    })
    .catch(e => onError(e.message));
};
