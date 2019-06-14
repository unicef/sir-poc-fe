/**
 *
 * @polymer
 * @mixinFunction
 */
const DateMixin = baseClass => class extends baseClass {
  prettyDate(dateString, format, placeholder) {
    let date = this._convertDate(dateString);
    return (!date) ? (placeholder ? placeholder : ''): this._utcDate(date, format);
  }

  _convertDate(dateString, noZTimezoneOffset) {
    if (typeof dateString === 'string' && dateString !== '') {
      dateString = (dateString.indexOf('T') === -1) ? (dateString + 'T00:00:00') : dateString;
      /**
       * `Z` (zero time offset) will ensure `new Date` will create the date in UTC and then it will apply local timezone
       * and will have the same result in all timezones (for the UTC date).
       * Example:
       *  d = new Date('2018-04-25T00:00:00Z');
       *  d.toString() == "Wed Apr 25 2018 03:00:00 GMT+0300 (EEST)"
       *  d.toGMTString() == "Wed, 25 Apr 2018 00:00:00 GMT"
       * @type {string}
       */
      dateString += (noZTimezoneOffset || dateString.indexOf('Z') >= 0) ? '' : 'Z';
      let date = new Date(dateString);
      let isValid = this.isValidDate(date);
      if (!isValid) {
        console.warn('Date conversion unsuccessful: ' + dateString);
      }
      return isValid ? date : null;
    }
    return null;
  }

  _utcDate(date, format) {
    return (!date) ? '' : moment.utc(date).format(format ? format : 'D MMM YYYY');
  }

  isValidDate(date) {
    return (date instanceof Date === false) ? false : (date.toString() !== 'Invalid Date');
  }

  toDate(dateStr) {
    return this._convertDate(dateStr);
  }

};

export default DateMixin;
