import clock from "clock";
import document from "document";
import { display } from "display";

const secHand = document.getElementById("secs");
const animationIntervalMs = 50;

let now = null;
let animationPid = null;

const secondsToAngle = seconds => {
  return (360 / 60) * seconds;
};

const millisToAngle = millis => {
  return (360 / (60 * 1000)) * millis;
};

const updateClock = intervalDiff => {
  const secs = now.getSeconds();
  const millis = secs * 1000 + now.getMilliseconds();

  secHand.groupTransform.rotate.angle = millisToAngle(millis);

  now = new Date(now.getTime() + intervalDiff);
};

const onTick = evt => {
  now = evt.date;
};

const initClock = () => {
  clock.ontick = onTick;
  clock.granularity = "seconds";
};

const initAnimation = () => {
  animationPid = setInterval(
    () => updateClock(animationIntervalMs),
    animationIntervalMs
  );
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
};

initDisplay(onWake, onSleep);
initClock();
