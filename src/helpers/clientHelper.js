import moment from 'moment';

export const bufferToBase64 = (buffer) => {
  return Buffer.from(buffer).toString('base64');
};

export const lastItemOfArray = (array) => {
  if (!array.length) {
    return [];
  }

  return array[array.length - 1];
};

export const convertTime = (timestamp) => {
  if (!timestamp) {
    return '';
  }

  return moment(timestamp).locale('vi').startOf('seconds').fromNow();
};
