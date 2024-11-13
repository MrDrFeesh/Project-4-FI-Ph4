#!/usr/bin/env python3

# Standard library imports
from random import randint, sample

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Event, Task, Attendee

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        db.drop_all()
        db.create_all()

        # Create a User
        user = User(
            username=fake.user_name(),
            email=fake.email()
        )
        db.session.add(user)
        db.session.commit()

        # Create an Event
        event = Event(
            name=fake.catch_phrase(),
            description=fake.text(),
            date=fake.future_date(),
            organizer_id=user.id
        )
        db.session.add(event)
        db.session.commit()

        # Create Tasks for the Event
        for _ in range(3):
            task = Task(
                name=fake.bs(),
                description=fake.text(),
                event_id=event.id
            )
            db.session.add(task)

        db.session.commit()

        # Create Attendees for the Event
        attendees = sample([user], randint(1, 1))  # Select the created user as an attendee
        for user in attendees:
            attendee = Attendee(
                user_id=user.id,
                event_id=event.id,
                rsvp_status=sample(['Going', 'Interested', 'Not Going'], 1)[0],
                role=sample(['Speaker', 'Volunteer', 'Participant'], 1)[0]
            )
            db.session.add(attendee)

        db.session.commit()

        print("Seeding complete!")