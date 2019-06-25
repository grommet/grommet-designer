export * from './bare';
export * from './change';
export * from './code';
export * from './get';
export * from './reset';
export * from './upgrade';
export * from './welcome';

export const bucketUrl = 'https://www.googleapis.com/storage/v1/b/designer-grommet/o';
export const bucketPostUrl = 'https://www.googleapis.com/upload/storage/v1/b/designer-grommet/o';
export const bucketKey = `key=${process.env.REACT_APP_API_KEY}`;
