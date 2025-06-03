import moment from 'moment';

export const formatTimeFromNow = (time: string) => {
  return moment(time).fromNow();
};
