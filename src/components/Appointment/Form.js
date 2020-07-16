import React, { useState } from 'react';
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer ? props.interviewer.id : []);
  const [error, setError] = useState("");

  const reset = function() {
    setName("");
    setInterviewer(null);
  }

  const cancel = function() {
    reset();
    props.onCancel();
  }

  function validate(name, interviewer) {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    } else if (!interviewer) {
      setError("You must select an interviewer.");
      return;
    }
    else if (interviewer.length === 0) {
      setError("You must select an interviewer.");
      return;
    } else {
      setError("")
    }
    props.onSave(name, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
          <input
            data-testid="student-name-input"
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            value={name}
            placeholder={'Enter Student Name'}
            onChange={(event) => setName(event.target.value)}
          />
        </form>
        <section className="appointment__validation">{error}</section>
        {<InterviewerList interviewers={props.interviewers} onChange={setInterviewer} interviewer={interviewer}/>}
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={event => cancel()}  danger>Cancel</Button>
          <Button onClick={event => validate(name, interviewer)} confirm>Save</Button>
        </section>
      </section>
    </main>
  )
}