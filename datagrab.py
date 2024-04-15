import pandas as pd
from collegebaseball import ncaa_scraper
from collegebaseball import lookup
from collegebaseball import metrics
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin
cred = credentials.Certificate('college-baseball-app\college-baseball-stats-firebase-adminsdk-zu0jt-677dbcade4.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

team_ids = [2,721,5,8,6,7,9,14,17,27,29,28,31,30,32,2678,725,37,43,47,51,14927,61,62,66,67,71,72,77,80,81,83,86,87,94,90,97,101,107,30135,115,116,1004,127,128,129,48,136,140,147,149,1014,158,164,165,167,169,1045,172,173,175,180,178,30095,193,196,198,201,202,204,1068,219,220,222,235,228,229,28755,231,234,236,96,244,1092,248,249,251,257,253,254,255,260,261,1104,272,275,277,19651,283,285,288,287,301,299,302,2743,306,305,310,312,314,316,315,317,328,327,1157,331,334,340,342,346,352,355,28600,99,361,363,365,366,498,367,370,380,381,386,388,392,391,393,400,368,402,404,406,415,414,418,416,419,428,433,430,432,434,669,439,444,450,454,726,463,464,466,465,471,473,472,474,477,482,483,485,487,457,488,489,490,456,458,459,460,494,493,2711,500,502,503,505,509,508,513,514,519,518,522,521,523,527,529,528,534,539,540,541,545,551,553,1320,554,559,562,563,572,574,575,576,587,102,590,624,625,627,626,629,630,631,632,1356,635,639,646,648,10411,649,651,654,655,665,657,659,660,664,610,596,603,606,609,617,674,676,678,683,1395,690,694,692,695,703,697,26172,698,699,670,700,702,536,706,141,709,711,716,718,108,109,111,104,110,732,30024,741,735,736,739,746,740,742,748,749,756,754,768,769,771,772,774,782,786,792,797,2915,810,812,813,817,52,112,308,410,671]

# for year in range(2014, 2023):
def get_analytic_data(data_type):
    for year in range(2013, 2023):
        stats_lists_min = {}
        stats_lists_max = {}
        general_stats = {}
        fip_list = []
        woba_list = []
        wrc_list = []
        wraa_list = []

        for team_id in team_ids:
            try:
                print(f"Processing in analytics team_id {team_id} for {data_type} in year {year}...")
                df = ncaa_scraper.ncaa_team_stats(team_id, year, data_type, include_advanced=False)

                if df.empty:
                    print(f"No data for team_id {team_id} for {data_type} in analytical year {year}. Skipping...")
                    continue

                school_name = lookup.lookup_school_reverse(team_id)[0]
                df['school_name'] = school_name

                for _, row in df.iterrows():
                    player_data = row.to_dict()
                    player_id = player_data.get('stats_player_seq')
                    if player_id:
                        if data_type == 'batting':
                            # Calculate Plate Appearances
                            AB = int(player_data.get('AB', 0))  # At Bats
                            BB = int(player_data.get('BB', 0))  # Walks
                            HBP = int(player_data.get('HBP', 0))  # Hit by Pitch
                            SF = int(player_data.get('SF', 0))  # Sacrifice Flies
                            SH = int(player_data.get('SH', 0))  # Sacrifice Hits (Sacrifice Bunts)
                            PA = AB + BB + HBP + SF + SH

                            # Batting stats needed for calculations
                            _1B = int(player_data.get('1B', 0))  # Singles
                            _2B = int(player_data.get('2B', 0))  # Doubles
                            _3B = int(player_data.get('3B', 0))  # Triples
                            HR = int(player_data.get('HR', 0))  # Home Runs

                            # Calculate advanced batting metrics
                           # woba = metrics.calculate_woba_manual(PA, BB, HBP, _1B, _2B, _3B, HR, year, 1)
                          #  wrc = metrics.calculate_wrc_manual(PA, woba, year, 1)
                         #   wraa = metrics.calculate_wraa_manual(PA, woba, year)

                            # Append results to lists for later processing or storing
                          #  woba_list.append({'id': player_id, 'name': player_data['name'], 'school': school_name, 'wOBA': woba})
                          #  wrc_list.append({'id': player_id, 'name': player_data['name'], 'school': school_name, 'wRC': wrc})
                          #  wraa_list.append({'id': player_id, 'name': player_data['name'], 'school': school_name, 'wRAA': wraa})

                        elif data_type == 'pitching':
                            HR = int(player_data.get('HR-A', 0))
                            BB = int(player_data.get('BB', 0))
                            HBP = int(player_data.get('HB', 0))
                            SO = int(player_data.get('SO', 0))
                            IP = int(player_data.get('IP', 0))

                            # Calculate FIP only if all values are greater than zero
                            if HR > 0 and BB > 0 and HBP > 0 and SO > 0 and IP > 0:
                                FIP = metrics.calculate_fip_manual(HR, BB, HBP, SO, IP, year, 1)
                                fip_list.append({'id': player_id, 'name': player_data['name'], 'school': school_name, 'FIP': FIP})

                        # Collect general and pitching-specific statistics
                        for stat_key, stat_value in player_data.items():
                            try:
                                stat_value = float(stat_value)
                                player_stat_info = {
                                    'id': player_id,
                                    'name': player_data['name'],
                                    'school': school_name,
                                    'class': player_data['Yr'],
                                    'position': player_data['pos'],
                                    'jerseyNumber': player_data['Jersey'],
                                    'stat_value': stat_value
                                }
                                if stat_key not in stats_lists_min:
                                    stats_lists_min[stat_key] = []
                                    stats_lists_max[stat_key] = []
                                stats_lists_min[stat_key].append(player_stat_info)
                                stats_lists_max[stat_key].append(player_stat_info)
                            except ValueError:
                                continue

                # Sort and select top 50 for each stat
                for stat_key in stats_lists_min:
                    stats_lists_min[stat_key] = sorted(stats_lists_min[stat_key], key=lambda x: x['stat_value'])[:50]
                    stats_lists_max[stat_key] = sorted(stats_lists_max[stat_key], key=lambda x: x['stat_value'], reverse=True)[:50]

            except Exception as e:
                print(f"Error in analytics processing team_id {team_id} for {data_type} in year {year}: {e}")

        # Update the analytics collection
        year_ref = db.collection('analytics').document(str(year))
        data_type_ref = year_ref.collection(data_type)
        for stat_key in stats_lists_min:
            data_type_ref.document(f'Min{stat_key}').set({'stats': stats_lists_min[stat_key]})
            data_type_ref.document(f'Max{stat_key}').set({'stats': stats_lists_max[stat_key]})
        if data_type == 'pitching' and fip_list:
            data_type_ref.document('Top50FIP').set({'stats': sorted(fip_list, key=lambda x: x['FIP'], reverse=True)[:50]})
        if data_type == 'batting':
            data_type_ref.document('Top50wOBA').set({'stats': sorted(woba_list, key=lambda x: x['wOBA'], reverse=True)[:50]})
            data_type_ref.document('Top50wRC').set({'stats': sorted(wrc_list, key=lambda x: x['wRC'], reverse=True)[:50]})
            data_type_ref.document('Top50wRAA').set({'stats': sorted(wraa_list, key=lambda x: x['wRAA'], reverse=True)[:50]})
        
        print(f"{data_type} data processing complete for year {year}.")

        
def get_player_data(data_type):
    for year in range(2013, 2023):
        for team_id in team_ids:
            try:
                print(f"Processing team_id {team_id} for {data_type} in year {year}...")
                df = ncaa_scraper.ncaa_team_stats(team_id, year, data_type, include_advanced=False)

                if df.empty:
                    print(f"No data for team_id {team_id} for {data_type} in year {year}. Skipping...")
                    continue

                school_name = lookup.lookup_school_reverse(team_id)[0]
                df['school_name'] = school_name

                for _, row in df.iterrows():
                    player_data = row.to_dict()
                    player_id = player_data.get('stats_player_seq')
                    if player_id:
                        doc_ref = db.collection('collegebaseballplayer').document(str(player_id))
                        player_doc = doc_ref.get()
                        if player_doc.exists:
                            player_info = player_doc.to_dict()
                        else:
                            player_info = {
                                'name': player_data.get('name'),
                                'school': school_name,
                                'class': player_data.get('Yr'),
                                'position': player_data.get('pos'),
                                'jerseyNumber': player_data.get('Jersey'),
                                'stats': {}
                            }

                        year_stats = player_info.get('stats', {}).get(str(year), {})

                        # Update class, position, and jersey number for each year
                        year_stats['class'] = player_data.get('Yr')
                        year_stats['position'] = player_data.get('pos')
                        year_stats['jerseyNumber'] = player_data.get('Jersey')
                        year_stats['school'] = player_data.get('school_name')

                        data_type_stats = year_stats.get(data_type, {})
                        for key, value in player_data.items():
                            if key not in ['stats_player_seq', 'name', 'Jersey', 'pos', 'Yr', 'division', 'school_name', 'season']:
                                data_type_stats[key] = value

                        # Calculate and add advanced stats here
                        if data_type == 'pitching':
                            HR = int(player_data.get('HR-A', 0))
                            BB = int(player_data.get('BB', 0))
                            HBP = int(player_data.get('HB', 0))
                            SO = int(player_data.get('SO', 0))
                            IP = int(player_data.get('IP', 0))

                            # Calculate FIP only if all values are greater than zero
                            if HR > 0 and BB > 0 and HBP > 0 and SO > 0 and IP > 0:
                                FIP = metrics.calculate_fip_manual(HR, BB, HBP, SO, IP, year, 1)
                                data_type_stats['FIP'] = FIP

                        elif data_type == 'batting':
                            # Calculate Plate Appearances
                            AB = int(player_data.get('AB', 0))  # At Bats
                            BB = int(player_data.get('BB', 0))  # Walks
                            HBP = int(player_data.get('HBP', 0))  # Hit by Pitch
                            SF = int(player_data.get('SF', 0))  # Sacrifice Flies
                            SH = int(player_data.get('SH', 0))  # Sacrifice Hits (Sacrifice Bunts)
                            PA = AB + BB + HBP + SF + SH

                            # Continue with wOBA, wRC, wRAA calculation logic
                            _1B = int(player_data.get('1B', 0))  # Singles
                            _2B = int(player_data.get('2B', 0))  # Doubles
                            _3B = int(player_data.get('3B', 0))  # Triples
                            HR = int(player_data.get('HR', 0))  # Home Runs

                            # Assuming you have functions for these calculations
                       #     woba = metrics.calculate_woba_manual(PA, BB, HBP, _1B, _2B, _3B, HR, year, 1)
                      #      wrc = metrics.calculate_wrc_manual(PA, woba, year, 1)
                       #     wraa = metrics.calculate_wraa_manual(PA, woba, year)

                            # Add results to your player data dictionary or further processing
                            player_data['PA'] = PA  # Adding plate appearances to player data for reference
                       #     player_data['wOBA'] = woba
                       #     player_data['wRC'] = wrc
                       #     player_data['wRAA'] = wraa

                        year_stats[data_type] = data_type_stats
                        player_info['stats'][str(year)] = year_stats

                        # Write data for each player individually
                        doc_ref.set(player_info, merge=True)

            except Exception as e:
                print(f"Error processing team_id {team_id} for {data_type} in year {year}: {e}")

        print(f"{data_type} data processing complete for year {year}.")
        
# Example usage
get_player_data('batting')
get_analytic_data('batting')

get_player_data('pitching')
get_analytic_data('pitching')


get_analytic_data('fielding')
get_player_data('fielding')