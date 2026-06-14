from werkzeug.security import generate_password_hash

from src import create_app, db
from src.database.models import Player, friendships


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
]

FRIENDSHIPS = [
    ("max@test.dev", "jerry@test.dev", "accepted"),
    ("max@test.dev", "alice@test.dev", "accepted"),
    ("bob@test.dev", "max@test.dev", "pending"),
]


def upsert_player(player_data):
    player = Player.query.filter_by(email=player_data["email"]).first()

    if player is None:
        player = Player(email=player_data["email"])
        db.session.add(player)

    for key, value in player_data.items():
        setattr(player, key, value)

    player.password_hash = generate_password_hash(DEV_PASSWORD)
    return player


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


def seed_dev_data():
    app = create_app()

    with app.app_context():
        db.create_all()

        players_by_email = {
            player_data["email"]: upsert_player(player_data)
            for player_data in PLAYERS
        }
        db.session.flush()

        for player_email, friend_email, status in FRIENDSHIPS:
            add_friendship(players_by_email, player_email, friend_email, status)

        db.session.commit()

        print("Seeded dev database.")
        print(f"Players: {len(PLAYERS)}")
        print(f"Friendships: {len(FRIENDSHIPS)}")
        print(f"Dev password for all seeded users: {DEV_PASSWORD}")


if __name__ == "__main__":
    seed_dev_data()
