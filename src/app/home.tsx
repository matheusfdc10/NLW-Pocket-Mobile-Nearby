import { Categories, CategoryPorps } from "@/components/categories";
import { PlaceProps } from "@/components/place"; 
import { Places } from "@/components/places"; 
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { colors, fontFamily } from "@/styles/theme";
import { router } from "expo-router";

type MarketsProps = PlaceProps & {
  latitude: number
  longitude: number
}

const currentLocation = {
  latitude: -23.561187293883442,
  longitude: -46.656451388116494,
}

export default function Home() {
  const [categories, setCategories] = useState<CategoryPorps>([]);
  const [category, setCategory] = useState("");
  const [markets, setMarkets] = useState<MarketsProps[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  async function fechCategories() {
      try {
          const { data } = await api.get("/categories");
          setCategories(data)
          setCategory(data[0].id)
      } catch (error) {
          console.log(error);
          Alert.alert("Cateorias", "Não foi possível carregar as categorias.")
      }
  }

  async function fetchMarkets() {
      if(!category) return
      try {
          const { data } = await api.get(`/markets/category/${category}`)
          setMarkets(data)
      } catch(error) {
          console.log(error);
          Alert.alert('Locais', 'Não foi possível carregar os locais.')
      }
  }

  async function getCurrentLocation() {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync()

      if (granted) {
        const location = await Location.getCurrentPositionAsync()
        setLocation(location)
        console.log(location)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   getCurrentLocation()
  // }, [])

  useEffect(() => {
    fechCategories()
  }, [])

  useEffect(() => {
    fetchMarkets()
  }, [category])

  return (
    <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
        <Categories 
            data={categories}
            onSelect={setCategory}
            selected={category}
        />

        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: 	currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          // compassOffset={{
          //   x: 20,
          //   y: 200
          // }}
          showsCompass={false}
        >
          <Marker
            identifier="current"
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: 	currentLocation.longitude,
            }}
            image={require("@/assets/location.png")}
          />

          {markets.map((item) => (
            <Marker
              key={item.id}
              identifier={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              image={require("@/assets/pin.png")}
            >
              <Callout onPress={() => router.navigate(`/market/${item.id}`)}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.gray[600],
                      fontFamily: fontFamily.medium,
                    }}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.gray[600],
                      fontFamily: fontFamily.regular,
                    }}
                  >
                    {item.address}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        <Places data={markets}/>
    </View>
  )
}