from flask import Flask,render_template,redirect,request,url_for,session,flash,jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash,check_password_hash
import random
games_session ={}
Card_Values = {1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:10,11:10,12:10,0:11}
tile_width = 73.1
tile_heigth = 98.5
rangs_a = ("туз","двойка","тройка","четверка","пятерка","шестерка","семерка","восьмерка","девятка","десятка","валет","дама","король")
rangs = ("A","2","3","4","5","6","7","8","9","10","J","Q","K")
suits_images = {"трефы":chr(9827),"черви":chr(9829),"пики":chr(9824),"буби":chr(9830)}
suits = ("трефы","черви","пики","буби")
app = Flask(__name__)
app.secret_key = '443534593429583495n83445963t54ytyu4c653mu3t94r836g843b378539k54534'
app.config['DEBUG'] = False
SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="issue87",
    password="maggyh87",
    hostname="issue87.mysql.pythonanywhere-services.com",
    databasename="issue87$comments",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
db = SQLAlchemy(app)
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
class BlackJackGame:
    def  __init__(self,wines,loses,money,vk):

        self.game_desk = ""
        self.player_wins = wines
        self.computer_wins = loses
        self.money = money
        self.game_started = False
        self.player_hand=""
        self.bankir_hand = ""
        self.round_is_ongoing = False
        self.busted = False
        self.vk =vk
    def set_game_desk(self,number_of_cards):
        self.game_desk = Desk(number_of_cards)
    def get_game_desk(self):
        return self.game_desk
    def get_wines(self):
        return self.player_wins
    def get_loses(self):
        return self.computer_wins
    def record_result(self,is_user_win):
        if is_user_win:
            self.player_wins += 1
        else:
            self.computer_wins += 1
    def create_hands(self):
        self.player_hand = Hand()
        self.bankir_hand = Hand()
    def get_user_hand(self):
        return self.player_hand
    def get_dealer_hand(self):
        return self.bankir_hand
    def set_round_is_ongoing(self,round_is_ongoing):
        self.round_is_ongoing = round_is_ongoing
    def get_round_is_ongoing(self):
        return self.round_is_ongoing
    def start_game(self):
        self.game_started = True
    def is_game_started(self):
        return self.game_started
    def set_busted(self,is_busted):
        self.busted = is_busted
    def is_busted(self):
        return self.busted
    def is_vk(self):
        vk = self.vk
        if vk is None:
            return False
        else:
            return self.vk
class Comment(db.Model):

    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(4096))
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"))
class UserData(db.Model):
    __tablename__ = "users"
    login = db.Column(db.String(10))
    password = db.Column(db.String(128))
    id = db.Column(db.Integer,primary_key=True)
    wines = db.Column(db.Integer)
    loses = db.Column(db.Integer)
    money = db.Column(db.Integer)
    comments = db.relationship("Comment",backref = "author",lazy = "dynamic")
    vk =db.Column(db.Boolean)
def hit_handler():
    if games_session[session['username']].get_round_is_ongoing():
        get_card_to_hand(games_session[session['username']].get_user_hand())
        if games_session[session['username']].get_user_hand().get_values_of_hand()>21:
            games_session[session['username']].set_busted(True)
            result_of_round(True)

def stand_handler():
    if games_session[session['username']].get_round_is_ongoing():
        while games_session[session['username']].get_dealer_hand().get_values_of_hand() < 17:
            get_card_to_hand(games_session[session['username']].get_dealer_hand())
        result_of_round(False)
def deal_handler():
    if not games_session[session['username']].get_round_is_ongoing():
        games_session[session['username']].set_game_desk(54)
        games_session[session['username']].start_game()
        games_session[session['username']].create_hands()
        get_card_to_hand(games_session[session['username']].get_dealer_hand())
        get_card_to_hand(games_session[session['username']].get_dealer_hand())
        get_card_to_hand(games_session[session['username']].get_user_hand())
        get_card_to_hand(games_session[session['username']].get_user_hand())
        games_session[session['username']].set_round_is_ongoing(True)
        games_session[session['username']].set_busted(False)

def get_card_to_hand(hand):
    card = games_session[session['username']].get_game_desk().take_card()
    value = Card_Values[card.get_rang()]
    if value == 11 and hand.get_values_of_hand()>10:
        card.set_value(1)
    else:
        card.set_value(value)
    hand.give_card(card)
def save_result_in_database(player_won,bet):
    record_n = db.session.query(UserData).filter(UserData.login==session['username'])[0]
    record_n.loses += int(not player_won)
    record_n.wines += int(player_won)
    record_n.money += bet*((player_won*2)-1)
    db.session.commit()
def result_of_round(player_lose):
    global player_wins,computer_wins
    if player_lose or (not (games_session[session['username']].get_dealer_hand().get_values_of_hand()>21) and games_session[session['username']].get_dealer_hand().get_values_of_hand()>= games_session[session['username']].get_user_hand().get_values_of_hand()):
        games_session[session['username']].record_result(False)
        save_result_in_database(False)
    else:
        games_session[session['username']].record_result(True)
        save_result_in_database(True)
    games_session[session['username']].set_round_is_ongoing(False)
def get_user_data(login):
    user_records = db.session.query(UserData).filter(UserData.login ==  login).all()
    if len(user_records) > 0:
        userInfo = user_records[0]
        return userInfo
    else:
        return False
def init_user_in_game(login):
    session['username'] = login
    session['logged_in'] = True
def sort_by_differ(user):
    return(int(user.password)*(-1))
def register_user(login, password,vk):
    password_hash = generate_password_hash(password)
    user_info = UserData(login = login,password = password_hash,wines = 0,loses = 0,money = 100,vk=vk)
    db.session.add(user_info)
    db.session.commit()
def get_comments_with_author(comments):
    comments_and_author = []

    for comment in comments:
        if comment.author is None:
            login = ""
        else:
            login = comment.author.login
        comments_and_author.append([login,comment.content])
    return comments_and_author
def addMoneyToUsers():
    users = UserData.query.all()
    for user in users:
        user.money += 100
    db.session.commit()
@app.route('/', methods = ["GET","POST"])
def login():
    if request.method == "GET":
        if session.get('logged_in') and not games_session[session['username']].is_vk():
            return redirect(url_for('index'))
        else:
            return render_template("login.html")
    user_data = get_user_data( request.form["login"])
    if not user_data:
        flash("Such user hasn't registered!")
        return redirect(url_for('login'))
    else:

        if not  check_password_hash(user_data.password, request.form["password"]):
            flash("Password isn't right!")
            return redirect(url_for('login'))
        else:
            init_user_in_game(request.form["login"])
            return redirect(url_for('index'))
@app.route('/login_ajax', methods = ["POST"])
def login_ajax():
    login,loses,wines,money,comments
    userSigned = True
	correctPassword = True
    user_data = get_user_data( request.form["login"])
	if not user_data:
	    userSigned = False
    elif not check_password_hash(user_data.password, request.form["password"]):
        correctPassword = False	
	else:
	    init_user_in_game(request.form["login"])
		login = user_data.login
		loses = user_data.loses
		wines = user_data.wines
		money = user_data.money
		comments = user_data.comments
	return jsonify({"userSigned":userSigned,"correctPassword":correctPassword,"login":login
	                                                                         ,"loses":loses
																			 ,"wines":wines
																			 ,"money":money
																			 ,"comments":comments
																			 })
@app.route('/registration', methods = ["GET","POST"])  
def registration():
    if request.method == "GET":
        return render_template("registration.html")
    user_data =  get_user_data(request.form["login"])
    if not user_data:
        if request.form["login"].isalnum() and not request.form["login"].isdigit() :
            register_user(request.form["login"],request.form["password"],False)
            message = "You have registrited"
            flash(message)
        else:
            message = "Login can consist of letters and digits, but must consist at least one letter!"
            flash(message)
        return redirect(url_for('registration'))
    else:
        message = "Such user already exists!"
        flash(message)
        return redirect(url_for('registration'))
@app.route('/logout', methods = ["GET"])
def logout():
    vk = games_session[session['username']].is_vk()
    session['logged_in'] = False
    del games_session[session['username']]
    if vk:
        return redirect(url_for('vk'))
    else:
        return redirect(url_for('login'))
@app.route('/blackjack', methods = ["GET","POST"])
def index():
    if session['logged_in'] == False:
        return redirect(url_for('login'))
    if request.method == "GET":
        user_data = get_user_data(session['username'])
        return render_template("main_blackjack.html",
                                          comments = get_comments_with_author(Comment.query.all()),
                                          player_wins = user_data.wines,
                                          dealer_wins = user_data.loses,
                                          money = user_data.money,
                                          login = session['username'],
                                          vk = games_session[session['username']].is_vk()
                                          )
    author_id = get_user_data(session['username']).id
    comment = Comment(content = request.form["contents"],user_id = author_id)
    db.session.add(comment)
    db.session.commit()
    return redirect(url_for('index'))
@app.route('/test', methods = ["GET","POST"])
def test():
    if session['logged_in'] == False:
        return redirect(url_for('login'))
    if request.method == "GET":
        user_data = get_user_data(session['username'])
        return render_template("main_blackjack_dev.html",
		                                  logged_in = int(session['logged_in']),
                                          comments = get_comments_with_author(Comment.query.all()),
                                          player_wins = user_data.wines,
                                          dealer_wins = user_data.loses,
                                          money = user_data.money,
                                          login = session['username'],
                                          vk = games_session[session['username']].is_vk()
                                          )

    author_id = get_user_data(session['username']).id
    comment = Comment(content = request.form["contents"],user_id = author_id)
    db.session.add(comment)
    db.session.commit()
    return redirect(url_for('test'))
@app.route('/ajax_sent_result', methods = ["POST"])
def ajax_sent_result():
    result = request.form["won"]
    bet = int(request.form["bet"])
    if result == "true":
        result = True
    else:
        result = False
    save_result_in_database(result,bet)
    return jsonify({"won":result,"bet":bet})
@app.route('/hit', methods = ["GET"])
def hit():
    hit_handler()
    return redirect(url_for('index'))
@app.route('/deal', methods = ["GET"])
def deal():
    deal_handler()
    return redirect(url_for('index'))
@app.route('/stand', methods = ["GET"])
def stand():
    stand_handler()
    return redirect(url_for('index'))
@app.route('/vk',methods = ["GET"])
def vk():
    #viewer_id = request.args.get("viewer_id")
    #user_data = get_user_data(viewer_id)
    return render_template("vk.html")
@app.route('/vk_start',methods = ["POST"])
def vk_start():
    if not session.get('logged_in'):
        viewer_id = request.form["vk_id"]
        user_data = get_user_data(viewer_id)
        if not user_data:
            register_user(viewer_id,"",True)
        user_data = get_user_data(viewer_id)
        init_user_in_game(viewer_id)
    return redirect(url_for('index'))
@app.route('/raiting',methods = ["GET"])
def raiting():
    users = UserData.query.all()
    for user in users:
        user.password = str(user.wines-user.loses)
        user.wines = str(user.wines)
        user.loses = str(user.loses)
    users.sort(key=sort_by_differ)
    return render_template("raiting.html",users = users )
@app.route('/record_result',methods = ["GET"])
def record_result():
    flash("Record function worked")

