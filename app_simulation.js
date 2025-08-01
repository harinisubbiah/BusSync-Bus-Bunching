import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function BusMonitoringApp() {
  const busData = [
    { Time: "08:00", "Bus 1": 6, "Bus 2": 0.5, "Bus 3": 0, "Bus 4": 0, "Bus 5": 0 },
    { Time: "08:10", "Bus 1": 10.5, "Bus 2": 1.2, "Bus 3": 0.5, "Bus 4": 0, "Bus 5": 0 },
    { Time: "08:20", "Bus 1": 14.5, "Bus 2": 4.5, "Bus 3": 1.4, "Bus 4": 0, "Bus 5": 0 },
    { Time: "08:30", "Bus 1": 18, "Bus 2": 6.3, "Bus 3": 3.5, "Bus 4": 0.5, "Bus 5": 0 },
    { Time: "08:40", "Bus 1": 21, "Bus 2": 8.2, "Bus 3": 5.8, "Bus 4": 1, "Bus 5": 0.5 },
    { Time: "08:50", "Bus 1": 23.5, "Bus 2": 11, "Bus 3": 10.5, "Bus 4": 3, "Bus 5": 2.5 },
    { Time: "09:00", "Bus 1": 25, "Bus 2": 16.5, "Bus 3": 12.4, "Bus 4": 5.5, "Bus 5": 4.5 },
    { Time: "09:10", "Bus 1": 25, "Bus 2": 18.7, "Bus 3": 11.5, "Bus 4": 7.5, "Bus 5": 6.2 },
    { Time: "09:20", "Bus 1": 25, "Bus 2": 20.5, "Bus 3": 13.8, "Bus 4": 9.8, "Bus 5": 8.2 },
    { Time: "09:30", "Bus 1": 25, "Bus 2": 21.6, "Bus 3": 15.7, "Bus 4": 10.5, "Bus 5": 10 },
    { Time: "09:40", "Bus 1": 25, "Bus 2": 22.8, "Bus 3": 17.2, "Bus 4": 11.2, "Bus 5": 11 },
    { Time: "09:50", "Bus 1": 25, "Bus 2": 23.9, "Bus 3": 18.3, "Bus 4": 12.6, "Bus 5": 12.4 },
    { Time: "10:00", "Bus 1": 25, "Bus 2": 25, "Bus 3": 19.3, "Bus 4": 13.5, "Bus 5": 13.1 },
    { Time: "10:10", "Bus 1": 25, "Bus 2": 25, "Bus 3": 20.4, "Bus 4": 14.6, "Bus 5": 14 },
    { Time: "10:20", "Bus 1": 25, "Bus 2": 25, "Bus 3": 21.5, "Bus 4": 15, "Bus 5": 14.8 },
    { Time: "10:30", "Bus 1": 25, "Bus 2": 25, "Bus 3": 23.3, "Bus 4": 15.8, "Bus 5": 16.5 },
    { Time: "10:40", "Bus 1": 25, "Bus 2": 25, "Bus 3": 25, "Bus 4": 17.3, "Bus 5": 17.1 },
    { Time: "10:50", "Bus 1": 25, "Bus 2": 25, "Bus 3": 25, "Bus 4": 19, "Bus 5": 18.5 },
    { Time: "11:00", "Bus 1": 25, "Bus 2": 25, "Bus 3": 25, "Bus 4": 20.1, "Bus 5": 19.5 }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [distanceGaps, setDistanceGaps] = useState({
    "Bus 1": "N/A", 
    "Bus 2": 0, 
    "Bus 3": 0, 
    "Bus 4": 0, 
    "Bus 5": 0
  });
  const [busStatus, setBusStatus] = useState({
    "Bus 1": "Maintain Speed",
    "Bus 2": "Maintain Speed",
    "Bus 3": "Maintain Speed",
    "Bus 4": "Maintain Speed",
    "Bus 5": "Maintain Speed"
  });
  const [leadBusIndex, setLeadBusIndex] = useState(1); 
  const [statusLog, setStatusLog] = useState([]);
  const currentData = busData[currentIndex] || busData[0];
  const calculateDistanceGaps = useCallback((dataPoint) => {
    const gaps = {};
    
    for (let i = 1; i <= 5; i++) {
      const busKey = `Bus ${i}`;
      
      if (i === leadBusIndex) {
        gaps[busKey] = "N/A";
      } else if (i < leadBusIndex) {
        gaps[busKey] = "N/A";
      } else {
        let aheadBusIndex = i - 1;
        while (aheadBusIndex >= 1 && aheadBusIndex < leadBusIndex) {
          aheadBusIndex--;
        }
        
        if (aheadBusIndex >= 1) {
          gaps[busKey] = dataPoint[`Bus ${aheadBusIndex}`] - dataPoint[`Bus ${i}`];
        } else {
          gaps[busKey] = "N/A";
        }
      }
    }
    return gaps;
  }, [leadBusIndex]);
  const generateSuggestions = useCallback((distanceGaps, dataPoint) => {
    const suggestions = {};
    let currentLeadBus = leadBusIndex;
    for (let i = leadBusIndex; i <= 5; i++) {
      if (dataPoint[`Bus ${i}`] >= 25) {
        if (i === currentLeadBus) {
          currentLeadBus++;
        }
      }
    }
    if (currentLeadBus !== leadBusIndex) {
      setLeadBusIndex(currentLeadBus);
    }
    
    for (let i = 1; i <= 5; i++) {
      const busKey = `Bus ${i}`;
      const gap = distanceGaps[busKey];
      if (i === leadBusIndex || i === leadBusIndex - 1) {
        suggestions[busKey] = "Maintain Speed";
      } else if (gap === "N/A" || dataPoint[busKey] >= 25) {
        suggestions[busKey] = "Maintain Speed";
      } else if (gap >= 2.5) {
        suggestions[busKey] = "Speed Up";
      } else if (gap <= 1.0) {
        suggestions[busKey] = "Slow Down";
      } else {
        suggestions[busKey] = "Maintain Speed";
      }
    }
    
    return suggestions;
  }, [leadBusIndex]);
  useEffect(() => {
    if (isRunning && currentIndex < busData.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isRunning, currentIndex, busData.length]);
  useEffect(() => {
    if (currentIndex < busData.length) {
      const currentDataPoint = busData[currentIndex];
      const gaps = calculateDistanceGaps(currentDataPoint);
      const suggestions = generateSuggestions(gaps, currentDataPoint);
      
      setDistanceGaps(gaps);
      setBusStatus(suggestions);
    }
  }, [currentIndex, leadBusIndex, calculateDistanceGaps, generateSuggestions, busData]);
  useEffect(() => {
    if (currentIndex > 0) {
      const prevData = busData[currentIndex - 1];
      const currentTime = currentData.Time;
      
      let hasChanges = false;
      const changes = [];
      
      for (let i = 1; i <= 5; i++) {
        const busKey = `Bus ${i}`;
        const currentPosition = currentData[busKey];
        const prevPosition = prevData[busKey];
        const speed = currentPosition - prevPosition;
        let speedStatus = "maintained speed";
        
        if (speed > 0.5) {
          speedStatus = "accelerated";
        } else if (speed < 0.2) {
          speedStatus = "slowed down";
        }
        if (currentPosition !== prevPosition) {
          hasChanges = true;
          changes.push(`${busKey} ${speedStatus} (now at ${currentPosition.toFixed(1)}km)`);
        }
      }
      
      if (hasChanges) {
        const newLog = {
          time: currentTime,
          changes: changes
        };
        
        setStatusLog(prev => {
          const updatedLog = [...prev, newLog];
          return updatedLog.slice(-5);
        });
      }
    }
  }, [currentIndex, busData, currentData]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentIndex(0);
    setLeadBusIndex(1); 
  };

  const handleStepForward = () => {
    if (currentIndex < busData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Speed Up":
        return {
          color: "#3b82f6", 
          icon: "→"
        };
      case "Slow Down":
        return {
          color: "#ef4444", 
          icon: "↓"
        };
      case "Maintain Speed":
        return {
          color: "#22c55e", 
          icon: "="
        };
      default:
        return {
          color: "#6b7280", 
          icon: ""
        };
    }
  };
  const routeCompletion = {};
  for (let i = 1; i <= 5; i++) {
    const busKey = `Bus ${i}`;
    const position = currentData[busKey];
    const completion = (position / 25) * 100;
    routeCompletion[busKey] = Math.min(completion, 100);
  }

 
  const getBusColor = (busNum) => {
    switch(busNum) {
      case 1: return "#1E40AF"; 
      case 2: return "#6D28D9"; 
      case 3: return "#DC2626"; 
      case 4: return "#15803D"; 
      case 5: return "#D97706"; 
      default: return "#000000";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Bus Monitoring System</Text>
          <Text style={styles.time}>{currentData.Time}</Text>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.startButton, isRunning && styles.disabledButton]} 
            onPress={handleStart}
            disabled={isRunning}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.pauseButton, !isRunning && styles.disabledButton]} 
            onPress={handlePause}
            disabled={!isRunning}
          >
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.stepButton, currentIndex === 0 && styles.disabledButton]} 
            onPress={handleStepBackward}
            disabled={currentIndex === 0}
          >
            <Text style={styles.buttonText}>← Step</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.stepButton, currentIndex === busData.length - 1 && styles.disabledButton]} 
            onPress={handleStepForward}
            disabled={currentIndex === busData.length - 1}
          >
            <Text style={styles.buttonText}>Step →</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Bus Positions and Status</Text>
        
        {[5, 4, 3, 2, 1].map(busNum => {
          const busKey = `Bus ${busNum}`;
          const position = currentData[busKey];
          const gap = distanceGaps[busKey];
          const status = busStatus[busKey];
          const { color, icon } = getStatusStyles(status);
          
          return (
            <View key={busKey} style={styles.busRow}>
              <View style={[styles.busIndicator, { backgroundColor: getBusColor(busNum) }]}>
                <Text style={styles.busNumber}>{busNum}</Text>
              </View>
              
              <View style={styles.busInfo}>
                <Text style={styles.busName}>{busKey}</Text>
                <Text>Position: {position.toFixed(1)} km</Text>
                <Text>Gap: {gap === "N/A" ? "N/A" : `${gap.toFixed(1)} km`}</Text>
                <Text style={{ color }}>Status: {status} {icon}</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${routeCompletion[busKey]}%`, backgroundColor: getBusColor(busNum) }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{routeCompletion[busKey].toFixed(0)}%</Text>
                </View>
              </View>
            </View>
          );
        })}
        
        <Text style={styles.sectionTitle}>Route Visualization</Text>
        <View style={styles.routeContainer}>
          <View style={styles.routeLine}>
            <Text style={styles.routeStart}>0 km</Text>
            <Text style={styles.routeEnd}>25 km</Text>
          </View>
          
          {[1, 2, 3, 4, 5].map(busNum => {
            const busKey = `Bus ${busNum}`;
            const position = currentData[busKey];
            const positionPercent = (position / 25) * 100;
            const status = busStatus[busKey];
            const { color, icon } = getStatusStyles(status);
            
            return (
              <View 
                key={busKey} 
                style={[
                  styles.busMarker, 
                  { 
                    left: `${positionPercent}%`, 
                    backgroundColor: getBusColor(busNum)
                  }
                ]}
              >
                <Text style={styles.busMarkerText}>{busNum}</Text>
                <Text style={[styles.busStatusText, { color }]}>
                  {status} {icon}
                </Text>
              </View>
            );
          })}
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statsBox}>
            <Text style={styles.statsTitle}>System Status</Text>
            <View style={styles.statsContent}>
              <Text style={styles.statsText}>Current Time: {currentData.Time}</Text>
              <Text style={styles.statsText}>Time Step: {currentIndex + 1}/{busData.length}</Text>
              <Text style={styles.statsText}>System Status: {isRunning ? "Running" : "Paused"}</Text>
              <Text style={styles.statsText}>Lead Bus: Bus {leadBusIndex}</Text>
            </View>
          </View>
          
          <View style={styles.statsBox}>
            <Text style={styles.statsTitle}>Status Log</Text>
            <ScrollView style={styles.logContainer}>
              {statusLog.length === 0 ? (
                <Text style={styles.emptyLogText}>No status changes yet</Text>
              ) : (
                statusLog.map((log, index) => (
                  <View key={index} style={styles.logEntry}>
                    <Text style={styles.logTime}>{log.time}:</Text>
                    {log.changes.map((change, i) => (
                      <Text key={i} style={styles.logChange}>• {change}</Text>
                    ))}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  card: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937', 
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#16a34a', 
  },
  pauseButton: {
    backgroundColor: '#ca8a04', 
  },
  resetButton: {
    backgroundColor: '#dc2626', 
  },
  stepButton: {
    backgroundColor: '#2563eb',
  },
  disabledButton: {
    backgroundColor: '#9ca3af', 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
    color: '#1f2937', 
  },
  busRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', 
  },
  busIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  busNumber: {
    color: 'white',
    fontWeight: 'bold',
  },
  busInfo: {
    flex: 1,
  },
  busName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e5e7eb', 
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 4,
  },
  routeContainer: {
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 16,
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#9ca3af', 
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeStart: {
    position: 'absolute',
    top: -20,
    left: 0,
    fontSize: 12,
  },
  routeEnd: {
    position: 'absolute',
    top: -20,
    right: 0,
    fontSize: 12,
  },
  busMarker: {
    position: 'absolute',
    top: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -15, 
  },
  busMarkerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  busStatusText: {
    position: 'absolute',
    top: 32,
    fontSize: 10,
    fontWeight: '500',
    width: 80,
    textAlign: 'center',
    marginLeft: -25,
  },
  statsContainer: {
    flexDirection: 'column',
  },
  statsBox: {
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  statsContent: {
    backgroundColor: '#f3f4f6', 
    padding: 12,
    borderRadius: 8,
  },
  statsText: {
    marginBottom: 4,
  },
  logContainer: {
    backgroundColor: '#f3f4f6', 
    padding: 12,
    borderRadius: 8,
    height: 150,
  },
  emptyLogText: {
    fontStyle: 'italic',
    color: '#6b7280',
  },
  logEntry: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db', 
  },
  logTime: {
    fontWeight: '600',
    marginBottom: 4,
  },
  logChange: {
    fontSize: 13,
    marginLeft: 8,
  }
});
