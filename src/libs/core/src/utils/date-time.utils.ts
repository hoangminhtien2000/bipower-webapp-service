import * as _moment from 'moment';

export class DateTimeUtils {
  public static parser(value: string
                       , formatter: string = 'YYYY-MM-DD'): Date {
    try {
      const date = _moment(value, formatter);
      return date.isValid() ? date.toDate() : undefined;
    } catch(ex) {
      return undefined;
    }
  }

  public static convertStringToDate(strDate: any = '') {
    const datePatterBE = /(\d{2})\/(\d{2})\/(\d{4})/g;
    const datePatterFE = "$3-$2-$1";
    if(typeof strDate == 'string'){
        return _moment(new Date(strDate.replace(datePatterBE, datePatterFE))).toDate();
    }
    return strDate;
  }
}
