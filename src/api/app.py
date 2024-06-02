# This is a sample Python script.

# Press ⌃R to execute it or replace it with your code.
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.
import os    
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/api/data')
def get_data():
    game_records = read_games_csv()
    filters = {'Player_Id': [1], 'Map': [1, 2], 'Drop_Location': [2, 18], 'Skin_Id': [1], 'Got_Loadout': ['Y', 'N'],
               'Loadout_Id': [1, -1]}
    game_records = return_called_data(filters, game_records)
    print(game_records.to_string())
    # Convert DataFrame to JSON and return
    return jsonify(game_records.to_dict(orient='records'))

# Bar graph with each of the results field being a bar
# TODO figure out scaling with the different values
def build_graph(games_record):
    avg_score = games_record['Score'].mean()
    avg_kills = games_record['Kills'].mean()
    avg_damage = games_record['Damage'].mean()
    avg_place = games_record['Place'].mean()
    avg_rebirths = games_record['Rebirths'].mean()


# filter = {col_name:[value1, value2],....}
def return_called_data(filters, game_records):
    print(filters)
    for filter in filters:
        game_records = game_records[(game_records[filter].isin(filters[filter]))]

    print(game_records.to_string())
    return game_records


def read_games_csv():
    games_records = pd.read_csv('game_records_test.csv')
    print(games_records.to_string())

    return games_records


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    app.run(debug=True)
