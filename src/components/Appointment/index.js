import React from "react";
import { useEffect } from 'react';
import "./styles.scss";
import Header from "components/Appointment/Header.js"
import Empty from "components/Appointment/Empty.js"
import Show from "components/Appointment/Show.js"
import useVisualMode from "hooks/useVisualMode"
import Form from "components/Appointment/Form.js"
import Status from "components/Appointment/Status.js"
import Confirm from "components/Appointment/Confirm.js"
import Error from "components/Appointment/Error.js"


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE"
const ERROR_DELETE = "ERROR_DELETE"
const DELETING = "DELETING"

export default function Appointment(props) {
  // Handles booking of appointment
  function save(name, interviewer) {
    const interviewObj = {
      student: name,
      interviewer
    };
    transition(SAVING, true)
    props.bookInterview(props.id, interviewObj)
      .then((err, res) => {
        if (res) {
          transition(ERROR_SAVE, true)
        } else {
          transition(SHOW)
        } 
      })
      .catch(err =>  transition(ERROR_SAVE, true))
  }
  // handles the deleting of appointment
  function cancel() {
    transition(DELETING, true)
    props.cancelInterview(props.id)
      .then((res) => {
        if (res) {
          transition(ERROR_DELETE, true)
        } else {
          transition(EMPTY)
        }
      }
      )
      .catch(err =>  transition(ERROR_SAVE, true))
  }

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
     transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
     transition(EMPTY);
    }
   }, [props.interview, transition, mode]);

  return (
    <article className="appointment" data-testid="appointment">
      <>
        <Header time={props.time} />
        {mode === ERROR_DELETE && <Error
          message={"There was an error while deleting!"}
          onClose={event => back()}
        />}
        {mode === ERROR_SAVE && <Error
          message={"There was an error while saving!"}
          onClose={event => back()}
        />}
        {mode === EMPTY && <Empty onAdd={event => transition(CREATE)} />}
        {mode === SHOW && props.interview && <Show
          interviewer={props.interview.interviewer}
          student={props.interview.student}
          onDelete={(event => transition(CONFIRM))}
          onEdit={(event => transition(EDIT))}
        />}
        {mode === CREATE && <Form
          onSave={save}
          interviewers={props.interviewers}
          onCancel={event => back()}
        />}
        {mode === EDIT && <Form
          onSave={save}
          interviewers={props.interviewers}
          onCancel={event => back()}
          interviewer={props.interview.interviewer}
          name={props.interview.student}
        />
        }
        {mode === SAVING && <Status
          message={"Saving..."}
        />
        }
        {mode === DELETING && <Status
          message={"Deleting..."}
        />
        }
        {mode === CONFIRM && <Confirm
          message={"Are you sure you want to Cancel?"}
          onConfirm={event => cancel()}
          onCancel={event => back()}
        />}
      </>
    </article>
  )
}