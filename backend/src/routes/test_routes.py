from flask import Blueprint, request, jsonify
import uuid
from werkzeug.security import generate_password_hash
from ..database.models import Player
from ..database.models import friendships
from .. import db
from ..database.schema import PlayerSchema

test_routes = Blueprint('test_routes', __name__)

player_schema = PlayerSchema()
players_schema = PlayerSchema(many=True)

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
    friends = db.session.query(Player).join(
        friendships, Player.id == friendships.c.friend_id
    ).filter(
        friendships.c.player_id == player_id,
        friendships.c.status == "accepted"
    ).all()

    friend_list = [{"id": friend.id, "name": friend.name, "email": friend.email} for friend in friends]

    return jsonify({"player_id": player_id, "friends": friend_list})


