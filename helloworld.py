from flask import Flask,render_template,redirect,request,url_for
from flask.ext.sqlalchemy import SQLAlchemy
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
class Comment(db.Model):

    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(4096))
comments = []
@app.route('/', methods = ["GET","POST"])
def index():
    if request.method == "GET":
        return render_template("main.html",comments = comments)
    comments.append(request.form["contents"])
    return redirect(url_for('index'))
@app.route('/start_game', methods = ["POST"])
def start_game():
    pass