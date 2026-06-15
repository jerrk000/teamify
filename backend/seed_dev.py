from datetime import datetime, timedelta

from werkzeug.security import generate_password_hash
from sqlalchemy import text

from src import create_app, db
from src.database.models import Game, GameType, Player, friendships, game_participants


DEV_PASSWORD = "testtesttest123"

PLAYERS = [
    {
        "name": "Max Mustermann",
        "email": "max@test.dev",
        "friendcode": "MAX-DEV-001",
        "played_matches": 12,
        "won_matches": 8,
        "lost_matches": 4,
    },
    {
        "name": "Jerry",
        "email": "jerry@test.dev",
        "friendcode": "JERRY-DEV-002",
        "played_matches": 9,
        "won_matches": 5,
        "lost_matches": 4,
    },
    {
        "name": "Alice",
        "email": "alice@test.dev",
        "friendcode": "ALICE-DEV-003",
        "played_matches": 15,
        "won_matches": 11,
        "lost_matches": 4,
    },
    {
        "name": "Bob",
        "email": "bob@test.dev",
        "friendcode": "BOB-DEV-004",
        "played_matches": 7,
        "won_matches": 2,
        "lost_matches": 5,
    },
    {
        "name": "Clara",
        "email": "clara@test.dev",
        "friendcode": "CLARA-DEV-005",
        "played_matches": 18,
        "won_matches": 10,
        "lost_matches": 8,
    },
    {
        "name": "David",
        "email": "david@test.dev",
        "friendcode": "DAVID-DEV-006",
        "played_matches": 21,
        "won_matches": 13,
        "lost_matches": 8,
    },
    {
        "name": "Emma",
        "email": "emma@test.dev",
        "friendcode": "EMMA-DEV-007",
        "played_matches": 11,
        "won_matches": 6,
        "lost_matches": 5,
    },
    {
        "name": "Felix",
        "email": "felix@test.dev",
        "friendcode": "FELIX-DEV-008",
        "played_matches": 5,
        "won_matches": 1,
        "lost_matches": 4,
    },
    {
        "name": "Hannah",
        "email": "hannah@test.dev",
        "friendcode": "HANNAH-DEV-009",
        "played_matches": 27,
        "won_matches": 17,
        "lost_matches": 10,
    },
    {
        "name": "Ivan",
        "email": "ivan@test.dev",
        "friendcode": "IVAN-DEV-010",
        "played_matches": 14,
        "won_matches": 7,
        "lost_matches": 7,
    },
]

FRIENDSHIPS = [
    ("max@test.dev", "jerry@test.dev", "accepted"),
    ("jerry@test.dev", "alice@test.dev", "accepted"),
    ("jerry@test.dev", "clara@test.dev", "accepted"),
    ("david@test.dev", "jerry@test.dev", "accepted"),
    ("emma@test.dev", "jerry@test.dev", "accepted"),
    ("jerry@test.dev", "hannah@test.dev", "accepted"),
    ("felix@test.dev", "jerry@test.dev", "pending"),
    ("ivan@test.dev", "jerry@test.dev", "blocked"),
    ("max@test.dev", "alice@test.dev", "accepted"),
    ("bob@test.dev", "max@test.dev", "pending"),
]

GAME_TYPES = [
    {"id": 1, "name": "classic"},
    {"id": 2, "name": "quick_match"},
    {"id": 3, "name": "ranked"},
    {"id": 4, "name": "training"},
]

GAMES = [
    {
        "game_id": "GAME-DEV-001",
        "game_type": "classic",
        "ended_at": datetime.now() - timedelta(days=2),
        "duration_seconds": 1320,
        "winning_team": "team_a",
        "team_a_score": 10,
        "team_b_score": 7,
        "is_valid": True,
        "participants": [
            ("max@test.dev", "team_a"),
            ("alice@test.dev", "team_a"),
            ("jerry@test.dev", "team_b"),
            ("bob@test.dev", "team_b"),
        ],
    },
    {
        "game_id": "GAME-DEV-002",
        "game_type": "quick_match",
        "ended_at": datetime.now() - timedelta(days=1, hours=4),
        "duration_seconds": 780,
        "winning_team": "team_b",
        "team_a_score": 4,
        "team_b_score": 6,
        "is_valid": True,
        "participants": [
            ("max@test.dev", "team_a"),
            ("bob@test.dev", "team_a"),
            ("jerry@test.dev", "team_b"),
            ("alice@test.dev", "team_b"),
        ],
    },
    {
        "game_id": "GAME-DEV-003",
        "game_type": "ranked",
        "ended_at": datetime.now() - timedelta(hours=6),
        "duration_seconds": 1640,
        "winning_team": "team_a",
        "team_a_score": 15,
        "team_b_score": 14,
        "is_valid": False,
        "participants": [
            ("jerry@test.dev", "team_a"),
            ("alice@test.dev", "team_a"),
            ("max@test.dev", "team_b"),
            ("bob@test.dev", "team_b"),
        ],
    },
    {
        "game_id": "GAME-DEV-004",
        "game_type": "classic",
        "ended_at": datetime.now() - timedelta(days=5, hours=2),
        "duration_seconds": 1485,
        "winning_team": "team_a",
        "team_a_score": 12,
        "team_b_score": 9,
        "is_valid": True,
        "participants": [
            ("jerry@test.dev", "team_a"),
            ("david@test.dev", "team_a"),
            ("max@test.dev", "team_b"),
            ("clara@test.dev", "team_b"),
        ],
    },
    {
        "game_id": "GAME-DEV-005",
        "game_type": "ranked",
        "ended_at": datetime.now() - timedelta(days=4),
        "duration_seconds": 1900,
        "winning_team": "team_b",
        "team_a_score": 13,
        "team_b_score": 16,
        "is_valid": True,
        "participants": [
            ("jerry@test.dev", "team_a"),
            ("emma@test.dev", "team_a"),
            ("hannah@test.dev", "team_b"),
            ("alice@test.dev", "team_b"),
        ],
    },
    {
        "game_id": "GAME-DEV-006",
        "game_type": "quick_match",
        "ended_at": datetime.now() - timedelta(days=3, hours=7),
        "duration_seconds": 620,
        "winning_team": "team_b",
        "team_a_score": 3,
        "team_b_score": 5,
        "is_valid": True,
        "participants": [
            ("bob@test.dev", "team_a"),
            ("felix@test.dev", "team_a"),
            ("jerry@test.dev", "team_b"),
            ("clara@test.dev", "team_b"),
        ],
    },
    {
        "game_id": "GAME-DEV-007",
        "game_type": "training",
        "ended_at": datetime.now() - timedelta(days=2, hours=8),
        "duration_seconds": 910,
        "winning_team": "team_a",
        "team_a_score": 8,
        "team_b_score": 8,
        "is_valid": False,
        "participants": [
            ("jerry@test.dev", "team_a"),
            ("ivan@test.dev", "team_a"),
            ("max@test.dev", "team_b"),
            ("emma@test.dev", "team_b"),
        ],
    },
    {
        "game_id": "GAME-DEV-008",
        "game_type": "ranked",
        "ended_at": datetime.now() - timedelta(days=1, hours=10),
        "duration_seconds": 1740,
        "winning_team": "team_a",
        "team_a_score": 18,
        "team_b_score": 12,
        "is_valid": True,
        "participants": [
            ("hannah@test.dev", "team_a"),
            ("jerry@test.dev", "team_a"),
            ("david@test.dev", "team_b"),
            ("bob@test.dev", "team_b"),
        ],
    },
    {
        "game_id": "GAME-DEV-009",
        "game_type": "classic",
        "ended_at": datetime.now() - timedelta(hours=18),
        "duration_seconds": 1215,
        "winning_team": "team_b",
        "team_a_score": 9,
        "team_b_score": 11,
        "is_valid": True,
        "participants": [
            ("jerry@test.dev", "team_a"),
            ("max@test.dev", "team_a"),
            ("clara@test.dev", "team_b"),
            ("alice@test.dev", "team_b"),
        ],
    },
    {
        "game_id": "GAME-DEV-010",
        "game_type": "quick_match",
        "ended_at": datetime.now() - timedelta(hours=2),
        "duration_seconds": 540,
        "winning_team": "team_a",
        "team_a_score": 6,
        "team_b_score": 2,
        "is_valid": True,
        "participants": [
            ("jerry@test.dev", "team_a"),
            ("emma@test.dev", "team_a"),
            ("felix@test.dev", "team_b"),
            ("ivan@test.dev", "team_b"),
        ],
    },
]


def table_columns(table_name):
    rows = db.session.execute(text(f"PRAGMA table_info({table_name})")).mappings()
    return {row["name"] for row in rows}


def add_column_if_missing(table_name, column_name, column_definition):
    if column_name in table_columns(table_name):
        return

    db.session.execute(
        text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}")
    )


def ensure_dev_schema():
    add_column_if_missing("games", "game_type_id", "INTEGER")
    add_column_if_missing("games", "team_a_score", "INTEGER")
    add_column_if_missing("games", "team_b_score", "INTEGER")
    add_column_if_missing("games", "is_valid", "BOOLEAN DEFAULT 1")
    add_column_if_missing(
        "game_participants",
        "team",
        "VARCHAR(6) NOT NULL DEFAULT 'team_a'",
    )
    db.session.commit()


def upsert_player(player_data):
    player = Player.query.filter_by(email=player_data["email"]).first()

    if player is None:
        player = Player(email=player_data["email"])
        db.session.add(player)

    for key, value in player_data.items():
        setattr(player, key, value)

    player.password_hash = generate_password_hash(DEV_PASSWORD)
    return player


def upsert_game_type(game_type_data):
    game_type = db.session.get(GameType, game_type_data["id"])

    if game_type is None:
        game_type = GameType(id=game_type_data["id"])
        db.session.add(game_type)

    game_type.name = game_type_data["name"]
    return game_type


def friendship_exists(player_id, friend_id):
    existing_friendship = db.session.execute(
        friendships.select().where(
            (friendships.c.player_id == player_id)
            & (friendships.c.friend_id == friend_id)
        )
    ).fetchone()

    return existing_friendship is not None


def add_friendship(players_by_email, player_email, friend_email, status):
    player = players_by_email[player_email]
    friend = players_by_email[friend_email]

    if friendship_exists(player.id, friend.id):
        db.session.execute(
            friendships.update()
            .where(
                (friendships.c.player_id == player.id)
                & (friendships.c.friend_id == friend.id)
            )
            .values(status=status)
        )
        return

    db.session.execute(
        friendships.insert().values(
            player_id=player.id,
            friend_id=friend.id,
            status=status,
        )
    )


def upsert_game(game_data, game_types_by_name):
    game = Game.query.filter_by(game_id=game_data["game_id"]).first()
    game_type_name = game_data["game_type"]
    game_type_id = game_types_by_name[game_type_name].id

    if game is None:
        if "game_mode" in table_columns("games"):
            db.session.execute(
                text(
                    """
                    INSERT INTO games (game_id, game_type_id, game_mode)
                    VALUES (:game_id, :game_type_id, :game_mode)
                    """
                ),
                {
                    "game_id": game_data["game_id"],
                    "game_type_id": game_type_id,
                    "game_mode": game_type_name,
                },
            )
            db.session.flush()
            game = Game.query.filter_by(game_id=game_data["game_id"]).first()
        else:
            game = Game(game_id=game_data["game_id"])
            db.session.add(game)

    for key, value in game_data.items():
        if key == "game_type":
            game.game_type_id = game_type_id
        elif key != "participants":
            setattr(game, key, value)

    return game


def add_game_participant(game, player, team):
    existing_participant = db.session.execute(
        game_participants.select().where(
            (game_participants.c.game_id == game.id)
            & (game_participants.c.player_id == player.id)
        )
    ).fetchone()

    if existing_participant:
        db.session.execute(
            game_participants.update()
            .where(
                (game_participants.c.game_id == game.id)
                & (game_participants.c.player_id == player.id)
            )
            .values(team=team)
        )
        return

    db.session.execute(
        game_participants.insert().values(
            game_id=game.id,
            player_id=player.id,
            team=team,
        )
    )


def seed_games(players_by_email, game_types_by_name):
    for game_data in GAMES:
        game = upsert_game(game_data, game_types_by_name)
        db.session.flush()

        for player_email, team in game_data["participants"]:
            add_game_participant(game, players_by_email[player_email], team)


def seed_dev_data():
    app = create_app()

    with app.app_context():
        db.create_all()
        ensure_dev_schema()

        players_by_email = {
            player_data["email"]: upsert_player(player_data)
            for player_data in PLAYERS
        }
        game_types_by_name = {
            game_type_data["name"]: upsert_game_type(game_type_data)
            for game_type_data in GAME_TYPES
        }
        db.session.flush()

        for player_email, friend_email, status in FRIENDSHIPS:
            add_friendship(players_by_email, player_email, friend_email, status)

        seed_games(players_by_email, game_types_by_name)

        db.session.commit()

        print("Seeded dev database.")
        print(f"Players: {len(PLAYERS)}")
        print(f"Friendships: {len(FRIENDSHIPS)}")
        print(f"Game types: {len(GAME_TYPES)}")
        print(f"Games: {len(GAMES)}")
        print(f"Dev password for all seeded users: {DEV_PASSWORD}")


if __name__ == "__main__":
    seed_dev_data()
