const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');

const storage = new Storage();
const bucket = storage.bucket('grommet-designs');

const hashPassword = (design) => {
  if (design.password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHmac('sha512', salt);
    hash.update(design.password);
    const hashedPassword = hash.digest('hex');
    design.password = { salt, hashedPassword };
  }
};

const checkPassword = (design, password) => {
  const { salt, hashedPassword } = design.password;
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const hashed = hash.digest('hex');
  return hashedPassword === hashed;
};

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.designs = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  if (req.method === 'GET') {
    const parts = req.url.split('/');
    const id = decodeURIComponent(parts[1]);
    const authorization = req.get('Authorization');
    let password;
    if (authorization) {
      const encoded = authorization.split(' ')[1];
      const buffer = Buffer.from(encoded, 'base64');
      password = buffer.toString();
    }

    // get the design in question, no matter the sub-paths
    const file = bucket.file(`${id}.json`);
    return file
      .download()
      .then((data) => {
        const design = JSON.parse(data[0]);
        if (
          design.password &&
          (!password || !checkPassword(design, password))
        ) {
          return res.header('WWW-Authenticate', 'Basic').status(401).send();
        }

        design.id = id;
        const date = new Date(design.date);
        date.setMilliseconds(0);
        design.date = date.toISOString();

        // check for comments
        return bucket
          .getFiles({
            autoPaginate: false,
            delimiter: '/',
            prefix: `${id}/comments/`,
          })
          .then((data) =>
            Promise.all(
              data[0].map((file) =>
                file.download().then((data) => JSON.parse(data[0])),
              ),
            ),
          )
          .then((comments) => {
            design.comments = comments;
            return design;
          })
          .catch((e) => design) // no comments
          .then((design) => {
            res
              .status(200)
              .type('json')
              .send(
                JSON.stringify(
                  parts[2] === 'comments' ? design.comments : design,
                ),
              );
          });
      })
      .catch((e) => res.status(400).send(e.message));
  }

  if (req.method === 'POST') {
    const parts = req.url.split('/');
    const designId = decodeURIComponent(parts[1]);

    if (designId && parts[2] === 'comments') {
      // comment
      const comment = req.body;
      const createdAt = new Date().toISOString();
      const id = `${designId}/comments/${encodeURIComponent(createdAt)}`;
      comment.createdAt = createdAt;
      comment.id = id;
      const file = bucket.file(`${id}.json`);
      return file
        .save(JSON.stringify(comment), { resumable: false })
        .then(() =>
          res.status(201).type('json').send(JSON.stringify({ id, createdAt })),
        )
        .catch((e) => res.status(500).send(e.message));
    } else if (parts.length === 2) {
      // new design
      const design = req.body;
      const id = encodeURIComponent(
        `${design.name}-${design.email.replace('@', '-')}`.replace(
          /\.|\s+|\//g,
          '-',
        ),
      );
      const file = bucket.file(`${id}.json`);

      return file
        .download()
        .then((data) => {
          const existingDesign = JSON.parse(data[0]);

          const existingPin = new Date(existingDesign.date).getMilliseconds();
          const pin = new Date(design.date).getMilliseconds();
          if (pin !== existingPin) {
            res.status(403).send('Unauthorized');
            return;
          }

          hashPassword(design);
          file
            .save(JSON.stringify(design), { resumable: false })
            .then(() => res.status(200).type('text').send(id))
            .catch((e) => res.status(500).send(e.message));
        })
        .catch(() => {
          // doesn't exist yet, add it
          hashPassword(design);
          file
            .save(JSON.stringify(design), { resumable: false })
            .then(() => res.status(201).type('text').send(id))
            .catch((e) => res.status(500).send(e.message));
        });
    }
  }

  if (req.method === 'PUT') {
    const file = bucket.file(`${req.url}.json`);
    const comment = req.body;
    comment.updatedAt = new Date().toISOString();
    return file
      .save(JSON.stringify(comment), { resumable: false })
      .then(() => res.status(200).send());
  }

  if (req.method === 'DELETE') {
    const parts = req.url.split('/');
    const id = decodeURIComponent(parts[1]);
    const file = bucket.file(`${id}.json`);
    const { date } = req.body;

    return file
      .download()
      .then((data) => {
        const existingDesign = JSON.parse(data[0]);

        const existingPin = new Date(existingDesign.date).getMilliseconds();
        const pin = new Date(date).getMilliseconds();
        if (pin !== existingPin) {
          res.status(403).send('Unauthorized');
          return;
        }

        return file.delete().then(() => res.status(200).send());
      })
      .catch((e) => res.status(400).send(e.message));
  }

  res.status(405).send();
};
