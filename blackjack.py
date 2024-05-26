from flask import Flask,render_template,redirect,request,url_for,session,flash,jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
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
app.secret_key = '443534593429583495n83445963t54ytyu4c653mu56783t94r836tyrtg845673564b378456tyr75tyr39k54534'
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
# class Desk:
#     def __init__(self,number_of_cards):
#         self.cards = []
#         counter = 0
#         while counter < len(rangs):
#             counter_suits = 0
#             while counter_suits < 4:
#                 self.cards.append(Card(counter,counter_suits,0))
#                 counter_suits +=1
#             if number_of_cards == 36 and counter == 0:
#                 counter += 5
#             else:
#                 counter += 1
#         random.shuffle(self.cards)
#     def take_card(self):
#         return self.cards.pop()
#     def get_first_card(self):
#         return self.cards[0]
#     def get_len_cards(self):
#         return len(self.cards)
#     def get_cards(self):
#         return self.card
# class Card:
#     def __init__(self,rang,suit,value):
#         self.rang = rang
#         self.suit = suit
#         self.value = value
#     def __str__(self):
#         return("rang is "+rangs_a[self.rang]+ "; suit is " + suits[self.suit])
#     def get_value(self):
#         return self.value
#     def set_value(self,value):
#         self.value = value
#     def get_rang(self):
#         return self.rang
#     def get_suit(self):
#         return self.suit
# class Hand:
#     def __init__(self):
#         self.cards = []
#     def __str__(self):
#         cards_in_hand = "Hand contains "
#         for card in self.cards:
#             cards_in_hand += " " + str(card)
#         return cards_in_hand
#     def give_card(self,card):
#         self.cards.append(card)
#     def clear_hand(self):
#         self.cards = []
#     def get_len(self):
#         return len(self.cards)
#     def get_cards_in_hand(self):
#         return self.cards
#     def get_values_of_hand(self):
#         value = 0
#         for card in self.cards:
#             value += card.get_value()
#         return value
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

def save_result_in_database(player_won,bet):
    if session['logged_in']:
        record_n = db.session.query(UserData).filter(UserData.login==session['username'])[0]
        record_n.loses += int(not player_won)
        record_n.wines += int(player_won)
        record_n.money += bet*((player_won*2)-1)
        db.session.commit()
    else:
        session['wins'] = int(player_won)
        session['loses'] = int(not player_won)
        session['money'] = bet*((player_won*2)-1)

def get_user_data(login):
    user_records = db.session.query(UserData).filter(UserData.login ==  login).all()
    if len(user_records) > 0:
        userInfo = user_records[0]
        return userInfo
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

@app.route('/login', methods = ["GET","POST"])
def login():

    if request.method == "GET":
        if session.get('logged_in'):
            return redirect(url_for('index'))
        return render_template("login.html")

    user_data = get_user_data( request.form["login"])
    if not user_data:
        flash("Such user hasn't registered!")
        return redirect(url_for('login'))
    else:

        if not  check_password_hash(user_data.password, request.form["password"]):
            flash("Password isn't right!")
            return redirect(url_for('login'))
        init_user_in_game(request.form["login"])
        return redirect(url_for('index'))
@app.route('/login_ajax', methods = ["POST"])
def login_ajax():
    login = loses = wines = money  = None
    userSigned = True
    correctPassword = True
    user_data = get_user_data( request.form["login"])
    if not user_data:
        userSigned = False
        correctPassword = False
    elif not check_password_hash(user_data.password, request.form["password"]):
        correctPassword = False
    else:
        init_user_in_game(request.form["login"])
        login = user_data.login
        loses = user_data.loses
        wines = user_data.wines
        money = user_data.money
    return jsonify({"userSigned":userSigned,"correctPassword":correctPassword,"login":login,"loses":loses,"wines":wines,"money":money})
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
    session['logged_in'] = False
    return redirect(url_for('login'))
@app.route('/', methods = ["GET","POST"])
def index():
    #session['logged_in'] True or False
    if request.method == "GET":
        vk = False
        if 'logged_in' not in session:
            session['logged_in'] = False
        if session['logged_in']:
            user_data = get_user_data(session['username'])
            user_money = user_data.money
            vk = int(user_data.vk)
            player_wins = user_data.wines
            dealer_wins = user_data.loses
        else:
            if 'money' not in session:
                session['money'] = 100
                session['wins'] = 0
                session['loses'] = 0
                session.permanent = True
            user_money = session['money']
            session['username'] = "guest"
            player_wins = session['wins']
            dealer_wins = session['loses']
        return render_template("game_most_js.html",
                                          comments = get_comments_with_author(Comment.query.all()),
                                          player_wins = player_wins,
                                          dealer_wins = dealer_wins,
                                          money = user_money,
                                          login = session['username'],
                                          vk = vk,
                                          logged_in = session['logged_in']
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
        return render_template("game_most_js_test.html",
		                                  logged_in = int(session['logged_in']),
                                          comments = get_comments_with_author(Comment.query.all()),
                                          player_wins = user_data.wines,
                                          dealer_wins = user_data.loses,
                                          money = user_data.money,
                                          login = session['username'],
                                          vk = int(user_data.vk)
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
    return jsonify({"won":result,"bet":bet})#in previoos versions who wins was determined on the server, from that time this statement exists
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
@app.route('/rating',methods = ["GET","POST"])
def raiting():
    start_row = 1
    if request.method == "POST":
        start_row = int(request.form["targetNavPage"]);
    offset_number = start_row - 1
    number_of_users = UserData.query.count()
    users = UserData.query.order_by(desc(UserData.wines - UserData.loses)).offset(offset_number).limit(20).all()
    for user in users:
        user.password = str(user.wines-user.loses)
        user.wines = str(user.wines)
        user.loses = str(user.loses)
    users.sort(key=sort_by_differ)
    return render_template("rating.html",users = users, startRow =  start_row, numberOfUsers = number_of_users)
@app.route('/record_result',methods = ["GET"])
def record_result():
    flash("Record function worked")