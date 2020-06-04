import { Between, LessThan, MoreThan } from 'typeorm';
import * as moment from 'moment';

const MoreThanDate = (date: Date) =>
  MoreThan(moment(date).format('YYYY-MM-DD HH:mm:ss'));
const LessThanDate = (date: Date) =>
  LessThan(moment(date).format('YYYY-MM-DD HH:mm:ss'));
const BetweenDates = (from: Date, to: Date) =>
  Between(
    moment(from).format('YYYY-MM-DD HH:mm:ss'),
    moment(to).format('YYYY-MM-DD HH:mm:ss'),
  );

export { MoreThanDate, LessThanDate, BetweenDates };
