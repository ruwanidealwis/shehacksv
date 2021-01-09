from flask import Flask, render_template,request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import requests
from datetime import date


migrate = Migrate()

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


from user import User
from wallet import Wallet
from transaction import Transaction

@app.route("/",methods=['GET', 'POST'])
def login( ):
    if request.method == 'POST':
        content = request.json
        name = content['username']
        email = content['email']
        try:
            user=User(
                name=name,
                email=email,
            )
            #save to database
            db.session.add(user)
            db.session.commit()


            #redirect to game page...
            print("User added. User id={}".format(user.id))

            # we create 3 wallets for the user 
            cadWallet=Wallet(
                userID=user.id,
                currencyType='CAD',
                amount = 50
            )
            beeWallet=Wallet(
                userID=user.id,
                currencyType='beeCoin',
                amount=0
               
            )
            acornWallet=Wallet(
                userID=user.id,
                currencyType='aCorn',
                amount=0
                
            )
            db.session.add(cadWallet)
            db.session.add(beeWallet)
            db.session.add(acornWallet)
           
            db.session.commit()
            return redirect(url_for('game?id=' + user.id))

        except Exception as e:
	        return(str(e))
    if request.method == 'GET':
        return "Soon to be login page..."

@app.route("/game",methods=['GET'])
def game():
    print(request.args.get('id', ''))
    return "soon to be game page"

@app.route("/buy", methods = ["POST"])
def buy_currency():
    user = request.form['userID']
    currencyType = request.form['currencyType']
    cost = request.form['cost']
    cryptogain = request.form['gain']
    transaction=Transaction(
            userID= userID,
            transactionType=transactionType,
            currencyType=currencyType,
            netChange=cryptogain
    )
    db.session.add(transaction)
    db.session.commit()

    Wallet.query.filter_by(userID=user, wallet="CAD").update({"amount": (amount -cost)})
    Wallet.query.filter_by(userID=user, wallet=currencyType).update({"amount": (amount + cryptogain)})
    session.commit()

@app.route("/sell", methods = ["POST"])
def sell_cryptocurrency():
    user = request.form['userID']
    currencyType = request.form['currencyType']
    gain = request.form['gain']
    cryptoloss = request.form['loss']
    transaction=Transaction(
            userID= user,
            transactionType=transactionType,
            currencyType=currencyType,
            netChange=cryptogain
    )
    db.session.add(transaction)
    db.session.commit()

    Wallet.query.filter_by(userID=user, wallet="CAD").update({"amount": (amount + gain)})
    Wallet.query.filter_by(userID=user, wallet=currencyType).update({"amount": (amount - cryptoloss)})
    session.commit()

@app.route("/history?", methods = ["POST"])
def get_coinHistory():
    coin = request.args.get("coinname")
    today = date.today()
    #should trends from two weeks ago ...
    start = today - DT.timedelta(days=14) + "T00%3A00%3A00Z"
    end = today - DT.timedelta(days=7) + "T00%3A00%3A00Z"
    r = requests.get("https://api.nomics.com/v1/exchange-rates/history?currency={currency}start={start}&end={end}key={api_key}").format(currency="coin",start=start,end=end,api_key=os.environ['API_KEY'])
    return r


@app.route("/viewTransactions", methods = ["GET"])
def viewTransactions():
      
      #get all transactions
      transactions = Transaction.query.filter_by(userID=user)
      print(transactions)




@app.route("/viewWallet", methods = ["GET"])
def viewWallet():

    #get wallet...
    userWallet = Wallet.query.filter_by(userID=user)
    print(userWallet)


    












if __name__ == "__main__":
    app.run(debug=True)
