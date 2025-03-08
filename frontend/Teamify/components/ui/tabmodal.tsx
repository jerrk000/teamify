// ATTENTION: BlurView is currently not working (maybe because its still experimental on android).
// either fix this or delete the BlurView
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import useModalStore from '../../store/useModalStore'; 

const TabModal = () => {
  const { isModalVisible, toggleModal } = useModalStore();

  return (
    <Modal transparent={true} visible={isModalVisible} onRequestClose={toggleModal}>
      <TouchableOpacity activeOpacity={1} onPress={toggleModal} style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
      <BlurView intensity={50} style={StyleSheet.absoluteFill}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => alert('Settings')} style={styles.optionButton}>
            <Text style={styles.optionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Logout')} style={styles.optionButton}>
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Close')} style={styles.optionButton}>
            <Text style={styles.optionText}>Close</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#000',
  },
});

export default TabModal;