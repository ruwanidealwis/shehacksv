from flask import Flask, render_template,request,jsonify,redirect,url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import requests
import datetime
import json

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
            #print("User added. User id={}".format(str(user.id)))

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
            return str(user.id)
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
    currency_type = request.form['currency_type']
    cost = request.form['cost']
    rate = request.form['current_rate']
    crypto_gain = 1/float(rate)*float(cost)

    transaction=Transaction(
            userID= user,
            transactionType="buy",
            currencyType=currency_type,
            netChange=float(cost)*-1 #when you buy you lost money....
    )
    db.session.add(transaction)
    db.session.commit()

    cadWallet = Wallet.query.filter_by(userID=user, currencyType="CAD").first()
    cadWallet.amount -=  float(cost)
    cryptoWallet = Wallet.query.filter_by(userID=user, currencyType=currency_type).first()
    cryptoWallet.amount += float(crypto_gain)
    db.session.commit()
    return "hi"

@app.route("/sell", methods = ["POST"])
def sell_cryptocurrency():
    user = request.form['userID']
    currency_type = request.form['currency_type']
    amount_to_sell = request.form['sell_amount']
    rate = request.form['current_rate']
    money_gain = float(rate)*float(amount_to_sell)
    transaction=Transaction(
            userID= user,
            transactionType="sell",
            currencyType=currency_type,
            netChange=money_gain
    )
    db.session.add(transaction)
    db.session.commit()

    cadWallet = Wallet.query.filter_by(userID=user, currencyType="CAD").first()
    cadWallet.amount +=  float(money_gain)
   
    cryptoWallet = Wallet.query.filter_by(userID=user, currencyType=currency_type).first()
    cryptoWallet.amount -= float(amount_to_sell)
    db.session.commit()
    return "sold"

@app.route("/history", methods = ["GET"])
def get_coinHistory():
    coin = request.args.get("coin")
    if coin == "BeeCoin":
        coin = "BTC"
    else:
        coin = "ETH"
    today = datetime.date.today()
    #should trends from two weeks ago ...
    start = str(today - (datetime.timedelta(days=14))) + "T00%3A00%3A00Z"
    end = str(today - datetime.timedelta(days=13)) + "T00%3A00%3A00Z"
    print("https://api.nomics.com/v1/exchange-rates/history?currency={currency}&start={start}&end={end}&key={api_key}".format(currency=coin,start=start,end=end,api_key=os.environ['API_KEY']))
    r = requests.get("https://api.nomics.com/v1/exchange-rates/history?currency={currency}&start={start}&end={end}&key={api_key}".format(currency=coin,start=start,end=end,api_key=os.environ['API_KEY']))
   
 
    return jsonify(r.json())


@app.route("/viewTransactions", methods = ["GET"])
def viewTransactions():
    user = request.args.get("userID")
    #optional
    currency_type = request.args.get("currency_type")
    transaction_type = request.args.get("transaction_type")
     
    if currency_type:
        userTransactions = Transaction.query.filter_by(userID = user, currencyType=currency_type)
    elif transaction_type:
         userTransactions = Transaction.query.filter_by(userID = user, transactionType=transaction_type)   
    else:
        userTransactions = Transaction.query.filter_by(userID=user)

    transactionList = []

    for transactions in userTransactions:
        transactionList.append(transactions.serialize())

    return jsonify(transactionList)





@app.route("/viewWallet", methods = ["GET"])
def viewWallet():
    user = request.args.get("userID")
    #optional
    walletType = request.args.get("currency_type")
    if walletType:
        userWallet = Wallet.query.filter_by(userID = user, currencyType=walletType).first()
        return jsonify(userWallet.serialize())
    else:
        walletList = []
        userWallet = Wallet.query.filter_by(userID=user)
        for wallets in userWallet:
            walletList.append(wallets.serialize())
        return jsonify(walletList)

          
    
    
  


    












if __name__ == "__main__":
    app.run(debug=True)
