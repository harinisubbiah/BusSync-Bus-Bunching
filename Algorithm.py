import pandas as pd
import time

# Load the dataset
file_path = "bus_positions.csv"  # Change this if using another file name
df = pd.read_csv(file_path)

def calculate_gaps(df):
    """
    Calculate time gaps (always 10 minutes) and distance gaps for each time step.
    """
    gap_results = []
    timestamps = df['Time']
    for t in range(0, len(timestamps)):
        row = {'Time': timestamps[t]}
        for i in range(1, len(df.columns)):
            row[f'Bus {i}'] = df.iloc[t, i]
        gap_results.append(row)
    return gap_results

def optimization_suggestions(gap_results):
    """
    Generate optimization suggestions for each bus.
    """
    suggestions = []
    first_bus_reached_end = False
    first_bus_index = 1  # Initial first bus is bus 1

    for entry in gap_results:
        time = entry['Time']
        suggestions.append(f"\n===== Optimization Suggestions for {time} =====")

        for i in range(1, len(entry)):
            distance = entry[f'Bus {i}']

            # If the current bus is the "first bus" or the first bus has reached the end
            if i == first_bus_index or i== first_bus_index - 1:
                suggestion = "Maintain Speed"
            elif distance < 1.0:
                suggestion = "Slow Down"
            elif distance > 2.5:
                suggestion = "Speed Up"
            else:
                suggestion = "Maintain Speed"

            suggestions.append(f"[{time}] Bus {i}: {suggestion}")

       
        if not first_bus_reached_end and entry[f'Bus {first_bus_index}'] >= 25:
            first_bus_reached_end = True
            first_bus_index += 1  # Increment the first bus index to the next bus

    return suggestions


gap_results = calculate_gaps(df)
suggestions = optimization_suggestions(gap_results)

# Print suggestions with a 1-minute delay between each timestamp
last_time = None
for suggestion in suggestions:
    current_time = suggestion.split(']')[0][1:] if ']' in suggestion else None  # Extract time from suggestion
    if current_time and (last_time is None or current_time != last_time):
        time.sleep(10)  # Wait for 1 minute before showing the next timestamp's results
        print("\n--------------------------------------------------")
    print(suggestion)
    last_time = current_time
