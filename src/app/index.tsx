import React from "react";
import { Animated, View, Text, StyleSheet, Pressable, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

export default function Welcome() {
  const router = useRouter();

  // a subtle Pokémon artwork as background (Bulbasaur). Replace with any image you like.
  const bg = {
    uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  };

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const titleAnim = React.useRef(new Animated.Value(0)).current;
  const paraAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.04, duration: 1000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [scaleAnim]);

  React.useEffect(() => {
    // entrance for title and paragraph
    Animated.stagger(140, [
      Animated.timing(titleAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(paraAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
    ]).start();
  }, [titleAnim, paraAnim]);

  return (
    <ImageBackground source={bg} resizeMode="cover" style={styles.bg} imageStyle={{ opacity: 0.12 }}>
      {/* CSS-only gradient-like overlay: two stacked colored views */}
      <View style={styles.overlayContainer} pointerEvents="none">
        <View style={styles.overlayTop} />
        <View style={styles.overlayBottom} />
      </View>

      {/* Content sits above overlays */}
      <View style={styles.contentWrapper}>
        <Animated.Text
          style={[
            styles.title,
            { opacity: titleAnim, transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] },
          ]}
        >
          <Text style={styles.titleLight}>Welcome to the </Text>
          <Text style={styles.titleAccent}>Pokémon Universe</Text>
        </Animated.Text>
          <Animated.Text style={[styles.subtitle, { opacity: titleAnim, transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }]}>
            A minimal Pokédex built with Expo
          </Animated.Text>
        <Animated.Text
          style={[
            styles.paragraph,
            { opacity: paraAnim, transform: [{ translateY: paraAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] },
          ]}
        >
          Explore a small list of <Text style={styles.accentInline}>Pokémon</Text>. Tap the <Text style={styles.emphasis}>button</Text> below to view <Text style={styles.accentInline}>Pokémon</Text> and their details.
        </Animated.Text>
        <Pressable
          style={styles.buttonWrap}
          onPress={() => router.push("/pokemons")}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <LinearGradient
                colors={["#2563EB", "#06B6D4"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradientButton}
              >
              <Text style={styles.buttonText}>View Pokémons</Text>
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  bg: {
    flex: 1,
    width: '100%',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(2,39,49,0.06)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(6,182,212,0.04)',
  },
  contentWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    marginBottom: 12,
    color: '#022731',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(255,255,255,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    fontStyle: 'normal',
  },
  titleLight: {
    color: '#053B45',
    fontWeight: '700',
  },
  titleAccent: {
    color: '#0EA5A9',
    fontWeight: '900',
    textShadowColor: 'rgba(14,165,169,0.06)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#0B3940',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.8,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 18,
    color: "#0F4146",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
    opacity: 0.98,
  },
  accentInline: {
    color: '#0EA5A9',
    fontWeight: '700',
  },
  emphasis: {
    color: '#022731',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  buttonWrap: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
// welcome screen is the app entry; pokemons list moved to /pokemons
