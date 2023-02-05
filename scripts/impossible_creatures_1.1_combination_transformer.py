import datetime
import json

SOURCE_COMBINATIONS_FILEPATH = "source/combinations" + ".json"
OUTPUT_PATH = "transformed/combinations" + ".json"


def titlecase(string):
  substrings = string.split('_')
  return ' '.join(substring.title() for substring in substrings)


def pretty_format_json():
  with open(f'formatted-{datetime.datetime.now()}.json', 'w') as f:
    f.write(json.dumps(json.load(open("combinations.json")), indent=4))


def load_json_combinations():
  with open(SOURCE_COMBINATIONS_FILEPATH, 'r') as f:
    return json.load(f)


limbMapping = {0: "Front Legs",
               1: "Rear Legs",
               2: "Head",
               3: "Tail",
               4: "Torso",
               5: "Pincers",
               6: "Wings"}


def get_animal_belonging_to(combination, limbIndex):
  if limbIndex == 1:
    return titlecase(combination["stock_1"])
  elif limbIndex == 2:
    return titlecase(combination["stock_2"])
  elif limbIndex == -1:
    return "Inherent"
  else:
    return "None"


def resolve_body_part(index):
  return {
    0: "None",
    1: "None",
    2: "Front Legs",
    3: "Rear Legs",
    4: "Head",
    5: "Tail",
    6: "Torso",
    7: "Pincers",
    8: "Wings"
  }.get(index, "Unknown")


def parse_combinations():
  output = []
  sourceCombinations = load_json_combinations()

  for combination in sourceCombinations:
    currentCombination = {
      "Animal 1"       : titlecase(combination["stock_1"]) if "stock_1" in combination else None,
      "Animal 2"       : titlecase(combination["stock_2"]) if "stock_2" in combination else None,
      "Research Level" : int(combination["attributes"]["creature_rank"][1]) if "creature_rank" in combination["attributes"] else -1,
      # "Power"          : round(combination["attributes"]["Power"][1], 1) if "Power" in combination["attributes"] else None,
      "Air Speed"      : round(combination["attributes"]["airspeed_val"][1], 1) if "airspeed_val" in combination["attributes"] else -1,
      "Land Speed"     : round(combination["attributes"]["landspeed_val"][1], 1) if "landspeed_val" in combination["attributes"] else -1,
      "Water Speed"    : round(combination["attributes"]["waterspeed_val"][1], 1) if "waterspeed_val" in combination["attributes"] else -1,
      "Health"         : round(combination["attributes"]["health_val"][1], 1) if "health_val" in combination["attributes"] else -1,
      "Size"           : round(combination["attributes"]["size"][1], 1) if "size" in combination["attributes"] else -1,
      "Population Cost": round(combination["attributes"]["popsize"][1], 1) if "popsize" in combination["attributes"] else -1,
      # "EHP"            : round(combination["attributes"]["ehp"][1], 1) if "ehp" in combination["attributes"] else None,
      "Melee Damage"   : round(combination["attributes"]["damage_val"][1], 1) if "damage_val" in combination["attributes"] else -1,
      "Sight Radius"   : round(combination["attributes"]["sight_radius1"][1], 1) if "sight_radius1" in combination["attributes"] else -1,
    }
    for limbIndex in range(len(combination["composition"])):
      currentCombination[limbMapping[
        limbIndex]] = f'{get_animal_belonging_to(combination=combination, limbIndex=combination["composition"][limbIndex])}'

    for attribute in combination["attributes"]:
      for i in range(0, 9):
        if attribute == f"range{i}_damage":
          currentCombination[f'Range Damage ({resolve_body_part(i)})'] = round(combination["attributes"][attribute][1], 1)
        elif attribute == f"range{i}_max":
          currentCombination[f'Range Distance ({resolve_body_part(i)})'] = round(combination["attributes"][attribute][1], 1)
        elif attribute == f"range{i}_rate":
          currentCombination[f'Range Attack Rate ({resolve_body_part(i)})'] = round(combination["attributes"][attribute][1], 1)
    output.append(currentCombination)
  return output


def write_combinations_to_json():
  with open(OUTPUT_PATH, 'w+') as f:
    f.write(json.dumps(parse_combinations(), indent=4))


if __name__ == "__main__":
  write_combinations_to_json()
