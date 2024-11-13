from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import relationship
from config import db
from datetime import datetime

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    events = relationship('Event', back_populates='organizer')
    attending_events = relationship('Attendee', back_populates='user')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.DateTime, nullable=False)
    organizer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    organizer = relationship('User', back_populates='events')
    tasks = relationship('Task', back_populates='event')
    attendees = relationship('Attendee', back_populates='event')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'date': self.date.isoformat(),
            'organizer_id': self.organizer_id,
            'organizer': self.organizer.to_dict() if self.organizer else None,
            'tasks': [task.to_dict() for task in self.tasks],
            'attendees': [attendee.to_dict() for attendee in self.attendees]
        }

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    event = relationship('Event', back_populates='tasks')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'event_id': self.event_id
        }

class Attendee(db.Model, SerializerMixin):
    __tablename__ = 'attendees'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    rsvp_status = db.Column(db.String(50), nullable=True)
    role = db.Column(db.String(50), nullable=True)
    user = relationship('User', back_populates='attending_events')
    event = relationship('Event', back_populates='attendees')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'event_id': self.event_id,
            'rsvp_status': self.rsvp_status,
            'role': self.role,
            'user': self.user.to_dict() if self.user else None
        }