import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, Button, Linking, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function App() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null); // Estado para o planeta selecionado

  useEffect(() => {
    fetch('https://swapi.dev/api/planets/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setPlanets(data.results); // Ajuste conforme a estrutura real dos dados
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error.message);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handlePress = (planet) => {
    setSelectedPlanet(planet);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: {error.message}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planets</Text>
      {selectedPlanet ? (
        <View style={styles.detailContainer}>
          <Image 
            source={{ uri: `https://starwars-visualguide.com/assets/img/planets/${selectedPlanet.url.split('/')[5]}.jpg` }} 
            style={styles.image}
            onError={() => { 
              console.log(`Image failed to load for planet: ${selectedPlanet.name}`);
            }}
          />
          <Text style={styles.itemText}>{selectedPlanet.name}</Text>
          <Text style={styles.itemText}>Rotation Period: {selectedPlanet.rotation_period}</Text>
          <Text style={styles.itemText}>Orbital Period: {selectedPlanet.orbital_period}</Text>
          <Text style={styles.itemText}>Diameter: {selectedPlanet.diameter}</Text>
          <Text style={styles.itemText}>Climate: {selectedPlanet.climate}</Text>
          <Text style={styles.itemText}>Gravity: {selectedPlanet.gravity}</Text>
          <Text style={styles.itemText}>Terrain: {selectedPlanet.terrain}</Text>
          <Text style={styles.itemText}>Surface Water: {selectedPlanet.surface_water}</Text>
          <Text style={styles.itemText}>Population: {selectedPlanet.population}</Text>
          <Button 
            title="Back to List"
            onPress={() => setSelectedPlanet(null)}
          />
        </View>
      ) : (
        <FlatList
          data={planets}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Button 
                title={item.name}
                onPress={() => handlePress(item)} // Atualiza o estado com o planeta selecionado
              />
            </View>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  detailContainer: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  itemText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
  },
});
