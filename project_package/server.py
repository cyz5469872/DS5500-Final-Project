from flask import Flask
from flask_cors import CORS
from flask_restful import Api, Resource

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import minmax_scale
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
api = Api(app)
CORS(app)

class page1(Resource):
	def get(self, company, year, energy_type):
		json_list = []
		if(energy_type == "electricity"):
			if(company == "all"):
				data = page1_e_labeled.loc[page1_e_labeled["years"] == int(year)].reset_index(drop = True)
				for row in data.values:
					json_list.append({"cityname": row[0], "rating": row[5],"latitude":row[3], "longtitude":row[4]})
			else:
				data = page1_e_labeled.loc[(page1_e_labeled["companies"] == company) & (page1_e_labeled["years"] == int(year))].reset_index(drop = True)
				for row in data.values:
					json_list.append({"cityname": row[0], "rating": row[5],"latitude":row[3], "longtitude":row[4]})
		else:
			if(company == "all"):
				data = page1_g_labeled.loc[page1_g_labeled["years"] == int(year)].reset_index(drop = True)
				for row in data.values:
					json_list.append({"cityname": row[0], "rating": row[5],"latitude":row[3], "longtitude":row[4]})
			else:
				data = page1_g_labeled.loc[(page1_g_labeled["companies"] == company) & (page1_g_labeled["years"] == int(year))].reset_index(drop = True)
				for row in data.values:
					json_list.append({"cityname": row[0], "rating": row[5],"latitude":row[3], "longtitude":row[4]})
		return json_list

class page2PLS(Resource):
	def get(self, energy_type, year, city, output_type):
		json_list = []
		axis = [5,15,25,35,45,55,65,75,85,95]
		if(energy_type == "e"):
			if(output_type == "l"):
				data = e_lowtarif_count.loc[(e_lowtarif_count["city"] == city.upper()) & (e_lowtarif_count["years"] == int(year))]
				company = data["companies"].values[0]
				for cut in axis:
					if(cut in data["lowtarif_cut"].tolist()):
						json_list.append({"axis": cut, "freq": int(data.loc[data["lowtarif_cut"] == cut, "lowtarif_cut_count"].values[0]), "company": company})
					else:
						json_list.append({"axis": cut, "freq": 0, "company": company})
			else:
				data = e_smartmeter_count.loc[(e_smartmeter_count["city"] == city.upper()) & (e_smartmeter_count["years"] == int(year))]
				company = data["companies"].values[0]
				for cut in axis:
					if(cut in data["smartmeter_cut"].tolist()):
						json_list.append({"axis": cut, "freq": int(data.loc[data["smartmeter_cut"] == cut, "smartmeter_cut_count"].values[0]), "company": company})
					else:
						json_list.append({"axis": cut, "freq": 0, "company": company})
		else:
			if(output_type == "l"):
				c_axis = [10,30,50,70,90,110,130,150,170,190]
				data = g_c_per_conn_count.loc[(g_c_per_conn_count["city"] == city.upper()) & (g_c_per_conn_count["years"] == int(year))]
				company = data["companies"].values[0]
				for cut in c_axis:
					if(cut in data["c_per_conn_cut"].tolist()):
						json_list.append({"axis": cut, "freq": int(data.loc[data["c_per_conn_cut"] == cut, "c_per_conn_cut_count"].values[0]), "company": company})
					else:
						json_list.append({"axis": cut, "freq": 0, "company": company})
			else:
				data = g_smartmeter_count[(g_smartmeter_count["city"] == city.upper()) & (g_smartmeter_count["years"] == int(year))]
				company = data["companies"].values[0]
				for cut in axis:
					if(cut in data["smartmeter_cut"].tolist()):
						json_list.append({"axis": cut, "freq": int(data.loc[data["smartmeter_cut"] == cut, "smartmeter_cut_count"].values[0]), "company": company})
					else:
						json_list.append({"axis": cut, "freq": 0, "company": company})
		return json_list
		
class page2C(Resource):
	def get(self, energy_type, city):
		json_list = []
		if(energy_type == "e"):
			data = e_consume_data.loc[e_consume_data["city"] == city.upper(), ["years", "companies", "annual_consume"]].reset_index(drop = True)
		else:
			data = g_consume_data.loc[g_consume_data["city"] == city.upper(), ["years", "companies", "annual_consume"]].reset_index(drop = True)
		for year in range(2010, 2020):
			if(year in data["years"].tolist()):
				json_list.append({"years": year, "consume": data.loc[data["years"] == year, "annual_consume"].values[0], "company": data.loc[data["years"] == year, "companies"].values[0]})
			else:
				json_list.append({"years": year, "consume": 0, "company": "enexis"})
		return json_list
		
class page2mPLS(Resource):
	def get(self, energy_type, year):
		json_list = []
		if(energy_type == "e"):
			data = pd.DataFrame(mean_LS.loc[mean_LS["years"] == int(year), ["smartmeter_perc", "annual_consume_lowtarif_perc", "annual_consume", "city", "companies"]].reset_index(drop = True))
			data["annual_consume"] = minmax_scale(data["annual_consume"],feature_range=(2, 20))
			for row in data.values:
				json_list.append({"sp": "%.2f" % row[0], "lp": "%.2f" % row[1], "c": row[2], "city":row[3], "company":row[4]})
		else:
			data = pd.DataFrame(mean_CS.loc[mean_CS["years"] == int(year), ["smartmeter_perc", "c_per_conn", "annual_consume", "city", "companies"]]).reset_index(drop = True)
			data["annual_consume"] = minmax_scale(data["annual_consume"],feature_range=(2, 20))
			for row in data.values:
				json_list.append({"sp": "%.2f" % row[0], "lp": "%.2f" % row[1], "c": row[2], "city":row[3], "company":row[4]})
		return json_list
		
class page3modelV(Resource):
	def get(self, start_year, end_year):
		data = []
		if(start_year > end_year):
			temp = start_year
			start_year = end_year
			end_year = temp
		if(start_year > 2019 or end_year < 2010):
			start_year = 2010
			end_year = 2019
		else:
			if(start_year < 2010):
				start_year = 2010
			if(end_year > 2019):
				end_year = 2019
		end_year += 1
		for year in range(start_year, end_year):
			local_scaler = StandardScaler()
			raw_data = pd.read_csv("data/e_labeled_data/%s.csv" % year)
			raw_data = raw_data.loc[raw_data["consume_per_conn"] != np.inf].reset_index(drop = True)
			raw_data = raw_data.iloc[:, [1,2,3,4,5,6,8]]
			raw_data.iloc[:,[1,2,3]] = local_scaler.fit_transform(raw_data.iloc[:,[1,2,3]])
			data.append(raw_data)
		data = pd.concat(data, ignore_index = True)
		train_X, test_X, train_y, test_y = train_test_split(data.iloc[:,[0,1,2,3,4,5]], data.iloc[:,6], test_size = 0.4)
		global_scaler = StandardScaler()
		train_X.iloc[:,[0,4,5]] = global_scaler.fit_transform(train_X.iloc[:,[0,4,5]])
		test_X.iloc[:,[0,4,5]] = global_scaler.transform(test_X.iloc[:,[0,4,5]])
		
		# model
		model = RandomForestClassifier(n_estimators = 100, oob_score = True, n_jobs = 8)
		model.fit(train_X, train_y)
		cm = confusion_matrix(test_y, model.predict(test_X))
		cm = np.round(cm / cm.sum(axis=1)[:, np.newaxis], 2)
		return cm.tolist()
			
api.add_resource(page1, "/page1/<string:company>/<string:year>/<string:energy_type>")
api.add_resource(page2PLS, "/<string:energy_type>/<string:year>/<string:city>/<output_type>")
api.add_resource(page2C, "/<string:energy_type>/<string:city>")
api.add_resource(page2mPLS, "/mean/<string:energy_type>/<string:year>")
api.add_resource(page3modelV, "/model/<int:start_year>/<int:end_year>")

if __name__ == '__main__':
	page1_e_labeled = pd.read_csv("data/e_geocode_labeled.csv")
	page1_g_labeled = pd.read_csv("data/g_geocode_labeled.csv")
	
	e_consume_data = pd.read_csv("data/e_consume_data.csv")
	e_lowtarif_count = pd.read_csv("data/e_lowtarif_count.csv")
	e_smartmeter_count = pd.read_csv("data/e_smartmeter_count.csv")
	mean_LS = pd.read_csv("data/mean_LS.csv")
	
	g_consume_data = pd.read_csv("data/g_consume_data.csv")
	g_c_per_conn_count = pd.read_csv("data/g_c_per_conn_count.csv")
	g_smartmeter_count = pd.read_csv("data/g_smartmeter_count.csv")
	mean_CS = pd.read_csv("data/mean_CS.csv")
	app.run(debug=True)