import React, { useState } from "react";
import { useGreeter } from "../context/GreeterContext";
import Button from "./Button";
import InputField from "./InputField";
export default function Greeter() {
  const [newGreeting, setNewGreeting] = useState("");
  const { greeting, updateGreeting } = useGreeter();

  return (
    <div className="mt-2">
      <div>Greeting from contract: </div> <h3>{greeting}</h3>
      <InputField value={newGreeting} placeholder="new greeting" onChange={(e) => setNewGreeting(e.target.value)} />
      <br />
      <Button onClick={() => updateGreeting(newGreeting)}>Update Greeting</Button>
    </div>
  );
}
