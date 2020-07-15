import React from 'react';
const classNames = require('classnames');


export default function Empty (props) {

  const emptyClass = classNames({
    "appointment__add": true
  }

  )
  return (
    <main id={props.id} 
    data-testid="empty-appointment"
    className={emptyClass}>
      
      <img
        className="appointment__add-button"
        src="images/add.png"
        alt="Add"
        onClick = {props.onAdd}
      />
    </main>
  )
}

