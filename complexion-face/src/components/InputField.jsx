import React from "react";
import styles from "./styles/InputField.module.css";

export default function InputField({ type = "text", placeholder, onChange, disabled = false, value }) {
  return (
    <input
      className={styles.input}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      value={value}
    />
  );
}
