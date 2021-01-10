from app import db
import datetime

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userID = db.Column(db.Integer,db.ForeignKey('user.id'))
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    transactionType =  db.Column(db.String())  #change to ID from foreign key if there is time
    currencyType = db.Column(db.String())
    netChange = db.Column(db.Float)
    def __init__(self,userID,currencyType,transactionType,netChange,amount=0):
        self.userID = userID
        self.currencyType = currencyType
        self.transactionType = transactionType
        self.netChange = netChange

    def __repr__(self):
        return '<id {}>'.format(self.id)
        

    def serialize(self):
        return {
            'id': self.id, 
            'userID': self.userID,
            'transactionType':self.transactionType,
            'currencyType':self.currencyType,
            'netChange':self.netChange
        }