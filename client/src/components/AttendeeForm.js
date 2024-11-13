import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

const AttendeeSchema = Yup.object().shape({
  user_id: Yup.number().required("Required"),
  event_id: Yup.number().required("Required"),
  rsvp_status: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
});

function AttendeeForm() {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));

    fetch("/events")
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div>
      <h2>Create Attendee</h2>
      <Formik
        initialValues={{
          user_id: "",
          event_id: "",
          rsvp_status: "",
          role: "",
        }}
        validationSchema={AttendeeSchema}
        onSubmit={(values, { setSubmitting }) => {
          fetch("/attendees", {
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
              history.push("/attendees");
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
              <label htmlFor="user_id">User ID</label>
              <Field as="select" name="user_id">
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="user_id" component="div" />
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
            <div>
              <label htmlFor="rsvp_status">RSVP Status</label>
              <Field type="text" name="rsvp_status" />
              <ErrorMessage name="rsvp_status" component="div" />
            </div>
            <div>
              <label htmlFor="role">Role</label>
              <Field type="text" name="role" />
              <ErrorMessage name="role" component="div" />
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

export default AttendeeForm;