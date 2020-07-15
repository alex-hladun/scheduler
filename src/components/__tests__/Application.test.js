import React from "react";

import { act, render, cleanup, getByAltText, getByPlaceholderText, getAllByTestId, waitForElement, prettyDOM, fireEvent, getByText, getAllByAltText, queryByText, getByTestId } from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";
process.env.NODE_ENV = 'development';


afterEach(cleanup);

describe("Application", () => {
  it("Defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"))
      .then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText(/Leopold Silvers/i)).toBeInTheDocument();
      }
      )
  })

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    // debug();

    await waitForElement(() => getByText(container, "Archie Cohen"))
    // console.log(prettyDOM(container))

    // Returns an array of items matching testID
    const appointments = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointments, "Add"))
    fireEvent.change(getByPlaceholderText(appointments, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointments, "Sylvia Palmer"));

    fireEvent.click(getByText(appointments, "Save"));
    // debug();

    // console.log(prettyDOM(appointments));
    expect(getByText(appointments, "Saving...")).toBeInTheDocument();
    // expect(queryByText(appointments, "Savinadsg")).not.toBeInTheDocument();
    // expect(queryByText(appointments, "Savingdssd...")).not.toBeInTheDocument();

    await waitForElement(() => getByText(appointments, "Lydia Miller-Jones"))
    expect(queryByText(appointments, "Lydia Miller-Jones")).toBeInTheDocument();


    const dayItems = getAllByTestId(container, "day");
    const monday = dayItems.find(day => queryByText(day, 'Monday'))
    expect(queryByText(monday, "no spots remaining")).toBeInTheDocument();

    // console.log(prettyDOM(dayItems.find(day => queryByText(day,'Monday'))));
    // expect(getAllByTestId("day"))
  })


  it("loads data, edits an interview and Keeps Monday spots at 2", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the Archie Cohen appointment.
    const appointment = getAllByTestId(container, "appointment")[1];
    fireEvent.click(getByAltText(appointment, "Edit"))

    // Change name and interviewer
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "LEEROY JENKINS" }
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));

    // 4. Click the "Save" button on the 'Save' container".
    fireEvent.click(getByText(appointment, "Save"))

    await waitForElement(() => getByAltText(appointment, "Edit"));
    // 6. Confirm that the Apt container is able to be edited.
    expect(getByAltText(appointment, "Edit")).toBeInTheDocument();

    // 7. Compare the value of spots remaining to equal 1.
    const monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"))
    expect(queryByText(monday, "1 spot remaining")).toBeInTheDocument();
    // console.log('PRETTYDOM', prettyDOM(monday));
  });


  it("loads data, deletes an interview and reduces the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the Archie Cohen appointment.
    const appointment = getAllByTestId(container, "appointment")[1];
    // debug();

    fireEvent.click(getByAltText(appointment, "Delete"))

    // Check that the confirmation message is shown.
    // Get by text will actually wait while query will just return null
    await waitForElement(() => getByText(appointment, "Are you sure you want to Cancel?"));
    expect(getByText(appointment, "Are you sure you want to Cancel?")).toBeInTheDocument();

    // 4. Click the "Confirm" button on the 'Confirm' container".
    fireEvent.click(getByText(appointment, "Confirm"))

    // Check that 'Deleting..' is displayed.
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // 5. Wait until delete is finsihed
    await waitForElement(() => getByTestId(appointment, "empty-appointment"));
    // 6. Confirm that the Apt container is now empty ('Element with 'ADD' button is displayed')
    expect(getByTestId(appointment, "empty-appointment")).toBeInTheDocument();

    // 7. Compare the value of spots remaining to the previous value (OR 2 spots remaining).
    const monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"))
    expect(queryByText(monday, "2 spots remaining")).toBeInTheDocument();
  });


  /* somewhere near the top */
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);
    // debug();

    await waitForElement(() => getByText(container, "Archie Cohen"))
    // console.log(prettyDOM(container))

    // Returns an array of items matching testID
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"))
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    // Check that the put fails within Axios
    await waitForElement(() => getByText(appointment, /There was an error while saving!/i))
    // console.log(prettyDOM(appointment))
    expect(getByText(appointment, /There was an error while saving!/i)).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the Archie Cohen appointment.
    const appointment = getAllByTestId(container, "appointment")[1];
    fireEvent.click(getByAltText(appointment, "Delete"))

    // / Check that the confirmation message is shown.
    // Get by text will actually wait while query will just return null
    await waitForElement(() => getByText(appointment, "Are you sure you want to Cancel?"));
    expect(getByText(appointment, "Are you sure you want to Cancel?")).toBeInTheDocument();

    // 4. Click the "Confirm" button on the 'Confirm' container".
    fireEvent.click(getByText(appointment, "Confirm"))


    // Check that the put fails within Axios


    await waitForElement(() => getByText(appointment, /There was an error while saving!/i))
    // console.log(prettyDOM(appointment))
    expect(getByText(appointment, /There was an error while saving!/i)).toBeInTheDocument();
});


})
