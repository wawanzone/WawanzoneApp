import { StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, useColorScheme, TouchableOpacity } from 'react-native';
import { Text, View, useThemeColor } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TabTwoScreenProps {
  onIncomeAdded: () => void;
}

export default function TabTwoScreen({ onIncomeAdded }: TabTwoScreenProps) {
  const colorScheme = useColorScheme();
  const successColor = useThemeColor({}, 'success');

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const handleIncomeSubmit = async () => {
    if (!amount || !category) {
      alert('Please enter both amount and category.');
      return;
    }

    const incomeData = {
      amount,
      category,
      date: new Date().toISOString(),
    };

    try {
      const existingData = await AsyncStorage.getItem('incomes');
      const parsedData = existingData ? JSON.parse(existingData) : [];

      parsedData.push(incomeData);
      await AsyncStorage.setItem('incomes', JSON.stringify(parsedData));

      alert('Pemasukan tersimpan:\nJumlah: ' + amount + '\nKategori: ' + category);

      // Notify the parent screen to update its state (FinancesScreen)
      if (onIncomeAdded) {
        onIncomeAdded();
      }

      setAmount('');
      setCategory(null);
    } catch (error) {
      alert('Error saving data');
      console.error(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.icon}>🤑</Text>
        
        <Text style={styles.label}>Jumlah Pemasukan</Text>
        <TextInput
          style={[
            styles.input,
            colorScheme === 'dark' ? styles.inputDark : styles.inputLight
          ]}
          placeholder="Masukkan jumlah pemasukan"
          placeholderTextColor={colorScheme === 'dark' ? '#888' : '#666'}
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />

        <Text style={styles.label}>Kategori Pemasukan</Text>
        <RNPickerSelect
          style={{
            inputIOS: [styles.inputIOS, colorScheme === 'dark' ? styles.inputDark : styles.inputLight],
            inputAndroid: [styles.inputAndroid, colorScheme === 'dark' ? styles.inputDark : styles.inputLight],
            placeholder: {
              color: colorScheme === 'dark' ? '#888' : '#666'
            },
            iconContainer: styles.iconContainer,
          }}
          onValueChange={(value) => setCategory(value)}
          items={[
            { label: 'Salary', value: 'salary' },
            { label: 'Other', value: 'other' },
          ]}
          placeholder={{ label: 'Pilih kategori pemasukan', value: null }}
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: successColor }]} onPress={handleIncomeSubmit}>
          <Text style={styles.buttonText}>Tambah Pemasukan</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 24,
    fontSize: 125,
    textAlign: 'center',
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    height: 50,
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
  },
  inputLight: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
  },
  inputIOS: {
    height: 50,
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    paddingRight: 30,
  },
  inputAndroid: {
    height: 50,
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    paddingRight: 30,
  },
  placeholder: {
    color: 'gray',
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
