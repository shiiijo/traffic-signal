import { useState, useEffect } from "react";
import styles from "./TrafficSignal.module.css"; // Using CSS Module

const SIGNALS = ["Signal 1", "Signal 2", "Signal 3", "Signal 4"];
const GREEN_DURATION = 5; // Duration for green light
const YELLOW_DURATION = 2; // Duration for yellow light

const TrafficSignal = ({ name, status, timeLeft }) => {
  return (
    <div className={styles.signalContainer}>
      <div
        className={`${styles.light} ${
          status === "green" ? styles.green : styles.off
        }`}
      ></div>
      <div
        className={`${styles.light} ${
          status === "yellow" ? styles.yellow : styles.off
        }`}
      ></div>
      <div
        className={`${styles.light} ${
          status === "red" ? styles.red : styles.off
        }`}
      ></div>
      <p className={styles.signalName}>{name}</p>
      <p className={styles.timeLeft}>{timeLeft}s</p>
    </div>
  );
};

const useTrafficSignal = (signals, greenDuration, yellowDuration) => {
  const [currentSignal, setCurrentSignal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(greenDuration);
  const [phase, setPhase] = useState("green"); // "green" or "yellow"

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          if (phase === "green") {
            // Switch to yellow phase
            setPhase("yellow");
            return yellowDuration;
          } else if (phase === "yellow") {
            // Switch to the next signal and reset to green phase
            setCurrentSignal((prevSignal) => (prevSignal + 1) % signals.length);
            setPhase("green");
            return greenDuration;
          }
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, currentSignal, signals.length, greenDuration, yellowDuration]); // Include all dependencies

  return { currentSignal, timeLeft, phase };
};

export default function Intersection() {
  const { currentSignal, timeLeft, phase } = useTrafficSignal(
    SIGNALS,
    GREEN_DURATION,
    YELLOW_DURATION
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Traffic Signal Synchronization System</h1>
      <div className={styles.signalGrid}>
        {SIGNALS.map((signal, index) => (
          <TrafficSignal
            key={signal}
            name={signal}
            status={index === currentSignal ? phase : "red"}
            timeLeft={index === currentSignal ? timeLeft : "--"}
          />
        ))}
      </div>
    </div>
  );
}
