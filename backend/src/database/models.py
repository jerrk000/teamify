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

game_participants = Table(
    "game_participants",
    db.Model.metadata,
    Column("game_id", Integer, ForeignKey("games.id"), primary_key=True),
    Column("player_id", Integer, ForeignKey("players.id"), primary_key=True),
    Column("team", Enum("team_a", "team_b", name="game_participant_team"), nullable=False),
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

class GameType(db.Model):
    __tablename__ = "game_types"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)

class PlayerStats(db.Model):
    __tablename__ = "playerstats"

    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), primary_key=True)
    beachvolleyball_serve = db.Column(db.Integer)
    beachvolleyball_receive = db.Column(db.Integer)
    beachvolleyball_set = db.Column(db.Integer)
    beachvolleyball_hit = db.Column(db.Integer)
    beachvolleyball_block = db.Column(db.Integer)
    beachvolleyball_effort = db.Column(db.Integer)
    beachvolleyball_mentality = db.Column(db.Integer)
    beachvolleyball_quick = db.Column(db.Integer)
    football_quick = db.Column(db.Integer)
    general_quick = db.Column(db.Integer)
    last_updated = db.Column(db.Date)

    player = db.relationship("Player", backref=db.backref("stats", uselist=False))

class Game(db.Model):
    __tablename__ = "games"

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.String(150), unique=True, nullable=False)
    game_type_id = db.Column(db.Integer, db.ForeignKey("game_types.id"))
    ended_at = db.Column(db.DateTime)
    duration_seconds = db.Column(db.Integer)
    winning_team = db.Column(db.Enum("team_a", "team_b", name="winning_team"))
    team_a_score = db.Column(db.Integer)
    team_b_score = db.Column(db.Integer)
    is_valid = db.Column(db.Boolean, default=True)

    players = db.relationship(
        "Player",
        secondary=game_participants,
        backref="games",
    )
    game_type = db.relationship("GameType", backref="games")
