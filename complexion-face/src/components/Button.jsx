import React from "react";
import styles from "./styles/Button.module.css";

export default function Button({ children, onClick, disabled }) {
  return (
    <button disabled={disabled} className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}
