import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

const EventSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string(),
  date: Yup.date().required("Required"),
  tasks: Yup.array().of(Yup.number()).required("Required"),
});

function UpdateEventForm({ signedInUser }) {
  const history = useHistory();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (signedInUser) {
      fetch(`/users/${signedInUser.id}/events`)
        .then((response) => response.json())
        .then((data) => setEvents(data));

      fetch("/tasks")
        .then((response) => response.json())
        .then((data) => setTasks(data));
    }
  }, [signedInUser]);

  const handleEventChange = (event) => {
    const eventId = event.target.value;
    const eventDetails = events.find((e) => e.id === parseInt(eventId));
    setSelectedEvent(eventDetails);
  };

  return (
    <div>
      <h2>Update Event</h2>
      <div>
        <label htmlFor="event">Select Event</label>
        <select id="event" onChange={handleEventChange}>
          <option value="">Select Event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>
      {selectedEvent && (
        <Formik
          initialValues={{
            name: selectedEvent.name,
            description: selectedEvent.description,
            date: selectedEvent.date.split('T')[0], // Format date for input type="date"
            tasks: selectedEvent.tasks.map((task) => task.id),
          }}
          validationSchema={EventSchema}
          onSubmit={(values, { setSubmitting }) => {
            fetch(`/events/${selectedEvent.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...values,
                date: new Date(values.date).toISOString(), // Convert date to ISO string
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                setSubmitting(false);
                history.push("/events");
              })
              .catch((error) => {
                console.error("Error:", error);
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="name">Name</label>
                <Field type="text" name="name" />
                <ErrorMessage name="name" component="div" />
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <Field type="text" name="description" />
                <ErrorMessage name="description" component="div" />
              </div>
              <div>
                <label htmlFor="date">Date</label>
                <Field type="date" name="date" />
                <ErrorMessage name="date" component="div" />
              </div>
              <div>
                <label htmlFor="tasks">Tasks</label>
                <Field as="select" name="tasks" multiple>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="tasks" component="div" />
              </div>
              <button type="submit" disabled={isSubmitting}>
                Update Event
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default UpdateEventForm;