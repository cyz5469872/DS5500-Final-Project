from flask import Flask
from flask_cors import CORS
from flask_restful import Api, Resource
import numpy as np
import pandas as pd

app = Flask(__name__)
api = Api(app)
CORS(app)

class ROC(Resource):
	def get(self, page):
		json_list = []
		if(page == "page1"):
			e_data = pd.read_csv("e_city_data.csv")
			g_data = pd.read_csv("g_city_data.csv")
			
			for row in e_data.values:
				json_list.append({"cityname": row[0], "company": row[2], "year": row[1], "type": "electricity", "rating": row[3]})
			for row in g_data.values:
				json_list.append({"cityname": row[0], "company": row[2], "year": row[1], "type": "gas", "rating": row[3]})
		return json_list


api.add_resource(ROC, "/<string:page>")

if __name__ == '__main__':
	app.run(debug=True)