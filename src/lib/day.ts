import dayjs, { type ConfigType } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.locale('ko');

export const longDate = (date: ConfigType) => dayjs(date).format('YYYY년 M월 D일');
export const shortDate = (date: ConfigType) => dayjs(date).format('YY.MM.DD');
export const relativeDate = (date: ConfigType) => dayjs(date).fromNow();
