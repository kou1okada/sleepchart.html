/** \file
 * \brief   strftime subset
 * \details subset of strftime.
 * \author  Koichi OKADA
 * \date    2018
 * \copyright the MIT license
 */

 /**
 * Format time for local time.
 * @param {*} fmt - Format string.
 * @param {*} dt  - Date object.
 */
function strftime(fmt, dt) {
  return fmt.replace(/%(.)/g, (...args)=>strftime.fmt[args[1]](dt))
}
  
strftime.fmt = {
  ''  : dt=>"",
  '%' : dt=>"%",
  'F' : dt=>strftime("%Y-%m-%d", dt),
  'H' : dt=>("0"   +  dt.getHours()     ).slice(-2),
  'M' : dt=>("0"   +  dt.getMinutes()   ).slice(-2),
  'S' : dt=>("0"   +  dt.getSeconds()   ).slice(-2),
  'T' : dt=>strftime("%H:%M:%S", dt),
  'Y' : dt=>("000" +  dt.getFullYear()  ).slice(-4),
  'd' : dt=>("0"   +  dt.getDate()      ).slice(-2),
  'm' : dt=>("0"   + (dt.getMonth() + 1)).slice(-2),
  's' : dt=>Math.floor(dt.getTime() / 1000),
};

/**
 * Format time for UTC
 * @param {*} fmt - Format string.
 * @param {*} dt  - Date object.
 */
function utcstrftime(fmt, dt) {
  return fmt.replace(/%(.)/g, (...args)=>utcstrftime.fmt[args[1]](dt))
}

utcstrftime.fmt = {
  ''  : dt=>"",
  '%' : dt=>"%",
  'F' : dt=>utcstrftime("%Y-%m-%d", dt),
  'H' : dt=>("0"   +  dt.getUTCHours()     ).slice(-2),
  'M' : dt=>("0"   +  dt.getUTCMinutes()   ).slice(-2),
  'S' : dt=>("0"   +  dt.getUTCSeconds()   ).slice(-2),
  'T' : dt=>utcstrftime("%H:%M:%S", dt),
  'Y' : dt=>("000" +  dt.getUTCFullYear()  ).slice(-4),
  'd' : dt=>("0"   +  dt.getUTCDate()      ).slice(-2),
  'm' : dt=>("0"   + (dt.getUTCMonth() + 1)).slice(-2),
  's' : dt=>Math.floor(dt.getTime() / 1000),
};
