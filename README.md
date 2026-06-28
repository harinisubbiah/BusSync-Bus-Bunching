# BusSync – Intelligent Bus Bunching Detection & Optimization System

> A Python-based intelligent transportation system that detects bus bunching, analyzes headway deviations, and generates optimization suggestions to improve schedule adherence and passenger experience.

---

## Overview

Bus bunching is a common issue in public transportation where two or more buses scheduled at regular intervals end up arriving together. This leads to overcrowding, longer passenger waiting times, and inefficient fleet utilization. Bus bunching is a well-known challenge in transit operations and reducing it improves service reliability. :contentReference[oaicite:0]{index=0}

**BusSync** is a software solution that continuously analyzes bus position data, calculates headway gaps between buses, identifies bunching conditions, and recommends corrective actions to restore regular service intervals.

The system simulates real-world traffic conditions by processing continuously updated location data and provides optimization suggestions that can be displayed to bus drivers through a mobile application.

---

# Features

- Bus bunching detection
- Real-time bus position analysis
- Headway calculation between consecutive buses
- Traffic-aware simulation
- Schedule adherence monitoring
- Automatic bunching alerts
- Android application for driver recommendations
- Dynamic data updates
- Performance visualization

---

# Motivation

Maintaining equal spacing (headways) between buses is essential for reliable public transportation.

BusSync aims to reduce:

- Passenger waiting time
- Bus overcrowding
- Service irregularity
- Fleet inefficiencies

by continuously monitoring vehicle positions and recommending corrective actions.

---

# Flow Chart
<img width="590" height="451" alt="image" src="https://github.com/user-attachments/assets/c7d1c99d-b38c-47f9-9954-83f120ece273" />

---


# ⚙️ Tech Stack

| Category | Technology |
|-----------|------------|
| Language | Python |
| Mobile | Data Processing | Pandas |
| Numerical Computing | NumPy |
| Visualization | Matplotlib |
| Dataset | CSV |
| IDE | VS Code |

---

# Workflow

1. Read bus position data.

2. Calculate the headway between consecutive buses.

3. Compare current spacing with the desired interval.

4. Detect bus bunching events.

5. Generate optimization recommendations.

6. Send suggestions to the Android application.

---

# Optimization Strategy

The optimization engine continuously evaluates the spacing between buses.

Possible recommendations include:

- Slow down
- Maintain speed
- Increase speed
- Hold at next stop
- Resume normal operation

These recommendations help maintain a target headway throughout the route.

---

# Key Features

- Dynamic simulation
- Real-time bus tracking
- Headway optimization
- Driver assistance
- Route monitoring
- Continuous data updates
- Intelligent recommendation engine

---

# Results

The system successfully:

- Detects bus bunching events
- Calculates real-time headway deviations
- Simulates realistic traffic scenarios
- Generates driver recommendations
- Improves service regularity through optimized bus spacing

---

# Contibutors
- Aniruddhan S [https://github.com/CoderAni651]

--- 
# License

This project is licensed under the MIT License.

---

# Author

**Harini S**

---


