export function getAppointmentsForDay(state, day) {
  // console.log('State in selector fn: ', state)
  const filteredDays = state.days.filter(aptDay => aptDay.name === day)
  // console.log('filtered days[0]', filteredDays[0].appointments)
  const filteredAppointments = [];

  for (const appointment in state.appointments) {
    // console.log('state.appointments[appointment]', state.appointments[appointment].id)

    if (filteredDays[0]) {
      if (filteredDays[0].appointments.includes(state.appointments[appointment].id)) {
        filteredAppointments.push(state.appointments[appointment])
      }
    }
  }
  return filteredAppointments
};

export function getInterview(state, interview) {
  // The function should return a new object containing the interview data when we 
  // pass it an object that contains the interviewer. Otherwise, the function should 
  // return null. 

  const interviewData = {};

  if (!interview) {
    return null
  }
  const interviewerID = interview.interviewer;
  for (const interviewer in state.interviewers) {
    if (state.interviewers[interviewer].id === interviewerID) {
      interviewData['student'] = interview.student;
      interviewData['interviewer'] = state.interviewers[interviewer];
    }
  }
  return interviewData
}

export function getInterviewersForDay(state, day) {
  const filteredDays = state.days.filter(aptDay => aptDay.name === day)
  // console.log('filtered days[0]', filteredDays[0].appointments)
  const filteredInterviewers = [];

  for (const interviewer in state.interviewers) {
    // console.log('state.appointments[appointment]', state.appointments[appointment].id)

    if (filteredDays[0]) {
      if (filteredDays[0].interviewers.includes(state.interviewers[interviewer].id)) {
        filteredInterviewers.push(state.interviewers[interviewer])
      }
    }
  }
  return filteredInterviewers
}