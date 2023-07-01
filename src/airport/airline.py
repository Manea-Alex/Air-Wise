import json

# Replace 'input_file.json' with the name of your input JSON file
input_file = 'airline.json'


def remove_non_airline_entries_and_add_logo(data):
    modified_data = []
    for entry in data:
        if entry.get('type') == 'airline':
            entry['logo'] = f'https://images.kiwi.com/airlines/64/{entry["id"]}.png'
            modified_data.append(entry)
    return modified_data


def main():
    with open(input_file, 'r') as file:
        data = json.load(file)

    filtered_data = remove_non_airline_entries_and_add_logo(data)

    # Replace 'output_file.json' with the name of your output JSON file
    with open('airline.json', 'w') as file:
        json.dump(filtered_data, file, indent=2)


if __name__ == "__main__":
    main()
