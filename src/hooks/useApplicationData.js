// This file represents the top-level file which can change the state of the entire app. 

import { useEffect, useReducer } from 'react';
const axios = require('axios').default;
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
let url;
let port;
if (process.env) {
  url = process.env.REACT_APP_WEBSOCKET_URL;
  port = process.env.PORT;
} else {
  url = "";
  port = "";
}

export default function useApplicationData() {
  function reducer(state, action) {
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

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  // Uses the spread operator to copy and then over-write existing K/V pairs.
  const setDay = day => dispatch({ type: SET_DAY, value: day })

  function cancelInterview(id) {
    // If the interview is null and we are still in the SHOW mode then we may get a TypeError.

    return axios.delete(`/api/appointments/${id}`)
  }

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview })
  }


  useEffect(() => {
    const ws = new WebSocket(url, port);

    // console.log('useEffect - Websocket - Called')

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data)
      if (data.type === "SET_INTERVIEW") {
        // console.log("Calling setInterview from WebSocket");
        const interview = data.interview;
        const id = data.id;
        dispatch({ type: SET_INTERVIEW, id, interview })
      }
      
    }
    return () => ws.close()
  }, [])


  // Initial API request to get all data
  useEffect(() => {
    // console.log('useEffect Called')
    Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('/api/interviewers')])
      .then((all) => {
        dispatch({ type: SET_APPLICATION_DATA, value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data } })
      })

  }, [])


  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  }

}

