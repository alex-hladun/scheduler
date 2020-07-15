// This file represents the top-level file which can change the state of the entire app. 

import { useEffect, useReducer } from 'react';
const axios = require('axios').default;
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
// process.env.NODE_ENV = 'development';
const url = process.env.REACT_APP_WEBSOCKET_URL;
const port = process.env.PORT;
// const WebSocket = require('ws')



export default function useApplicationData() {
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state, day: action.value
        }
      case SET_APPLICATION_DATA:
        return {
          ...state, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers
        }
      case SET_INTERVIEW:
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
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview: null })
      })
    //   .catch((err) => {
    //   return err
    // })

  }

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview })
      })
    //   .catch((err => {
    //   return err
    // }))
  }


  useEffect(() => {
    const ws = new WebSocket(url, port);


    ws.onopen = function (event) {
      ws.send("ping")
    }

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data)
      if (data.type === "SET_INTERVIEW") {
        const interview = data.interview;
        const id = data.id;
        console.log('set interview request')
        
        dispatch({ type: SET_INTERVIEW, id, interview })


        // dispatch({ type: SET_APPLICATION_DATA, value: { appointments: data.interview, interviewers: all[2].data } })

      }
      console.log('message from server')
      console.log(data);
    }

    // ws.close()
  })


  // Initial API request to get all data
  useEffect(() => {
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

