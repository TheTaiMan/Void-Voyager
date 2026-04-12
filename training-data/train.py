import csv

model: list[list[int]] = [[0 for _ in range(10)] for _ in range(10)] # 10 x 10
total: list[int] = [0] * 10 # 10 empty items

letter_dict = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7,
    'i': 8,
    'j': 9
}

def process(word: list[str]) -> None:
    for i in range(len(word) - 1):
        current_state = word[i]
        next_state = word[i+1]

        model[letter_dict[current_state]][letter_dict[next_state]] += 1
        total[letter_dict[current_state]] += 1

with open('training.csv', mode='r') as file:
    reader = csv.reader(file)

    for row in reader:
        process(row)


with open('model.csv', mode='w', newline='') as out_file:
    writer = csv.writer(out_file)
    
    # Write a header row for clarity
    headers = ['State', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'Total']
    writer.writerow(headers)
    
    # Iterate through the dictionary to write each row
    for state_char, row_index in letter_dict.items():
        # Combine the state letter, its 10 transition counts, and its total sum
        row_data = [state_char] + model[row_index] + [total[row_index]]
        writer.writerow(row_data)

print("Training complete. Data saved to model.csv")
