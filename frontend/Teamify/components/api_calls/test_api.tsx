
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";

const API_URL = "http://192.168.0.32:5000/";

type HelloWorldType = {
    name: string;
  };

export const friendrequest = () => {
  const [data, setData] = useState<HelloWorldType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      setData(json);
      console.log('Fetched Data:', json)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        data && (
            <View style={styles.item}>
                <Text style={styles.text}>Test Component</Text>
                <Text style={styles.text}>{data.name}</Text>
            </View>
        )
      )}
    </View>
  );
};


export const DataList = () => {
    const [data, setData] = useState<HelloWorldType | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();
        setData(json);
        console.log('Fetched Data:', json)
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          data && (
              <View style={styles.item}>
                  <Text style={styles.text}>Test Component</Text>
                  <Text style={styles.text}>{data.name}</Text>
              </View>
          )
        
        )}
      </View>
    );
  };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 18,
  },
});