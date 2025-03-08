from .. import ma

class PlayerSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'password_hash', 'friendcode', 'played_matches', 'won_matches', 'lost_matches')