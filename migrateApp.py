from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
app = Flask(__name__)
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
migrate = Migrate(app,db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)
class Comment(db.Model):

    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(4096))
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"))
class UserData(db.Model):
    __tablename__ = "users"
    login = db.Column(db.String(10))
    password = db.Column(db.String(10))
    id = db.Column(db.Integer,primary_key=True)
    wines = db.Column(db.Integer)
    loses = db.Column(db.Integer)
    money = db.Column(db.Integer)
    comments = db.relationship("Comment")
    vk =db.Column(db.Boolean)
if __name__ == '__main__':
    manager.run()