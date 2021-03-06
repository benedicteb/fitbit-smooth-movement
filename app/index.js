import clock from "clock";
import document from "document";
import { display } from "display";

const hourHand = document.getElementById("hours");
const minHand = document.getElementById("mins");
const secHand = document.getElementById("secs");
const animationIntervalMs = 50;

let now = null;
let animationPid = null;

const hourHandAngle = (hours, minutes, seconds, millis) => {
  const totalSeconds = seconds + millis / 1000;
  const totalMinutes = minutes + totalSeconds / 60;
  const totalHours = hours + totalMinutes / 60;

  return (360 / 12) * totalHours;
};

const minuteHandAngle = (minutes, seconds, millis) => {
  const totalSeconds = seconds + millis / 1000;
  const totalMinutes = minutes + totalSeconds / 60;

  return (360 / 60) * totalMinutes;
};

const secondHandAngle = (seconds, millis) => {
  const totalSeconds = seconds + millis / 1000;

  return (360 / 60) * totalSeconds;
};

const updateClock = () => {
  now = new Date();

  const hours = now.getHours() % 12;
  const secs = now.getSeconds();
  const millis = now.getMilliseconds();
  const mins = now.getMinutes();

  hourHand.groupTransform.rotate.angle = hourHandAngle(
    hours,
    mins,
    secs,
    millis
  );
  minHand.groupTransform.rotate.angle = minuteHandAngle(mins, secs, millis);
  secHand.groupTransform.rotate.angle = secondHandAngle(secs, millis);

  // console.log(`${hours}-${mins}-${secs},${millis}`);
};

const initClock = () => {
  clock.granularity = "off";
};

const initAnimation = () => {
  console.log("Starting animation");

  updateClock();
  animationPid = setInterval(updateClock, animationIntervalMs);
};

const initDisplay = (onWake, onSleep) => {
  display.addEventListener("change", () => {
    if (display.on) {
      onWake();
    } else {
      onSleep();
    }
  });
};

const onWake = () => {
  console.log("Woke up");

  initAnimation();
};

const onSleep = () => {
  console.log("About to sleep");

  stopAnimation();
};

const stopAnimation = () => {
  console.log("Stopping animation");

  clearInterval(animationPid);
  animationPid = null;
};

const restartAnimation = () => {
  stopAnimation();
  initAnimation();
};

initDisplay(onWake, onSleep);
initClock();
onWake();
