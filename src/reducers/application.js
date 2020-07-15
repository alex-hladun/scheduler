export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";


export function reducer(state, action) {
  // console.log('reducer called', { action, state })
  switch (action.type) {
    case SET_DAY:
      return {
        ...state, day: action.value
      }
    case SET_APPLICATION_DATA:
      // console.log('SET_APPLICATION_DATA Called')
      
      return {
        ...state, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers
      }
    case SET_INTERVIEW:
      // console.log('SET_INTERVIEW Called')
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview && { ...action.interview }
      };

      // Append the appoint obj to the appointments array
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };

      let spotChange = 0;
      if (action.interview) {
        if (!state.appointments[action.id].interview) {
          spotChange = -1;
        }
      } else {
        spotChange = 1;
      }

      // console.log(state.days);
      const days = state.days.map((day) => day.appointments.includes(action.id) ? { ...day, spots: day.spots + spotChange } : day)
      return {
        ...state, appointments, days
      }

    default:
      throw new Error(`Unsupported action type: ${action.type}`)
  }
}

// const exportObj = {
//     reducer, 
//     SET_DAY,
//     SET_APPLICATION_DATA,
//     SET_INTERVIEW
// }

// export default {
//   exportObj 
// }