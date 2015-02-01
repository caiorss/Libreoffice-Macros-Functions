// Algoriths ported from Libreoffice CALC to Javascript
//
// Author: https://gist.github.com/ghalimi
//
/*
*   Credits and Sources:
*
*   https://gist.githubusercontent.com/ghalimi/4590219/raw/92893a6c8ca684313581eb8833bc3b525bbccd52/FV.js
*   https://gist.githubusercontent.com/ghalimi/4590215/raw/4a661b0ddf75aaa0dc6f4fe6a4516dc19cd94dda/PMT.js
*   https://gist.githubusercontent.com/ghalimi/4582597/raw/6e0247671b8ba5acf039d7c866217fd6b1f9c5e0/CUMPRINC.js
*   https://gist.githubusercontent.com/ghalimi/4669712/raw/728163304a68e3bcf8b73626186ef4dd9085053e/XIRR.js
*/

// Copyright (c) 2012 Sutoiku, Inc. (MIT License)

// Some algorithms have been ported from Apache OpenOffice:

/**************************************************************
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 *************************************************************/

function FV(rate, periods, payment, value, type) {
  // Credits: algorithm inspired by Apache OpenOffice

  // Initialize type
  var type = (typeof type === 'undefined') ? 0 : type;

  // Evaluate rate (TODO: replace with secure expression evaluator)
  rate = eval(rate);

  // Return future value
  var result;
  if (rate === 0) {
    result = value + payment * periods;
  } else {
    var term = Math.pow(1 + rate, periods);
    if (type === 1) {
      result = value * term + payment * (1 + rate) * (term - 1.0) / rate;
    } else {
      result = value * term + payment * (term - 1) / rate;
    }
  }
  return -result;
}


function DOLLARDE(dollar, fraction) {
  // Credits: algorithm inspired by Apache OpenOffice

  // Return error if any of the parameters is not a number
  if (isNaN(dollar) || isNaN(fraction)) return '#VALUE!';

  // Return error if fraction is negative
  if (fraction < 0) return '#NUM!';

  // Return error if fraction is greater than or equal to 0 and less than 1
  if (fraction >= 0 && fraction < 1) return '#DIV/0!';

  // Truncate fraction if it is not an integer
  fraction = parseInt(fraction, 10);

  // Compute integer part
  var result = parseInt(dollar, 10);

  // Add decimal part
  result += (dollar % 1) * Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN10)) / fraction;

  // Round result
  var power = Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN2) + 1);
  result = Math.round(result * power) / power;

  // Return converted dollar price
  return result;
}

function IPMT(rate, period, periods, present, future, type) {
  // Credits: algorithm inspired by Apache OpenOffice

  // Initialize type
  var type = (typeof type === 'undefined') ? 0 : type;

  // Evaluate rate and periods (TODO: replace with secure expression evaluator)
  rate = eval(rate);
  periods = eval(periods);

  // Compute payment
  var payment = PMT(rate, periods, present, future, type);

  // Compute interest
  var interest;
  if (period === 1) {
    if (type === 1) {
      interest = 0;
    } else {
      interest = -present;
    }
  } else {
    if (type === 1) {
      interest = FV(rate, period - 2, payment, present, 1) - payment;
    } else {
      interest = FV(rate, period - 1, payment, present, 0);
    }
  }

  // Return interest
  return interest * rate;
}



function PMT(rate, periods, present, future, type) {
  // Credits: algorithm inspired by Apache OpenOffice

  // Initialize type
  var type = (typeof type === 'undefined') ? 0 : type;

  // Evaluate rate (TODO: replace with secure expression evaluator)
  rate = eval(rate);

  // Return payment
  var result;
  if (rate === 0) {
    result = (present + future) / periods;
  } else {
    var term = Math.pow(1 + rate, periods);
    if (type === 1) {
      result = (future * rate / (term - 1) + present * rate / (1 - 1 / term)) / (1 + rate);
    } else {
      result = future * rate / (term - 1) + present * rate / (1 - 1 / term);
    }
  }
  return -result;
}


function DOLLARFR(dollar, fraction) {
  // Credits: algorithm inspired by Apache OpenOffice

  // Return error if any of the parameters is not a number
  if (isNaN(dollar) || isNaN(fraction)) return '#VALUE!';

  // Return error if fraction is negative
  if (fraction < 0) return '#NUM!';

  // Return error if fraction is greater than or equal to 0 and less than 1
  if (fraction >= 0 && fraction < 1) return '#DIV/0!';

  // Truncate fraction if it is not an integer
  fraction = parseInt(fraction, 10);

  // Compute integer part
  var result = parseInt(dollar, 10);

  // Add decimal part
  result += (dollar % 1) * Math.pow(10, -Math.ceil(Math.log(fraction) / Math.LN10)) * fraction;

  // Return converted dollar price
  return result;
}


function CUMPRINC(rate, periods, value, start, end, type) {
  // Credits: algorithm inspired by Apache OpenOffice
  // Credits: Hannes Stiebitzhofer for the translations of function and variable names
  // Requires getFutureValue() and getPartialPayment() from Formula.js [http://stoic.com/formula/]

  // Evaluate rate and periods (TODO: replace with secure expression evaluator)
  rate = eval(rate);
  periods = eval(periods);

  // Return error if either rate, periods, or value are lower than or equal to zero
  if (rate <= 0 || periods <= 0 || value <= 0) return '#NUM!';

  // Return error if start < 1, end < 1, or start > end
  if (start < 1 || end < 1 || start > end) return '#NUM!';

  // Return error if type is neither 0 nor 1
  if (type !== 0 && type !== 1) return '#NUM!';

  // Compute cumulative principal
  var payment = getPartialPayment(rate, periods, value, 0, type);
  var principal = 0;
  if(start === 1) {
    if(type === 0) {
      principal = payment + value * rate;
    } else {
      principal = payment;
    }
    start++;
  }
  for (var i = start; i <= end; i++) {
    if(type > 0) {
      principal += payment - (getFutureValue(rate, i - 2, payment, value, 1) - payment) * rate;
    } else {
      principal += payment - getFutureValue(rate, i - 1, payment, value, 0) * rate;
    }
  }

  // Return cumulative principal
  return principal;
}


function CUMIPMT(rate, periods, value, start, end, type) {
  // Credits: algorithm inspired by Apache OpenOffice
  // Credits: Hannes Stiebitzhofer for the translations of function and variable names
  // Requires getFutureValue() and getPartialPayment() from Formula.js [http://stoic.com/formula/]

  // Evaluate rate and periods (TODO: replace with secure expression evaluator)
  rate = eval(rate);
  periods = eval(periods);

  // Return error if either rate, periods, or value are lower than or equal to zero
  if (rate <= 0 || periods <= 0 || value <= 0) return '#NUM!';

  // Return error if start < 1, end < 1, or start > end
  if (start < 1 || end < 1 || start > end) return '#NUM!';

  // Return error if type is neither 0 nor 1
  if (type !== 0 && type !== 1) return '#NUM!';

  // Compute cumulative interest
  var payment = getPartialPayment(rate, periods, value, 0, type);
  var interest = 0;
  interest = 0;
  if(start === 1) {
    if(type === 0) {
      interest = -value;
      start++;
    }
  }
  for (var i = start; i <= end; i++) {
    if (type === 1) {
      interest += getFutureValue(rate, i - 2, payment, value, 1 ) - payment;
    } else {
      interest += getFutureValue(rate, i - 1, payment, value, 0 );
    }
  }
  interest *= rate;

  // Return cumulative interest
  return interest;
}


function XIRR(values, dates, guess) {
  // Credits: algorithm inspired by Apache OpenOffice

  // Calculates the resulting amount
  var irrResult = function(values, dates, rate) {
    var r = rate + 1;
    var result = values[0];
    for (var i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, moment(dates[i]).diff(moment(dates[0]), 'days') / 365);
    }
    return result;
  }

  // Calculates the first derivation
  var irrResultDeriv = function(values, dates, rate) {
    var r = rate + 1;
    var result = 0;
    for (var i = 1; i < values.length; i++) {
      var frac = moment(dates[i]).diff(moment(dates[0]), 'days') / 365;
      result -= frac * values[i] / Math.pow(r, frac + 1);
    }
    return result;
  }

  // Check that values contains at least one positive value and one negative value
  var positive = false;
  var negative = false;
  for (var i = 0; i < values.length; i++) {
    if (values[i] > 0) positive = true;
    if (values[i] < 0) negative = true;
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) return '#NUM!';

  // Initialize guess and resultRate
  var guess = (typeof guess === 'undefined') ? 0.1 : guess;
  var resultRate = guess;

  // Set maximum epsilon for end of iteration
  var epsMax = 1e-10;

  // Set maximum number of iterations
  var iterMax = 50;

  // Implement Newton's method
  var newRate, epsRate, resultValue;
  var iteration = 0;
  var contLoop = true;
  do {
    resultValue = irrResult(values, dates, resultRate);
    newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
  } while(contLoop && (++iteration < iterMax));

  if(contLoop) return '#NUM!';

  // Return internal rate of return
  return resultRate;
}



function IRR(values, guess) {
  // Credits: algorithm inspired by Apache OpenOffice

  // Calculates the resulting amount
  var irrResult = function(values, dates, rate) {
    var r = rate + 1;
    var result = values[0];
    for (var i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
    }
    return result;
  }

  // Calculates the first derivation
  var irrResultDeriv = function(values, dates, rate) {
    var r = rate + 1;
    var result = 0;
    for (var i = 1; i < values.length; i++) {
      var frac = (dates[i] - dates[0]) / 365;
      result -= frac * values[i] / Math.pow(r, frac + 1);
    }
    return result;
  }

  // Initialize dates and check that values contains at least one positive value and one negative value
  var dates = [];
  var positive = false;
  var negative = false;
  for (var i = 0; i < values.length; i++) {
    dates[i] = (i === 0) ? 0 : dates[i - 1] + 365;
    if (values[i] > 0) positive = true;
    if (values[i] < 0) negative = true;
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) return '#NUM!';

  // Initialize guess and resultRate
  var guess = (typeof guess === 'undefined') ? 0.1 : guess;
  var resultRate = guess;

  // Set maximum epsilon for end of iteration
  var epsMax = 1e-10;

  // Set maximum number of iterations
  var iterMax = 50;

  // Implement Newton's method
  var newRate, epsRate, resultValue;
  var iteration = 0;
  var contLoop = true;
  do {
    resultValue = irrResult(values, dates, resultRate);
    newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
  } while(contLoop && (++iteration < iterMax));

  if(contLoop) return '#NUM!';

  // Return internal rate of return
  return resultRate;
}