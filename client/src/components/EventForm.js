import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

const EventSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string(),
  date: Yup.date().required("Required"),
  organizer_id: Yup.number().required("Required"),
  tasks: Yup.array().of(Yup.number()).required("Required"),
});

function EventForm({ signedInUser }) {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));

    fetch("/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  return (
    <div>
      <h2>Create Event</h2>
      <Formik
        initialValues={{
          name: "",
          description: "",
          date: "",
          organizer_id: signedInUser ? signedInUser.id : "",
          tasks: [],
        }}
        validationSchema={EventSchema}
        onSubmit={(values, { setSubmitting }) => {
          fetch("/events", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
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
              <label htmlFor="organizer_id">Organizer ID</label>
              <Field as="select" name="organizer_id">
                <option value="">Select Organizer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="organizer_id" component="div" />
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
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EventForm;