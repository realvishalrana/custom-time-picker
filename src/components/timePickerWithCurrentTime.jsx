"use client";

import useClickOutside from "@/hooks/useOutsideClick";
import { useEffect, useRef, useState } from "react";

const genDouble = (num) => num.toString().padStart(2, "0");

const genNumber = (length, start = 0) =>
  Array.from({ length }, (v, i) => genDouble(i + start));

const TimePickerWithCurrentTime = ({ value = ":", onChange = () => {} }) => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const inputRef = useRef(null);

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  const hours = genNumber(24 - currentHour, currentHour);
  const minutes = genNumber(60 - currentMinute, currentMinute);

  const [time, setTime] = useState({
    hour: genDouble(currentHour),
    minute: genDouble(currentMinute),
  });

  const { hour, minute } = time || {};

  const { ref, open, setOpen } = useClickOutside(false);

  const autoScroll = () => {
    if (hourRef.current) {
      hourRef.current.scrollTo({
        top: Number(hour) * 40 + 4,
      });
    }
    if (minuteRef.current) {
      minuteRef.current.scrollTo({
        top: Number(minute) * 40 + 4,
      });
    }
  };

  useEffect(() => {
    if (open) {
      autoScroll();
    }
  }, [open]);

  useEffect(() => {
    const [sHour, sMinute] = value?.split(":") || [];
    if (sHour && sMinute) {
      setTime({
        hour: genDouble(sHour),
        minute: genDouble(sMinute),
      });
    }
  }, []);

  useEffect(() => {
    if (time) onChange(`${hour}:${minute}`);
  }, [time]);

  const handleTime = (key, props) => {
    const selected = { ...time, ...props };
    setTime({ ...selected });
    if (key === "minute") {
      setOpen(false);
    }
  };

  const handleInput = (event) => {
    const { value = "00", id } = event.target || {};
    const total = id === "hour" ? 23 : 59;
    const num = Number(value);
    if (num >= 0 && num <= total && value.length <= 2) {
      return event;
    } else {
      event.target.value = "00";
      return event;
    }
  };

  const handleChange = (event) => {
    const { value = "00", id } = event.target || {};
    setTime((prev) => ({ ...prev, [id]: value }));
    if (id === "hour" && value.length === 2) inputRef.current?.focus();
    autoScroll();
  };

  const handleBlur = (event) => {
    const { value, id } = event.target || {};
    setTime((prev) => ({ ...prev, [id]: value ? genDouble(value) : "00" }));
  };

  return (
    <div
      ref={ref}
      className="relative border hover:border-primary rounded-lg px-0.5 flex items-center justify-start w-32"
    >
      <TimeInput
        time={time}
        customRef={inputRef}
        handleBlur={handleBlur}
        handleInput={handleInput}
        handleChange={handleChange}
        onClick={() => setOpen(true)}
      />
      {open ? (
        <div className="border rounded-xl absolute top-[110%] flex p-1 gap-4 z-10 bg-white">
          <TimeBox
            data={hours}
            keyName="hour"
            selected={hour}
            customRef={hourRef}
            handleTime={handleTime}
          />
          <TimeBox
            data={minutes}
            keyName="minute"
            selected={minute}
            customRef={minuteRef}
            handleTime={handleTime}
          />
        </div>
      ) : null}
    </div>
  );
};

const TimeBox = ({
  customRef = null,
  selected,
  data = [],
  keyName = "",
  handleTime,
}) => {
  return (
    <ul
      ref={customRef}
      className="h-60 overflow-y-scroll no-scrollbar snap-y snap-mandatory"
    >
      {data.map((current) => {
        return (
          <li key={current}>
            <button
              onClick={() => handleTime(keyName, { [keyName]: current })}
              className={`snap-always snap-start w-24 h-10 rounded-lg cursor-pointer flex items-center justify-center hover:border border-primary hover:bg-primary/10 hover:text-primary ${
                current === selected && "bg-primary text-white"
              }`}
            >
              {current}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

const TimeInput = ({
  time = {},
  customRef,
  handleBlur,
  handleInput,
  handleChange,
  ...rest
}) => {
  const { hour, minute } = time;
  return (
    <div className="flex items-center justify-start gap-0.5 w-full" {...rest}>
      <input
        id="hour"
        type="number"
        value={hour}
        onBlur={handleBlur}
        onInput={handleInput}
        onChange={handleChange}
        inputMode="none"
        className="h-10 w-10 flex items-center justify-center rounded-lg outline-none text-center"
      />
      <span>:</span>
      <input
        id="minute"
        type="number"
        value={minute}
        ref={customRef}
        onBlur={handleBlur}
        onInput={handleInput}
        onChange={handleChange}
        inputMode="none"
        className="h-10 w-10 flex items-center justify-center rounded-lg outline-none text-center"
      />
    </div>
  );
};

export default TimePickerWithCurrentTime;
