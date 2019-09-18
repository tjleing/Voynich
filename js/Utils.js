// @ts-check
/* global Noty */

import { settings } from "./Settings.js";

var fix = function (num) {
  return Math.floor(num + 0.000001);
};

var deepFix = function (obj) {
    let objCopy = Object.assign({}, obj);
    for (const key in objCopy) {
        if(typeof(objCopy[key]) === "number") {
            objCopy[key] = fix(objCopy[key]);
        }
    }
    return objCopy;
};

var deepCopy = function (obj) {
    if (typeof(obj) !== "object") {
        return obj;
    }
    const copy = {};
    for (const key in obj) {
        copy[key] = deepCopy(obj[key]);
    }
    return copy;
}

var formatDuration = function (seconds) {
    var secNum = parseFloat(seconds);
    var formattedComponents = [];

    const secondsInYear = 60*60*24*365; // TODO: leap years!!! (maybe don't actually bother)
    if (secNum >= secondsInYear) {
        const years = Math.floor(secNum / secondsInYear);
        formattedComponents.push(`${years} ` + (years === 1 ? "year" : "years"));
        secNum %= secondsInYear;
    }

    const secondsInDay = 60*60*24;
    if (secNum >= secondsInDay) {
        const days = Math.floor(secNum / secondsInDay);
        formattedComponents.push(`${days} ` + (days === 1 ? "day" : "days"));
        secNum %= secondsInDay;
    }

    const secondsInHour = 60*60;
    if (secNum >= secondsInHour) {
        const hours = Math.floor(secNum / secondsInHour);
        formattedComponents.push(`${hours} ` + (hours === 1 ? "hour" : "hours"));
        secNum %= secondsInHour;
    }

    const secondsInMinute = 60;
    if (secNum >= secondsInMinute) {
        const minutes = Math.floor(secNum / secondsInMinute);
        formattedComponents.push(`${minutes} ` + (minutes === 1 ? "minute" : "minutes"));
        secNum %= secondsInMinute;
    }

    if (secNum !== 0) {
        const seconds = (Math.floor(secNum * 10) / 10).toFixed(1);
        formattedComponents.push(`${seconds} ` + (seconds === "1" ? "second" : "seconds"));
    }

    return formattedComponents.join(", ");
};

var timeToGet = function (totalAmount, amountPerSecond) {
    if (totalAmount <= 0) {
        return formatDuration(0);
    }
    if (amountPerSecond === 0) {
        return "Infinity";
    }
    return formatDuration(totalAmount / amountPerSecond);
};

var maximumTimeToGet = function (amounts, amountsPerSecond) {
    let maxSecondsSoFar = 0;
    for (var i = 0; i<amounts.length; ++i) {
        if (amounts[i] <= 0) {
            continue;
        }
        if (amountsPerSecond[i] <= 0) {
            return "Infinity";
        }
        maxSecondsSoFar = Math.max(maxSecondsSoFar, amounts[i] / amountsPerSecond[i]);
    }
    return formatDuration(maxSecondsSoFar);
};

var notify = function (text) {
    new Noty({
        layout: "bottomRight",
        progressBar: true,
        theme: "sunset",
        timeout: 5000,
        type: "success",
        text,
    }).show();
};

export { deepCopy, deepFix, fix, formatDuration, notify, timeToGet, maximumTimeToGet };
