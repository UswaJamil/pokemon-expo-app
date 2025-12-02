import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, Image, View } from "react-native";

const colorByType: Record<string, string> = {
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
};

function getColor(typeName?: string) {
  return colorByType[typeName ?? ""] ?? "#999999";
}

export default function Details() {
  const params = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<any>(null);
  const name = params.name as string;

  useEffect(() => {
    async function fetchPokemonByName(name: string) {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const details = await res.json();
        setPokemon(details);
      } catch (e) {
        console.log(e);
      }
    }
    if (name) fetchPokemonByName(name);
  }, [name]);

  const primaryType = pokemon?.types?.[0]?.type?.name;

  return (
    <>
      <Stack.Screen options={{ title: name }} />
      <ScrollView contentContainerStyle={styles.container}>

        <View style={[styles.header, { backgroundColor: getColor(primaryType) + "22" }]}> 
          <Text style={styles.title}>{name}</Text>
          <View style={styles.typeRow}>
            {(pokemon?.types ?? []).map((t: any) => (
              <View key={t.type.name} style={[styles.typeBadge, { backgroundColor: getColor(t.type.name) }]}>
                <Text style={styles.typeText}>{t.type.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.spriteWrap}>
          <Image
            source={{ uri: pokemon?.sprites?.other?.['official-artwork']?.front_default ?? pokemon?.sprites?.front_default }}
            style={styles.sprite}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats</Text>
          {(pokemon?.stats ?? []).map((s: any) => {
            const pct = Math.min(100, Math.round((s.base_stat / 255) * 100));
            return (
              <View key={s.stat.name} style={styles.statRow}>
                <Text style={styles.statLabel}>{s.stat.name}</Text>
                <View style={styles.statBarBg}>
                  <View style={[styles.statBarFill, { width: `${pct}%`, backgroundColor: getColor(primaryType) }]} />
                </View>
                <Text style={styles.statValue}>{s.base_stat}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Sprites</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.values(pokemon?.sprites ?? {})
              .filter((u: any) => typeof u === 'string' && u)
              .map((url: any, idx: number) => (
                <Image key={idx} source={{ uri: url }} style={styles.thumb} />
              ))}
          </ScrollView>
        </View>

        {!pokemon && <Text style={styles.loading}>Loading...</Text>}

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  header: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  typeRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  typeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  typeText: {
    color: 'white',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  spriteWrap: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  sprite: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    width: 90,
    textTransform: 'capitalize',
  },
  statBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  statBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  statValue: {
    width: 36,
    textAlign: 'right',
  },
  thumb: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  loading: {
    textAlign: 'center',
    marginTop: 8,
  },
});
