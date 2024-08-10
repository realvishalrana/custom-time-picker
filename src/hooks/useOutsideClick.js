import { useEffect, useRef, useState } from "react";

const useClickOutside = (initialIsVisible) => {
  const [open, setOpen] = useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref?.current && !ref?.current?.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return { ref, open, setOpen };
};

export default useClickOutside;
