import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EventSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string(),
  date: Yup.date().required("Required"),
  tasks: Yup.array().of(Yup.number()).required("Required"),
});

function EventDetails({ signedInUser }) {
  const { id } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    fetch(`/events/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setTasks(data.tasks || []);
      });

    fetch("/tasks")
      .then((response) => response.json())
      .then((data) => setAllTasks(data));
  }, [id]);

  const handleDelete = () => {
    fetch(`/events/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        history.push("/events");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  const isOrganizer = signedInUser && signedInUser.id === event.organizer_id;

  return (
    <div>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
      <h3>Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name} - {task.description}</li>
        ))}
      </ul>
      {isOrganizer && (
        <div>
          <h3>Update Event</h3>
          <Formik
            initialValues={{
              name: event.name,
              description: event.description,
              date: event.date.split('T')[0], // Format date for input type="date"
              tasks: tasks.map((task) => task.id),
            }}
            validationSchema={EventSchema}
            onSubmit={(values, { setSubmitting }) => {
              fetch(`/events/${id}`, {
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
                  setEvent(data);
                  setTasks(data.tasks || []);
                  setSubmitting(false);
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
                    {allTasks.map((task) => (
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
          <button onClick={handleDelete}>Delete Event</button>
        </div>
      )}
    </div>
  );
}

export default EventDetails;