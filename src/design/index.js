export * from './bare';
export * from './change';
export * from './code';
export * from './get';
export * from './loading';
export * from './reset';
export * from './upgrade';
export * from './welcome';

export const bucketUrl = 'https://www.googleapis.com/storage/v1/b/designer-grommet/o';
export const bucketPostUrl = 'https://www.googleapis.com/upload/storage/v1/b/designer-grommet/o';
export const bucketKey = `key=${process.env.REACT_APP_API_KEY}`;

export const apiUrl = 'https://us-central1-grommet-designer.cloudfunctions.net/designs';
export const themeApiUrl = 'https://us-central1-grommet-designer.cloudfunctions.net/themes';
