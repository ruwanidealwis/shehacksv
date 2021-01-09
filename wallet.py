from app import db

class Wallet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userID = db.Column(db.Integer,db.ForeignKey('user.id'))
    amount = db.Column(db.Integer,default=0)
    currencyType = db.Column(db.String()) #change to ID from foreign key if there is time
    def __init__(self,userID,currencyType,amount):
        self.userID = userID
        self.currencyType = currencyType
        if amount:
            self.amount = amount

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id, 
            'userID': self.userID,
            'amount':self.amount,
            'currencyType':self.currencyType
        }
