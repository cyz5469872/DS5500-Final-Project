from flask import Flask
from flask_cors import CORS
from flask_restful import Api, Resource
import numpy as np
import pandas as pd
from sklearn.preprocessing import minmax_scale

app = Flask(__name__)
api = Api(app)
CORS(app)

class page1(Resource):
	def get(self, page, company, year, energy_type):
		json_list = []
		if(page == "page1"):
			if(energy_type == "electricity"):
				if(company == "all"):
					data = pd.read_csv("data/eee.csv")
					data = pd.DataFrame(data.loc[data["years"] == int(year)].reset_index(drop = True))
					for row in data.values:
						json_list.append({"cityname": row[0], "rating": row[3],"latitude":row[4], "longtitude":row[5]})
				else:
					data = pd.read_csv("data/eee.csv")
					data =data.loc[data["companies"] == company]
					data = pd.DataFrame(data.loc[data["years"] == int(year)].reset_index(drop = True))
					for row in data.values:
						json_list.append({"cityname": row[0], "rating": row[3],"latitude":row[4], "longtitude":row[5]})
			elif(energy_type == "gas"):
				if(company == "all"):
					data = pd.read_csv("data/ggg.csv")
					data = pd.DataFrame(data.loc[data["years"] == int(year)].reset_index(drop = True))
					for row in data.values:
						json_list.append({"cityname": row[0], "rating": row[3],"latitude":row[4], "longtitude":row[5]})
				else:
					data = pd.read_csv("data/ggg.csv")
					data =data.loc[data["companies"] == company]
					data = pd.DataFrame(data.loc[data["years"] == int(year)].reset_index(drop = True))
					for row in data.values:
						json_list.append({"cityname": row[0], "rating": row[3],"latitude":row[4], "longtitude":row[5]})
			else:
				e_data = pd.read_csv("eee.csv")
				g_data = pd.read_csv("ggg.csv")
				for row in e_data.values:
					json_list.append({"cityname": row[0], "company": row[2], "year": row[1], "type": "electricity", "rating": row[3], "latitude":row[4], "longtitude":row[5]})
				for row in g_data.values:
					json_list.append({"cityname": row[0], "company": row[2], "year": row[1], "type": "gas", "rating": row[3], "latitude":row[4], "longtitude":row[5]})
		return json_list

class page2LS(Resource):
	def get(self, year, city, output_type):
		json_list = []
		data = pd.DataFrame(predict_e)
		data = data.loc[data["city"] == city.upper()]
		data = pd.DataFrame(data.loc[data["years"] == int(year)].reset_index().loc[:, ["annual_consume_lowtarif_perc", "smartmeter_perc"]])
		Range = list(range(0,110,10))
		if(output_type == "l"):
			output = pd.cut(data["annual_consume_lowtarif_perc"].values, Range, right = False).value_counts().tolist()
		else:
			output = pd.cut(data["smartmeter_perc"].values, Range, right = False).value_counts().tolist()
		axis = [5,15,25,35,45,55,65,75,85,95]
		for index, data in zip(axis, output):
			json_list.append({"axis": index, "freq": data})
		return json_list
		
class page2C(Resource):
	def get(self, city):
		json_list = []
		data = pd.DataFrame(mean_LS)
		data = pd.DataFrame(data.loc[data["city"] == city.upper()][["years", "annual_consume"]].reset_index(drop = True))
		data = data.groupby("years").sum().reset_index()
		for year in range(2010, 2020):
			if(year in data["years"].tolist()):
				json_list.append({"years": year, "consume": data.loc[data["years"] == year, "annual_consume"].values[0]})
			else:
				json_list.append({"years": year, "consume": 0})
		return json_list
		
class page2mLS(Resource):
	def get(self, year):
		json_list = []
		data = pd.DataFrame(mean_LS.loc[mean_LS["years"] == int(year)][["smartmeter_perc", "annual_consume_lowtarif_perc", "annual_consume", "city", "companies"]].reset_index(drop = True))
		data["annual_consume"] = minmax_scale(data["annual_consume"],feature_range=(2, 20))
		for row in data.values:
			json_list.append({"sp": "%.2f" % row[0], "lp": "%.2f" % row[1], "c": row[2], "city":row[3], "company":row[4]})
		return json_list
		
api.add_resource(page1, "/<string:page>/<string:company>/<string:year>/<string:energy_type>")
api.add_resource(page2LS, "/<string:year>/<string:city>/<output_type>")
api.add_resource(page2C, "/<string:city>")
api.add_resource(page2mLS, "/year/<string:year>")

if __name__ == '__main__':
	mean_LS = pd.read_csv("data/mean_LS.csv")
	predict_e = pd.read_csv("data/predict_e_data.csv")
	app.run(debug=True)