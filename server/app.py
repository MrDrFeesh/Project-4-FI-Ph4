#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify
from flask_restful import Resource, Api
from datetime import datetime
from dateutil.parser import isoparse

# Local imports
from config import app, db
from models import User, Event, Task, Attendee

api = Api(app)

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            user = User.query.get(user_id)
            if user:
                return jsonify(user.to_dict())
            return {'message': 'User not found'}, 404
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])

    def post(self):
        data = request.get_json()
        user = User(
            username=data['username'],
            email=data['email']
        )
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201

class UserEventsResource(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            events = Event.query.filter_by(organizer_id=user_id).all()
            return jsonify([event.to_dict() for event in events])
        return {'message': 'User not found'}, 404

class EventResource(Resource):
    def get(self, event_id=None):
        if event_id:
            event = Event.query.get(event_id)
            if event:
                return jsonify(event.to_dict())
            return {'message': 'Event not found'}, 404
        events = Event.query.all()
        return jsonify([event.to_dict() for event in events])

    def post(self):
        data = request.get_json()
        event = Event(
            name=data['name'],
            description=data.get('description'),
            date=isoparse(data['date']),
            organizer_id=data['organizer_id']
        )
        db.session.add(event)
        db.session.commit()
        return jsonify(event.to_dict()), 201

    def put(self, event_id):
        data = request.get_json()
        event = Event.query.get(event_id)
        if event:
            event.name = data['name']
            event.description = data.get('description')
            event.date = isoparse(data['date'])
            event.tasks = [Task.query.get(task_id) for task_id in data['tasks']]
            db.session.commit()
            return jsonify(event.to_dict())
        return {'message': 'Event not found'}, 404

    def delete(self, event_id):
        event = Event.query.get(event_id)
        if event:
            # Delete related attendees
            Attendee.query.filter_by(event_id=event_id).delete()
            # Delete related tasks
            Task.query.filter_by(event_id=event_id).delete()
            db.session.delete(event)
            db.session.commit()
            return {'message': 'Event deleted'}
        return {'message': 'Event not found'}, 404

class TaskResource(Resource):
    def get(self, task_id=None):
        if task_id:
            task = Task.query.get(task_id)
            if task:
                return jsonify(task.to_dict())
            return {'message': 'Task not found'}, 404
        tasks = Task.query.all()
        return jsonify([task.to_dict() for task in tasks])

    def post(self):
        data = request.get_json()
        task = Task(
            name=data['name'],
            description=data.get('description'),
            event_id=data['event_id']
        )
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201

class AttendeeResource(Resource):
    def get(self, attendee_id=None):
        if attendee_id:
            attendee = Attendee.query.get(attendee_id)
            if attendee:
                return jsonify(attendee.to_dict())
            return {'message': 'Attendee not found'}, 404
        attendees = Attendee.query.all()
        return jsonify([attendee.to_dict() for attendee in attendees])

    def post(self):
        data = request.get_json()
        attendee = Attendee(
            user_id=data['user_id'],
            event_id=data['event_id'],
            rsvp_status=data.get('rsvp_status'),
            role=data.get('role')
        )
        db.session.add(attendee)
        db.session.commit()
        return jsonify(attendee.to_dict()), 201

api.add_resource(UserResource, '/users', '/users/<int:user_id>')
api.add_resource(UserEventsResource, '/users/<int:user_id>/events')
api.add_resource(EventResource, '/events', '/events/<int:event_id>')
api.add_resource(TaskResource, '/tasks', '/tasks/<int:task_id>')
api.add_resource(AttendeeResource, '/attendees', '/attendees/<int:attendee_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)