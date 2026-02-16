import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {RadarChart} from '@salmonco/react-native-radar-chart'; 
//It sucks that I have to use a radar chart from a random person
//TODO maybe implement radar chart yourself?


const PlayerStatsScreen = () => {
  const [data, setData] = useState([
    {label: 'Speed', value: 30},
    {label: 'Fun', value: 55},
    {label: 'Height', value: 70},
    {label: 'Effort', value: 35},
    {label: 'Test1', value: 10},
    {label: 'data6', value: 60},
    {label: 'data7', value: 38},
    {label: 'data8', value: 65},
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editedData, setEditedData] = useState([...data]);

  const updateData = () => {
    setData(
      editedData.map(item => ({
        label: item.label,  // Preserve the label
        value: parseFloat(item.value) || 0, // Ensure numeric values
      }))
    );
    setModalVisible(false);
  };
  


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Stats</Text>
      <RadarChart
        data={data}
        maxValue={100}
        gradientColor={{
          startColor: '#FF9432',
          endColor: '#FFF8F1',
          count: 5,
        }}
        stroke={['#FFE8D3', '#FFE8D3', '#FFE8D3', '#FFE8D3', '#ff9532']}
        strokeWidth={[0.5, 0.5, 0.5, 0.5, 1]}
        strokeOpacity={[1, 1, 1, 1, 0.13]}
        labelColor="#433D3A"
        dataFillColor="#FF9432"
        dataFillOpacity={0.8}
        dataStroke="salmon"
        dataStrokeWidth={2}
        //isCircle
      />

      <Button title="Edit Data" onPress={() => setModalVisible(true)} />
      
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Data</Text>
          {data.map((item, index) => (
            <View key={index} style={styles.inputContainer}>
              <Text>{item.label}:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(editedData[index]?.value || '')} // Ensure value is valid
                onChangeText={text => {
                  const newData = [...editedData];
                  newData[index] = { ...newData[index], value: text }; // Update value while preserving label
                  setEditedData(newData);
                }}
              />
            </View>
          ))}
          <Button title="Save" onPress={updateData} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
        </View>
      </Modal>  
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  input: {
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    flex: 1,
    padding: 5,
  },
});


export default PlayerStatsScreen;
