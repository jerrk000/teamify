from .. import ma

class PlayerSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'password_hash', 'friendcode', 'played_matches', 'won_matches', 'lost_matches')

class GameSchema(ma.Schema):
    class Meta:
        fields = ('id', 'game_id', 'game_type_id', 'ended_at', 'duration_seconds', 'winning_team', 'team_a_score', 'team_b_score', 'is_valid')

class GameTypeSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name')
