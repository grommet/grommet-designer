const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket('grommet-designs');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.designs = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  if (req.method === 'GET') {
    const id = decodeURIComponent(req.url.split('/')[1]);
    const file = bucket.file(`${id}.json`);
    return file.download()
      .then((data) => {
        const design = JSON.parse(data[0]);
        const date = new Date(design.date);
        date.setMilliseconds(0);
        design.date = date.toISOString();
        res.status(200).type('json').send(JSON.stringify(design));
      })
      .catch(e => res.status(400).send(e.message));
  }
  if (req.method === 'POST') {
    const design = req.body;
    const id = encodeURIComponent(`${design.name}-${design.email.replace('@', '-')}`.replace(/\.|\s+/g, '-'));
    const file = bucket.file(`${id}.json`);
    return file.download()
      .then((data) => {
        const existingDesign = JSON.parse(data[0]);

        const existingPin = (new Date(existingDesign.date)).getMilliseconds();
        const pin = (new Date(design.date)).getMilliseconds();
        if (pin !== existingPin) {
          res.status(403).send('Unauthorized');
          return;
        }

        file.save(JSON.stringify(design), { resumable: false })
          .then(() => res.status(200).type('text').send(id))
          .catch(e => res.status(500).send(e.message))
      })
      .catch(() => {
        // doesn't exist yet, add it
        file.save(JSON.stringify(design), { resumable: false })
          .then(() => res.status(201).type('text').send(id))
          .catch(e => res.status(500).send(e.message))
      });
  }
  res.status(405).send();
};
