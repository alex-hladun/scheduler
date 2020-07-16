// This file represents the top-level file which can change the state of the entire app. 

import { useEffect, useReducer } from 'react';
import  reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from "reducers/application";

const axios = require('axios').default;


let url;
let port;
if (process.env) {
  url = process.env.REACT_APP_WEBSOCKET_URL;
  port = process.env.PORT;
} else {
  url = "notundefined";
  port = "8001";
}

export default function useApplicationData() {
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

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data)
      if (data.type === "SET_INTERVIEW") {
        const interview = data.interview;
        const id = data.id;
        dispatch({ type: SET_INTERVIEW, id, interview })
      }
      
    }
    return () => ws.close()
  }, [])


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

