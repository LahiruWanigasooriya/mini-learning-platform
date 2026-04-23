from pymongo import MongoClient
from app.config import MONGO_URI, DATABASE_NAME, COURSE_COLLECTION

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
course_collection = db[COURSE_COLLECTION]