from flask import Flask,render_template,redirect,request,url_for
from flask.ext.sqlalchemy import SQLAlchemy
import random
Card_Values = {1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:10,11:10,12:10,0:11}
player_wins = 0
computer_wins = 0
game_desk =""
game_started = False
player_hand=""
bankir_hand = ""
tile_width = 73.1
tile_heigth = 98.5
rangs_a = ("туз","двойка","тройка","четверка","пятерка","шестерка","семерка","восьмерка","девятка","десятка","валет","дама","король")
rangs = ("A","2","3","4","5","6","7","8","9","10","J","Q","K")
suits_images = {"трефы":chr(9827),"черви":chr(9829),"пики":chr(9824),"буби":chr(9830)}
suits = ("трефы","черви","пики","буби")
counter = 0
round_is_ongoing = False
winner = 0
coordx = 0
coordy = 0
busted = False
app = Flask(__name__)
app.config['DEBUG'] = True
SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="issue87",
    password="maggyh87",
    hostname="issue87.mysql.pythonanywhere-services.com",
    databasename="issue87$comments",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
db = SQLAlchemy(app)
Game_Started = False
class Desk:
    def __init__(self,number_of_cards):

        self.cards = []
        counter = 0
        while counter < len(rangs):
            counter_suits = 0
            while counter_suits < 4:
                self.cards.append(Card(counter,counter_suits,0))
                counter_suits +=1
            if number_of_cards == 36 and counter == 0:
                counter += 5
            else:
                counter += 1
        random.shuffle(self.cards)
    def take_card(self):
        return self.cards.pop()
    def get_first_card(self):
        return self.cards[0]
    def get_len_cards(self):
        return len(self.cards)
    def get_cards(self):
        return self.cards

class Card:
    def __init__(self,rang,suit,value):
        self.rang = rang
        self.suit = suit
        self.value = value
    def __str__(self):
        return("rang is "+rangs_a[self.rang]+ "; suit is " + suits[self.suit])
    def get_value(self):
        return self.value
    def set_value(self,value):
        self.value = value
    def get_rang(self):
        return self.rang
    def get_suit(self):
        return self.suit
class Hand:
    def __init__(self):
        self.cards = []
    def __str__(self):
        cards_in_hand = "Hand contains "
        for card in self.cards:
            cards_in_hand += " " + str(card)
        return cards_in_hand
    def give_card(self,card):
        self.cards.append(card)


    def clear_hand(self):
        self.cards = []
    def get_len(self):
        return len(self.cards)
    def get_cards_in_hand(self):
        return self.cards
    def get_values_of_hand(self):
        value = 0
        for card in self.cards:
            value += card.get_value()
        return value

class Comment(db.Model):

    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(4096))
def start_game_handler():
    global player_wins, computer_wins, round_is_ongoing,game_started
    player_wins = 0
    computer_wins = 0
    round_is_ongoing = False
    deal_handler()
    game_started = True
def hit_handler():
    global busted
    if round_is_ongoing:
        get_card_to_hand(player_hand)
        if player_hand.get_values_of_hand()>21:
            busted = True
            result_of_round(True)

def stand_handler():
    if round_is_ongoing:
        while bankir_hand.get_values_of_hand() < 17:
            get_card_to_hand(bankir_hand)
        result_of_round(False)
def deal_handler():
    global game_desk,player_hand,bankir_hand
    global game_started
    global image_on_canvas
    global round_is_ongoing
    global winner
    global busted
    winner = 0
    if not round_is_ongoing:
        game_desk = Desk(54)
        player_hand = Hand()
        bankir_hand = Hand()
        game_started = True
        get_card_to_hand(bankir_hand)
        get_card_to_hand(bankir_hand)
        get_card_to_hand(player_hand)
        get_card_to_hand(player_hand)
        round_is_ongoing = True
        busted = False

def get_card_to_hand(hand):
    card = game_desk.take_card()
    value = Card_Values[card.get_rang()]
    if value == 11 and hand.get_values_of_hand()>10:
        card.set_value(1)
    else:
        card.set_value(value)
    hand.give_card(card)
def result_of_round(player_lose):
    global player_wins,computer_wins,round_is_ongoing,winner
    if player_lose or (not (bankir_hand.get_values_of_hand()>21) and bankir_hand.get_values_of_hand()>= player_hand.get_values_of_hand()):
        computer_wins += 1
        winner = 1
    else:
        player_wins += 1
        winner = 2
    round_is_ongoing = False
@app.route('/', methods = ["GET","POST"])
def index():
    if player_hand != "":
        cards_in_hand = player_hand.get_cards_in_hand()
        values_in_player_hand = player_hand.get_values_of_hand()
    else:
        cards_in_hand = []
        values_in_player_hand = 0
    if bankir_hand != "":
        cards_in_dealer_hand = bankir_hand.get_cards_in_hand()
        values_in_dealer_hand = bankir_hand.get_values_of_hand()
    else:
        cards_in_dealer_hand = []
        values_in_dealer_hand = 0
    if request.method == "GET":
        return render_template("main.html",comments = Comment.query.all(),Game_Started = Game_Started,cards_in_hand = [ [card.get_rang(),card.get_suit()] for card in cards_in_hand],dealer_hand = [ [card.get_rang(),card.get_suit()] for card in cards_in_dealer_hand],tile_width = tile_width,tile_heigth = tile_heigth,round_is_ongoing=int(round_is_ongoing),busted = int(busted),game_started=int(game_started),values_in_dealer_hand = values_in_dealer_hand, values_in_player_hand =values_in_player_hand,player_wins = player_wins,dealer_wins = computer_wins)
    comment = Comment(content = request.form["contents"])
    db.session.add(comment)
    db.session.commit()
    return redirect(url_for('index'))
@app.route('/start_game', methods = ["POST"])
def start_game():
    start_game_handler()
    return redirect(url_for('index'))
@app.route('/hit', methods = ["POST"])
def hit():
    hit_handler()
    return redirect(url_for('index'))
@app.route('/deal', methods = ["POST"])
def deal():
    deal_handler()
    return redirect(url_for('index'))
@app.route('/stand', methods = ["POST"])
def stand():
    stand_handler()
    return redirect(url_for('index'))