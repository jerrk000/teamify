"""\
All Database-models which are needed for this app

Usage:  Normally used when a new app-instance is created,
        and the database is set up for the first time
        (in __init__.py)
"""
from .. import db
from sqlalchemy import Table, Column, Integer, ForeignKey, Enum, DateTime, func # TODO is this needed?


friendships = Table(
    "friendships",
    db.Model.metadata,
    Column("player_id", Integer, ForeignKey("players.id"), primary_key=True),
    Column("friend_id", Integer, ForeignKey("players.id"), primary_key=True),
    Column("status", Enum("pending", "accepted", "blocked", name="friendship_status"), default="pending"),
    Column("created_at", DateTime, default=func.now()),
)

class Player(db.Model):
    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), default = 'anonymous')
    email = db.Column(db.String(150))
    password_hash = db.Column(db.String(150))
    friendcode = db.Column(db.String(150))
    played_matches = db.Column(db.Integer, default=0)
    won_matches = db.Column(db.Integer, default=0)
    lost_matches = db.Column(db.Integer, default=0)


    # Self-referential Many-to-Many Relationship
    friends = db.relationship(
        "Player",
        secondary=friendships,
        primaryjoin=id == friendships.c.player_id,
        secondaryjoin=id == friendships.c.friend_id,
        backref="friend_of",
    )