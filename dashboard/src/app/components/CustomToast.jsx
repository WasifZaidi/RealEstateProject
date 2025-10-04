import React, { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import style from "../Toast.module.css";;
import { inter } from "@/utils/fonts";

const icons = {
  success: <FaCheckCircle />,
  error: <FaTimesCircle />,
  info: <FaInfoCircle />,
  warning: <FaExclamationCircle />,
};

const CustomToast = ({ type = "info", message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`${style.toast} ${inter.className} ${style[type]}`}
      style={{ "--duration": `${duration}ms` }}
    >
      <div className={style.icon}>{icons[type]}</div>
      <p className={style.message}>{message}</p>
      <button className={style.closeBtn} onClick={onClose}>
        ✖
      </button>
      {duration > 0 && <div className={style.progress}></div>}
    </div>
  );
};

export default CustomToast;
