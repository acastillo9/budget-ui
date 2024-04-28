import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function convertUTCDateToLocalDate(utcDate: dayjs.Dayjs, timeZone = dayjs.tz.guess()) {
	return utcDate.tz(timeZone);
}
