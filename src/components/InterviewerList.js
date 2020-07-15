import React, { useState } from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";
import PropTypes from 'prop-types';
const classNames = require('classnames');



export default function InterviewerList(props) {
  
  InterviewerList.propTypes = {
    id: PropTypes.number,
    onChange: PropTypes.func.isRequired
  };

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer Name</h4>
        <ul className="interviewers__list">
        {props.interviewers.map(interviewer => {
          return (
                <InterviewerListItem
                key = {interviewer.id}
                name = {interviewer.name}
                id = {interviewer.id}
                avatar = {interviewer.avatar}
                selected = {interviewer.id === props.interviewer}
                setInterviewer = {(event) => props.onChange(interviewer.id)} />
          )})}
        </ul>
    </section>);
}
