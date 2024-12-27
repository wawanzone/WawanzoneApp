import { StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, useColorScheme, TouchableOpacity } from 'react-native';
import { Text, View, useThemeColor } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

interface TabOneScreenProps {
  onExpanseAdded: () => void;
}

export default function TabOneScreen({ onExpanseAdded }: TabOneScreenProps) {
  const colorScheme = useColorScheme();

  // Use the theme color for the danger variant
  const dangerColor = useThemeColor({}, 'danger');

  // State for expense amount and category
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);

  const [resetKey, setResetKey] = useState(0);

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!amount || !category) {
      alert('Please enter both amount and category.');
      return;
    }

    // Create an object to store the data
    const expenseData = {
      amount,
      category,
      date: new Date().toISOString(), // Save the date of the expense
    };

    try {
      // Get existing data from AsyncStorage
      const existingData = await AsyncStorage.getItem('expenses');
      const parsedData = existingData ? JSON.parse(existingData) : [];

      // Add the new expense to the list
      parsedData.push(expenseData);

      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem('expenses', JSON.stringify(parsedData));

      alert('Pengeluaran tersimpan:\nJumlah: ' + amount + '\nKategori: ' + category);

      // Notify the parent screen to update its state (FinancesScreen)
      if (onExpanseAdded) {
        onExpanseAdded();
      }

      // Optionally reset the form
      setAmount('');
      setCategory(null);

      // Force re-render by changing resetKey
      setResetKey(resetKey + 1);

    } catch (error) {
      alert('Error saving data');
      console.error(error);
    }
  };

  const loadExpenses = async () => {
    try {
      const existingData = await AsyncStorage.getItem('expenses');
      const parsedData = existingData ? JSON.parse(existingData) : [];
      console.log(parsedData); // This will display all saved expenses
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.icon}>💸</Text>

        {/* Label for Amount Input */}
        <Text style={styles.label}>Jumlah Pengeluaran</Text>
        <TextInput
          style={[
            styles.input,
            colorScheme === 'dark' ? styles.inputDark : styles.inputLight
          ]}
          placeholder="Masukkan jumlah pengeluaran"
          placeholderTextColor={colorScheme === 'dark' ? '#888' : '#666'}
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => setAmount(text)} // Save the input amount
        />

        {/* Label for Category Select */}
        <Text style={styles.label}>Kategori Pengeluaran</Text>
        <RNPickerSelect
          key={category}  // This will trigger a re-render when category changes
          style={{
            inputIOS: [styles.inputIOS, colorScheme === 'dark' ? styles.inputDark : styles.inputLight],
            inputAndroid: [styles.inputAndroid, colorScheme === 'dark' ? styles.inputDark : styles.inputLight],
            placeholder: {
              color: colorScheme === 'dark' ? '#888' : '#666',
            },
            iconContainer: styles.iconContainer,
          }}
          value={category}
          onValueChange={(value) => setCategory(value)}
          items={[
            { label: 'Food & Beverages', value: 'food_beverages' },
            { label: 'Transportation', value: 'transportation' },
            { label: 'Housing & Utilities', value: 'housing_utilities' },
            { label: 'Healthcare', value: 'healthcare' },
            { label: 'Entertainment', value: 'entertainment' },
            { label: 'Education', value: 'education' },
            { label: 'Clothing & Personal Care', value: 'clothing_personal_care' },
            { label: 'Insurance', value: 'insurance' },
            { label: 'Savings & Investments', value: 'savings_investments' },
            { label: 'Debt Payments', value: 'debt_payments' },
            { label: 'Miscellaneous', value: 'miscellaneous' },
          ]}
          placeholder={{ label: 'Pilih kategori pengeluaran', value: null }}
        />


        {/* Custom Submit Button with Danger Theme */}
        <TouchableOpacity style={[styles.button, { backgroundColor: dangerColor }]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Tambah Pengeluaran</Text>
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
function onExpanseAdded() {
  throw new Error('Function not implemented.');
}

