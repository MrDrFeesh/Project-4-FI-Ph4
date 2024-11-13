import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

const TaskSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string(),
  event_id: Yup.number().required("Required"),
});

function TaskForm() {
  const history = useHistory();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/events")
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div>
      <h2>Create Task</h2>
      <Formik
        initialValues={{
          name: "",
          description: "",
          event_id: "",
        }}
        validationSchema={TaskSchema}
        onSubmit={(values, { setSubmitting }) => {
          fetch("/tasks", {
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
              history.push("/tasks");
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
              <label htmlFor="event_id">Event ID</label>
              <Field as="select" name="event_id">
                <option value="">Select Event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="event_id" component="div" />
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

export default TaskForm;