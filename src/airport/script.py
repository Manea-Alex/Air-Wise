# Replace 'input.txt' with the name of your text file
input_file = 'input.txt'

# Read the contents of the file
with open(input_file, 'r', encoding='utf-8') as file:
    content = file.read()

# Replace every “ and ” with "
content = content.replace('“', '"').replace('”', '"')

# Write the modified content back to the file
with open(input_file, 'w', encoding='utf-8') as file:
    file.write(content)

print("Replaced all occurrences of “ and ” with \" in the file.")
