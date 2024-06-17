from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Function to read player data CSV
def read_players_csv():
    return pd.read_csv('players.csv')

# Function to read location data CSV
def read_locations_csv():
    return pd.read_csv('locations.csv')

# Function to read map data CSV
def read_maps_csv():
    return pd.read_csv('maps.csv')

# Function to read game records CSV and merge with player, location, and map data
def read_games_csv():
    games_records = pd.read_csv('game_records.csv')
    player_records = read_players_csv()
    location_records = read_locations_csv()
    map_records = read_maps_csv()
    merged_records = games_records.merge(player_records, on='Player_Id', how='left').merge(location_records, on='Drop_Location', how='left')
    merged_records = merged_records.merge(map_records, on='Map_Id', how='left')
    return merged_records

# Route to fetch filters
@app.route('/api/filters', methods=['GET'])
def get_filters():
    game_records = read_games_csv()
    filters = {
        'Player_Id': game_records['Player_Id'].unique().tolist(),
        'Game_Id': game_records['Game_Id'].unique().tolist(),
        'Score': game_records['Score'].unique().tolist(),
        'Kills': game_records['Kills'].unique().tolist(),
        'Damage': game_records['Damage'].unique().tolist(),
        'Drop_Location': game_records['Drop_Location'].unique().tolist(),
        'Place': game_records['Place'].unique().tolist(),
        'Rebirths': game_records['Rebirths'].unique().tolist(),
        'Skin_Id': game_records['Skin_Id'].unique().tolist(),
        'Loadout_Id': game_records['Loadout_Id'].unique().tolist(),
        'TOD': game_records['TOD'].unique().tolist(),
        'Date': game_records['Date'].unique().tolist(),
        'perceived_fun': game_records['perceived_fun'].unique().tolist(),
        'Player_Tag': game_records['Player_Tag'].unique().tolist(),
        'Player_Name': game_records['Player_Name'].unique().tolist(),
        'Location_Name': game_records['Location_Name'].unique().tolist(),
        'Map_Name': game_records['Map_Name'].unique().tolist(),
    }
    return jsonify(filters)

# Route to fetch data based on filters
@app.route('/api/data', methods=['GET'])
def get_data():
    filters = request.args.to_dict(flat=False)

    # Split Player_Name if it contains a comma
    if 'Player_Name' in filters and ',' in filters['Player_Name'][0]:
        filters['Player_Name'] = filters['Player_Name'][0].split(',')

    game_records = read_games_csv()

    # Convert filter values to integers where applicable
    for key, values in filters.items():
        if values:
            filters[key] = [int(v) if v.isdigit() else v for v in values]

    # Apply filters to game_records
    game_records = return_called_data(filters, game_records)
    return jsonify(game_records.to_dict(orient='records'))

# Function to filter game records based on given filters
def return_called_data(filters, game_records):
    for key, values in filters.items():
        if values:
            if key == 'StartDate' or key == 'EndDate':
                if key == 'StartDate':
                    if values[0] == '':
                        values[0] = '1999-01-01'
                    game_records = game_records[pd.to_datetime(game_records['Date']) >= pd.to_datetime(values[0])]
                elif key == 'EndDate':
                    if values[0] == '':
                        values[0] = '2030-12-12'
                    game_records = game_records[pd.to_datetime(game_records['Date']) <= pd.to_datetime(values[0])]
            elif any(isinstance(value, str) and value.strip() or isinstance(value, int) for value in values):
                game_records = game_records[game_records[key].isin(values)]
    
    return game_records

if __name__ == '__main__':
    app.run(debug=True)
