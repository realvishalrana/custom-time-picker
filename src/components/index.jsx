"use client";
import TimePickerWithCurrentTime from "./timePickerWithCurrentTime";
import { useState } from "react";
import TimePicker from "./timePicker";

const IndexTimePicker = () => {
  const [value, setValue] = useState();

  const [time, setTime] = useState();

  return (
    <div className="space-y-2">
      <div className="mb-2">
        <span>Time Picker With CurrentTime</span>
        <TimePickerWithCurrentTime
          value={value}
          onChange={(e) => setValue(e)}
        />
      </div>
      <span>Time Picker</span>
      <TimePicker value={time} onChange={(e) => setTime(e)} />
    </div>
  );
};

export default IndexTimePicker;
