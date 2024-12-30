import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View, useColorScheme, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';

// Define the Expense and Income types
interface Transaction {
  amount: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export default function FinancesScreen() {
  const colorScheme = useColorScheme();
  const [history, setHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();

    // Set interval to update transactions every 5 seconds
    const intervalId = setInterval(fetchTransactions, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchTransactions = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      const storedIncomes = await AsyncStorage.getItem('incomes');

      const expenses = storedExpenses ? JSON.parse(storedExpenses).map((expense: Transaction) => ({ ...expense, type: 'expense' })) : [];
      const incomes = storedIncomes ? JSON.parse(storedIncomes).map((income: Transaction) => ({ ...income, type: 'income' })) : [];

      // Combine incomes and expenses into a single array
      const combinedHistory = [...incomes, ...expenses];
      combinedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setHistory(combinedHistory);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  // Calculate the total amount for a given type in IDR (Rupiah)
  const getTotalAmount = (type: 'income' | 'expense') => {
    const total = history
      .filter(transaction => transaction.type === type)
      .reduce((sum, transaction) => {
        const amount = parseFloat(transaction.amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

    return total;
  };

  // Format the date as "Today", "1 day ago", "2 days ago", etc.
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInTime = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else if (diffInDays <= 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('id-ID'); // Fallback to full date format
    }
  };

  // Render each transaction item with IDR format
  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <Text style={[styles.transactionText, item.type === 'income' ? styles.incomeText : styles.expenseText]}>
        {parseFloat(item.amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
      </Text>
      <View style={styles.transactionRow}>
        <Text style={styles.transactionText}>{item.category}</Text>
        <Text style={styles.transactionText}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );

  const totalIncome = getTotalAmount('income');
  const totalExpense = getTotalAmount('expense');

  return (
    <View style={styles.container}>
      {/* Bar Chart for Income and Expenses */}
      <BarChart
        data={{
          labels: ['Income', 'Expense'],
          datasets: [
            {
              data: [totalIncome, totalExpense],
            },
          ],
        }}
        width={Dimensions.get('window').width - 40} // Chart width
        height={180} // Chart height
        fromZero={true} // Ensure chart starts from 0
        withHorizontalLabels={false}
        // withInnerLines={false}
        chartConfig={{
          backgroundColor: '#1a1a1a',
          backgroundGradientFrom: '#1a1a1a',
          backgroundGradientTo: '#1a1a1a',
          decimalPlaces: 0, // No decimal numbers
          color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 0,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        style={{
          marginVertical: 10,
          borderRadius: 8,
        }}
        // Hide Y-axis labels and show value on bars
        yAxisLabel="" 
        yAxisSuffix=""
      />

      {/* Display Total Incomes and Expenses in Rupiah */}
      <View style={styles.transactionRow}>
        <Text style={styles.totalIncomeText}> {totalIncome.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
        })}</Text>
        <Text style={styles.totalExpenseText}> {totalExpense.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
        })}</Text>
      </View>

      <Text style={styles.subtitle}>Transaction History</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => `transaction-${index}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
  },
  totalIncomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745', // Green color for income
    marginBottom: 10,
  },
  totalExpenseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545', // Red color for expenses
    marginBottom: 20,
  },
  transactionItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#333',
  },
  transactionText: {
    fontSize: 14,
    color: '#ccc',
  },
  incomeText: {
    color: '#28a745', // Green color for income
  },
  expenseText: {
    color: '#dc3545', // Red color for expense
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Space between category and date
    marginTop: 5,  // Optional: Add some space between the amount and the row
  },
});
