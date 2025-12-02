import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}
interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}
const colorByType = {
  grass: "#4CAF50",
  fire: "#FF7043",
  water: "#42A5F5",
  bug: "#AED581",

  electric: "#FFD54F",
  psychic: "#FF80AB",
  ice: "#81D4FA",
  rock: "#8D6E63",
  ground: "#D2B48C",
  poison: "#BA68C8",
  flying: "#90CAF9",
  dragon: "#7E57C2",
  dark: "#424242",
  steel: "#B0BEC5",
  fairy: "#F48FB1",
  ghost: "#9575CD",
  fighting: "#EF9A9A",

  // extra beautiful colors
  crystal: "#A7FFF6",
  blossom: "#FFB7D5",
  ember: "#FF6F61",
  ocean: "#0097A7",
  storm: "#5C6BC0",
  sunset: "#FF8A65",
  meadow: "#7CB342",
  aurora: "#B388FF",
  lava: "#D84315",
  nebula: "#CE93D8",
} as Record<string, string>;

function getColor(typeName?: string) {
  const base = colorByType[typeName ?? ""] ?? "#CCCCCC";
  return base + "50";
}

export default function Pokemons() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const router = useRouter();
  const animVals = useRef<Animated.Value[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  async function fetchPokemon() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=10");
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        })
      );
      setPokemons(detailedPokemons);

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    if (pokemons.length === 0) return;
    // initialize animated values
    animVals.current = pokemons.map(() => new Animated.Value(0));
    Animated.stagger(
      100,
      animVals.current.map((av) =>
        Animated.timing(av, { toValue: 1, duration: 400, useNativeDriver: true })
      )
    ).start();
    // start a gentle shared pulse for Details buttons
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pokemons]);

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}>
      {pokemons.map((pokemon, index) => {
        const anim = animVals.current[index] ?? new Animated.Value(1);
        const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
        return (
          <Animated.View
            key={pokemon.name}
            style={{ opacity: anim, transform: [{ translateY }], marginBottom: 8 }}>
            <View
              style={[
                styles.card,
                { backgroundColor: getColor(pokemon.types[0]?.type?.name) },
              ]}>
              <View style={styles.info}>
                <Text style={styles.name}>{pokemon.name}</Text>
                <View style={styles.badgesRow}>
                  {pokemon.types.map((t) => (
                    <View
                      key={t.type.name}
                      style={[
                        styles.badge,
                        { backgroundColor: getColor(t.type.name) },
                      ]}>
                      <Text style={styles.badgeText}>{t.type.name}</Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.detailsButton,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => router.push(`/details?name=${pokemon.name}`)}>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Text style={styles.detailsButtonText}>Details</Text>
                  </Animated.View>
                </Pressable>
              </View>

              <View style={styles.images}>
                <Image source={{ uri: pokemon.imageBack }} style={styles.smallImage} />
                <Image source={{ uri: pokemon.image }} style={[styles.smallImage, styles.frontImage]} />
              </View>
            </View>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  badgesRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: "white",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  detailsButton: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.12)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: '#111',
    fontWeight: '700',
  },
  images: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  smallImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    position: "absolute",
    opacity: 0.95,
  },
  frontImage: {
    transform: [{ translateX: -8 }, { translateY: 0 }],
  },
});
