import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import Text from '../components/Text';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Mock data - in real app, fetch based on ID
const products = {
  '1': {
    id: 1,
    name: 'Fresh Apple',
    rating: '5.0',
    image: require('../../assets/images/img-1.avif'),
    price: '$4.79',
    quantity: '1Kg',
    ingredients: ['Celery', 'Avocado', 'Spinach'],
    description: 'Fresh, high-quality produce carefully selected for the best flavor and nutrition. Perfect for your daily cooking needs and healthy lifestyle.',
  },
  '2': {
    id: 2,
    name: 'Fresh Tomato',
    rating: '4.8',
    image: require('../../assets/images/img-2.avif'),
    price: '$6.29',
    quantity: '1Kg',
    ingredients: ['Celery', 'Avocado', 'Spinach'],
    description: 'Fresh, high-quality produce carefully selected for the best flavor and nutrition. Perfect for your daily cooking needs and healthy lifestyle.',
  },
  '3': {
    id: 3,
    name: 'Fresh Grape',
    rating: '4.9',
    image: require('../../assets/images/img-3.avif'),
    price: '$5.19',
    quantity: '1Kg',
    ingredients: ['Celery', 'Avocado', 'Spinach'],
    description: 'Fresh, high-quality produce carefully selected for the best flavor and nutrition. Perfect for your daily cooking needs and healthy lifestyle.',
  },
  '4': {
    id: 4,
    name: 'Fresh Orange',
    rating: '5.0',
    image: require('../../assets/images/img-4.avif'),
    price: '$6.49',
    quantity: '1Kg',
    ingredients: ['Celery', 'Avocado', 'Spinach'],
    description: 'Fresh, high-quality produce carefully selected for the best flavor and nutrition. Perfect for your daily cooking needs and healthy lifestyle.',
  },
  '5': {
    id: 5,
    name: 'Dragon Fruit',
    rating: '4.7',
    image: require('../../assets/images/img-5.avif'),
    price: '$7.25',
    quantity: '1Kg',
    ingredients: ['Celery', 'Avocado', 'Spinach'],
    description: 'Fresh, high-quality produce carefully selected for the best flavor and nutrition. Perfect for your daily cooking needs and healthy lifestyle.',
  },
  '6': {
    id: 6,
    name: 'Pineapple',
    rating: '4.7',
    image: require('../../assets/images/img-6.avif'),
    price: '$5.49',
    quantity: '1Kg',
    ingredients: ['Celery', 'Avocado', 'Spinach'],
    description: 'Fresh, high-quality produce carefully selected for the best flavor and nutrition. Perfect for your daily cooking needs and healthy lifestyle.',
  },
};

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const product = products[id as keyof typeof products] || products['1'];

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleFavorite = async () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animate scale and color
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          useNativeDriver: true,
          tension: 300,
          friction: 3,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 3,
        }),
      ]),
      Animated.timing(colorAnim, {
        toValue: newFavoriteState ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    colorAnim.setValue(isFavorite ? 1 : 0);
  }, []);

  const addToCart = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Add to cart logic here
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#F3F4F6',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 20, color: '#000000' }}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleFavorite}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#333333',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
              }}
            >
              <Animated.Text
                style={{
                  fontSize: 20,
                  color: colorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#FFFFFF', '#EF4444'],
                  }),
                }}
              >
                ♥
              </Animated.Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Product Image Section */}
        <View style={{ alignItems: 'center', marginTop: 0, marginBottom: 30 }}>
          <Image
            source={product.image}
            style={{
              width: SCREEN_WIDTH * 0.7,
              height: SCREEN_WIDTH * 0.7,
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
            resizeMode="cover"
          />
        </View>

        {/* Product Info Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Image
              source={require('../../assets/images/star.png')}
              style={{ width: 20, height: 20, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#000000' }}>
              {product.rating}
            </Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#000000', marginBottom: 8 }}>
            {product.name}
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '600', color: '#FBBF24' }}>
            {product.price}
          </Text>
        </View>

        {/* Ingredients Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000', marginBottom: 16 }}>
            Ingredients
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {product.ingredients.map((ingredient: string, index: number) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#FFFFFF',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 25,
                  marginRight: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000' }}>
                  {ingredient}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Description Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 100 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000', marginBottom: 12 }}>
            Description
          </Text>
          <Text style={{ fontSize: 16, color: '#6B7280', lineHeight: 24 }}>
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* Footer Section (Action Bar) */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 20,
          paddingVertical: 20,
          paddingBottom: 30,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Quantity Selector */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#F59E0B' }}>
            <TouchableOpacity
              onPress={decreaseQuantity}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000' }}>−</Text>
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000', marginHorizontal: 16, minWidth: 30, textAlign: 'center' }}>
              {quantity.toString().padStart(2, '0')}
            </Text>
            <TouchableOpacity
              onPress={increaseQuantity}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000000' }}>+</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            onPress={addToCart}
            style={{
              flex: 1,
              backgroundColor: '#F59E0B',
              paddingVertical: 15.5,
              paddingHorizontal: 16,
              borderRadius: 25,
              marginLeft: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={require('../../assets/images/shopping-cart.png')}
              style={{ width: 18, height: 18, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000' }}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

