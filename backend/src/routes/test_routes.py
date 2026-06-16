from flask import Blueprint, request, jsonify
import uuid
from datetime import date
from werkzeug.security import check_password_hash, generate_password_hash
from ..database.models import Game, Player, PlayerStats
from ..database.models import friendships, game_participants
from .. import db
from ..database.schema import PlayerSchema, PlayerStatsSchema

test_routes = Blueprint('test_routes', __name__)

player_schema = PlayerSchema()
players_schema = PlayerSchema(many=True)
player_stats_schema = PlayerStatsSchema()

PLAYER_STATS_FIELDS = (
    "beachvolleyball_serve",
    "beachvolleyball_receive",
    "beachvolleyball_set",
    "beachvolleyball_hit",
    "beachvolleyball_block",
    "beachvolleyball_effort",
    "beachvolleyball_mentality",
    "beachvolleyball_quick",
    "football_quick",
    "general_quick",
)

RECENT_GAMES_LIMIT = 10

@test_routes.route('/', methods = ['GET'])
def test_output():
    return jsonify({'name': 'TESTTESTWorld'})

@test_routes.route('/insert_db', methods = ['GET'])
def test_database():

    player1 = Player(name='Jerry1')
    db.session.add(player1)
    db.session.commit()

    players = Player.query.all()
    print(players)

    player2 = Player(name='Jerry2')
    db.session.add(player2)
    db.session.commit()

    players = Player.query.all()
    print(players)

    return player_schema.jsonify(player2)

@test_routes.route('/register_player', methods = ['GET'])
def register_player():
    """
    data = request.get_json()

    # Extract the fields from the request
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    """
    password = "testtesttest123"

    # Generate a unique friend-key using UUID
    friend_key = str(uuid.uuid4())

    # Hash the password before storing it
    hashed_password = generate_password_hash(password)

    player1 = Player(name='Jerry1', password_hash = hashed_password, friendcode = friend_key)
    db.session.add(player1)
    db.session.commit()

    players = Player.query.all()
    print(players)

    player2 = Player(name='Jerry2', password_hash = hashed_password, friendcode = friend_key)
    db.session.add(player2)
    db.session.commit()

    players = Player.query.all()
    print(players)

    return player_schema.jsonify(player2)

@test_routes.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    player = Player.query.filter_by(email=email).first()

    if player is None or not player.password_hash or not check_password_hash(player.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify(
        {
            "token": str(uuid.uuid4()),
            "player": {
                "id": player.id,
                "name": player.name,
                "email": player.email,
                "friendcode": player.friendcode,
            },
        }
    )




# TODO change it so that friend-codes get sent and are converted to IDs
@test_routes.route("/send_friend_request", methods=["POST"])
def send_friend_request():
    data = request.json
    player_id = data.get("player_id")
    friend_id = data.get("friend_id")

    if not player_id or not friend_id:
        return jsonify({"error": "player_id and friend_id are required"}), 400

    
    # Check if a request already exists
    existing_request = db.session.execute(
        friendships.select().where(
            (friendships.c.player_id == player_id) & (friendships.c.friend_id == friend_id)
        )
    ).fetchone()

    if existing_request:
        return jsonify({"message": "Friend request already sent or exists"}), 400

    # Insert new friend request
    stmt = friendships.insert().values(player_id=player_id, friend_id=friend_id, status="pending")
    db.session.execute(stmt)
    db.session.commit()

    return jsonify({"message": "Friend request sent successfully"})

@test_routes.route("/accept_friend_request", methods=["POST"])
def accept_friend_request():
    data = request.json
    player_id = data.get("player_id")
    friend_id = data.get("friend_id")

    if not player_id or not friend_id:
        return jsonify({"error": "player_id and friend_id are required"}), 400

    # Update friendship status
    stmt = friendships.update().where(
        (friendships.c.player_id == friend_id) & (friendships.c.friend_id == player_id)  # Reversed order
    ).values(status="accepted")

    result = db.session.execute(stmt)
    db.session.commit()

    if result.rowcount == 0:
        return jsonify({"message": "No pending friend request found"}), 404

    return jsonify({"message": "Friend request accepted"})

@test_routes.route("/get_friends/<int:player_id>", methods=["GET"])
def get_friends(player_id):
    accepted_friendships = db.session.execute(
        friendships.select().where(
            (
                (friendships.c.player_id == player_id)
                | (friendships.c.friend_id == player_id)
            )
            & (friendships.c.status == "accepted")
        )
    ).fetchall()

    friend_ids = [
        row.friend_id if row.player_id == player_id else row.player_id
        for row in accepted_friendships
    ]

    friends = Player.query.filter(Player.id.in_(friend_ids)).all() if friend_ids else []

    friend_list = [{"id": friend.id, "name": friend.name, "email": friend.email} for friend in friends]

    return jsonify({"player_id": player_id, "friends": friend_list})

@test_routes.route("/players/<int:player_id>/recent-games", methods=["GET"])
def get_recent_games(player_id):
    player = db.session.get(Player, player_id)

    if player is None:
        return jsonify({"error": "Player not found"}), 404

    try:
        requested_limit = int(request.args.get("limit", RECENT_GAMES_LIMIT))
    except (TypeError, ValueError):
        requested_limit = RECENT_GAMES_LIMIT

    limit = max(1, min(requested_limit, RECENT_GAMES_LIMIT))
    player_games = (
        db.session.execute(
            db.select(Game, game_participants.c.team)
            .join(game_participants, Game.id == game_participants.c.game_id)
            .where(game_participants.c.player_id == player_id)
            .where(Game.is_valid.is_(True))
            .order_by(Game.ended_at.desc(), Game.id.desc())
            .limit(limit)
        )
        .all()
    )

    recent_games = []

    for game, player_team in player_games:
        participant_rows = (
            db.session.execute(
                db.select(
                    Player.id,
                    Player.name,
                    Player.email,
                    game_participants.c.team,
                )
                .join(game_participants, Player.id == game_participants.c.player_id)
                .where(game_participants.c.game_id == game.id)
                .order_by(game_participants.c.team.asc(), Player.name.asc())
            )
            .all()
        )

        teams = {"team_a": [], "team_b": []}

        for participant_id, name, email, team in participant_rows:
            teams[team].append(
                {
                    "id": participant_id,
                    "name": name,
                    "email": email,
                }
            )

        recent_games.append(
            {
                "id": game.id,
                "game_id": game.game_id,
                "game_type": game.game_type.name if game.game_type else None,
                "ended_at": game.ended_at.isoformat() if game.ended_at else None,
                "duration_seconds": game.duration_seconds,
                "winning_team": game.winning_team,
                "player_team": player_team,
                "result": "won" if game.winning_team == player_team else "lost",
                "team_a_score": game.team_a_score,
                "team_b_score": game.team_b_score,
                "teams": teams,
            }
        )

    return jsonify({"player_id": player_id, "games": recent_games})

@test_routes.route("/playerstats/<int:player_id>", methods=["GET"])
def get_player_stats(player_id):
    player = db.session.get(Player, player_id)

    if player is None:
        return jsonify({"error": "Player not found"}), 404

    stats = PlayerStats.query.filter_by(player_id=player_id).first()

    if stats is None:
        return jsonify({"player_id": player_id, "stats": None})

    return jsonify({"player_id": player_id, "stats": player_stats_schema.dump(stats)})

@test_routes.route("/playerstats/<int:player_id>", methods=["PUT"])
def update_player_stats(player_id):
    player = db.session.get(Player, player_id)

    if player is None:
        return jsonify({"error": "Player not found"}), 404

    data = request.json or {}
    stats = PlayerStats.query.filter_by(player_id=player_id).first()

    if stats is None:
        stats = PlayerStats(player_id=player_id)
        db.session.add(stats)

    for field in PLAYER_STATS_FIELDS:
        if field not in data:
            continue

        value = data.get(field)

        if not isinstance(value, int) or value < 0 or value > 10:
            return jsonify({"error": f"{field} must be an integer from 0 to 10"}), 400

        setattr(stats, field, value)

    stats.last_updated = date.today()
    db.session.commit()

    return jsonify({"player_id": player_id, "stats": player_stats_schema.dump(stats)})
