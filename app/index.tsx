import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, Modal, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from './components/Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ✅ moved these outside HomeScreen
  const fruits = [
    { id: 1, image: require('../assets/images/apple.png') },
    { id: 2, image: require('../assets/images/peach.png') },
    { id: 3, image: require('../assets/images/grape.png') },
    { id: 4, image: require('../assets/images/watermelon.png') },
    { id: 5, image: require('../assets/images/strawberry.png') },
    { id: 6, image: require('../assets/images/corn.png') },
    { id: 7, image: require('../assets/images/mushroom.png') },
  ];

  const offers = [
    { id: 1, name: "Fresh Apple", quantity: "1Kg", price: "$4.79", image: require('../assets/images/img-1.jpg'), rating: "5.0" },
    { id: 2, name: "Fresh Tomato", quantity: "1Kg", price: "$6.29", image: require('../assets/images/img-2.jpg'), rating: "4.8" },
    { id: 3, name: "Fresh Grape", quantity: "1Kg", price: "$5.19", image: require('../assets/images/img-3.jpg'), rating: "4.9" },
    { id: 4, name: "Fresh Orange", quantity: "1Kg", price: "$6.49", image: require('../assets/images/img-4.jpg'), rating: "5.0" },
    { id: 5, name: "Dragon Fruit", quantity: "1Kg", price: "$7.25", image: require('../assets/images/img-5.jpg'), rating: "4.7" },
    { id: 6, name: "Pineapple", quantity: "1Kg", price: "$5.49", image: require('../assets/images/img-6.jpg'), rating: "4.7" },
  ];

  const bannerOffers = [
    { id: 1, discount: "40%", title: "Discount On Your", subtitle: "First Order" },
    { id: 2, discount: "30%", title: "Discount On Your", subtitle: "Second Order" },
    { id: 3, discount: "50%", title: "Special Weekend", subtitle: "Offer" },
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerScrollRef = useRef<ScrollView>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Combine fruits and offers for search, avoiding duplicates
  const allItems = [
    ...offers,
    ...fruits
      .map((fruit, index) => ({
        id: offers.length + index + 1,
        name: `Fresh ${['Apple', 'Peach', 'Grape', 'Watermelon', 'Strawberry', 'Corn', 'Mushroom'][index]}`,
        quantity: "1Kg",
        price: "$5.99",
        image: fruit.image,
        rating: "4.5"
      }))
      .filter(fruitItem => {
        // Filter out fruits that already exist in offers by name
        return !offers.some(offer => 
          offer.name.toLowerCase() === fruitItem.name.toLowerCase()
        );
      })
  ];

  // Filter items based on search query
  const filteredItems = searchQuery.trim() === '' 
    ? [] 
    : allItems
        .filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((item, index, self) => 
          // Remove duplicates based on name (case-insensitive)
          index === self.findIndex((t) => 
            t.name.toLowerCase() === item.name.toLowerCase()
          )
        );

  return (
    <ScrollView className='flex-1 bg-white px-5 font-sans' style={{ paddingTop: Math.max(insets.top, 40), paddingBottom: insets.bottom }} showsVerticalScrollIndicator={false}>

      {/* Header Section */}
      <View className='mt-10 flex-row justify-between items-end'>
        <View>
          <Text className='text-3xl font-semibold' style={{ lineHeight: 32 }}>Daily</Text>
          <Text className='text-3xl font-semibold' style={{ lineHeight: 32 }}>Grocery Food</Text>
        </View>
        <TouchableOpacity 
          className='bg-gray-100 p-3 rounded-full' 
          style={{ marginBottom: 4.5 }}
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsSearchVisible(true);
          }}
        >
          <Image 
            source={require('../assets/images/search.png')}
            className='w-7 h-7'
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View>

      {/* Banner Section */}
      <View style={{ marginTop: 24 }}>
        <ScrollView
          ref={bannerScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 40));
            setCurrentBannerIndex(index);
          }}
          style={{ marginHorizontal: -20 }}
        >
          {bannerOffers.map((offer) => (
            <View key={offer.id} style={{ width: SCREEN_WIDTH - 40, marginHorizontal: 20 }}>
              <LinearGradient
                colors={['#FEB52E', '#FEBF4C', '#FFF5E1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 16,
                  padding: 24,
                  position: 'relative',
                  minHeight: 200,
                  overflow: 'hidden',
                }}
              >
                {/* Left Section - Text and Button */}
                <View style={{ flex: 1, zIndex: 10 }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 24,
                      fontWeight: '600',
                      lineHeight: 28,
                      marginBottom: 4,
                    }}
                  >
                    GET {offer.discount}
                  </Text>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 24,
                      fontWeight: '600',
                      lineHeight: 28,
                      marginBottom: 4,
                    }}
                  >
                    {offer.title}
                  </Text>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 24,
                      fontWeight: '600',
                      lineHeight: 28,
                      marginBottom: 16,
                    }}
                  >
                    {offer.subtitle}
                  </Text>

                  <TouchableOpacity
                    onPress={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                    style={{
                      backgroundColor: '#FFFFFF',
                      paddingVertical: 12,
                      paddingHorizontal: 26,
                      borderRadius: 25,
                      alignSelf: 'flex-start',
                      marginTop: 8,
                    }}
                  >
                    <Text style={{ color: '#000000', fontWeight: '600', fontSize: 15 }}>Shop Now</Text>
                  </TouchableOpacity>
                </View>

                {/* Right Section - Image */}
                <Image
                  source={require('../assets/images/image (1).png')}
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: 16,
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }}
                  resizeMode="cover"
                />
              </LinearGradient>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Indicators */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12, alignItems: 'center' }}>
          {bannerOffers.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                bannerScrollRef.current?.scrollTo({
                  x: index * (SCREEN_WIDTH - 40),
                  animated: true,
                });
                setCurrentBannerIndex(index);
              }}
              style={{
                width: currentBannerIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentBannerIndex === index ? '#FEB52E' : '#D1D5DB',
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>
      </View>

      {/* Fruits Section */}
      <View className='mt-8'>
        <Text className='text-2xl font-semibold mb-3'>More Fruits</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {fruits.map((item, index) => {
            const fruitWidth = 56;
            const visibleFruits = 5;
            const availableWidth = SCREEN_WIDTH - 40; // Account for padding
            const totalFruitWidth = visibleFruits * fruitWidth;
            const totalGapWidth = availableWidth - totalFruitWidth;
            const gapBetweenFruits = totalGapWidth / (visibleFruits - 1);
            const marginRight = index < fruits.length - 1 ? gapBetweenFruits : 0;
            
            return (
              <View
                key={item.id}
                style={{
                  backgroundColor: '#E5E7EB',
                  width: fruitWidth,
                  height: 56,
                  marginRight: marginRight,
                  borderRadius: 28,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <Image
                  source={item.image}
                  style={{ 
                    width: 30, 
                    height: 30,
                    alignSelf: 'center',
                  }}
                  resizeMode='contain'
                />
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Special Offers */}
      <View style={{ marginTop: 32, marginBottom: 40 }}>
        <Text className='text-2xl font-semibold mb-3'>Special Offers</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {offers.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                router.push(`/product/${item.id}` as any);
              }}
              activeOpacity={0.8}
              style={{
                backgroundColor: '#F9FAFB',
                width: '48%',
                marginBottom: 16,
                padding: 12,
                borderRadius: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View style={{ position: 'relative' }}>
                <Image
                  source={item.image}
                  style={{ width: '100%', height: 140, borderRadius: 12, marginBottom: 8 }}
                  resizeMode="cover"
                />
                {/* Rating Badge */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 8,
                    backgroundColor: '#FFFFFF',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Image
                    source={require('../assets/images/star.png')}
                    style={{ width: 14, height: 14, marginRight: 4 }}
                    resizeMode="contain"
                  />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#000000' }}>
                    {item.rating}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.name}</Text>
                  <Text style={{ color: '#6B7280', marginTop: 8, fontSize: 13 }}>
                    {item.quantity}, Price
                  </Text>
                  <Text style={{ color: '#000000', marginTop: 6, fontSize: 16, fontWeight: '600' }}>
                    {item.price}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={async (e) => {
                    e.stopPropagation();
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#FFBA3E',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 8,
                    marginTop: 23,
                  }}
                >
                  <Image
                    source={require('../assets/images/plus.png')}
                    style={{ width: 16, height: 16 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* View More Button */}
        <TouchableOpacity
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          style={{
            backgroundColor: '#FFBA3E',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 25,
            alignSelf: 'center',
            marginTop: 16,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: '#000000', fontWeight: '600', fontSize: 16 }}>
            View More
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Modal */}
      <Modal
        visible={isSearchVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setIsSearchVisible(false);
          setSearchQuery('');
        }}
      >
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: Math.max(insets.top, 50), paddingBottom: insets.bottom }}>
          {/* Search Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
            <TouchableOpacity
              onPress={() => {
                setIsSearchVisible(false);
                setSearchQuery('');
              }}
              style={{ 
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                backgroundColor: '#F9FAFB',
              }}
            >
              <Text style={{ fontSize: 20, color: '#000000', fontWeight: '600' }}>←</Text>
            </TouchableOpacity>
            <View style={{ 
              flex: 1, 
              flexDirection: 'row', 
              alignItems: 'center', 
              backgroundColor: '#F9FAFB', 
              borderRadius: 25, 
              paddingHorizontal: 16, 
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}>
              <Image 
                source={require('../assets/images/search.png')}
                style={{ width: 20, height: 20, marginRight: 12, tintColor: '#6B7280' }}
                resizeMode='contain'
              />
              <TextInput
                style={{ flex: 1, fontSize: 16, color: '#000000', padding: 0 }}
                placeholder="Search for items..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
                returnKeyType="search"
              />
            </View>
          </View>

          {/* Search Results */}
          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            {searchQuery.trim() === '' ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
                <Text style={{ fontSize: 16, color: '#9CA3AF' }}>Start typing to search...</Text>
              </View>
            ) : filteredItems.length === 0 ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
                <Text style={{ fontSize: 16, color: '#9CA3AF' }}>No items found</Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {filteredItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setIsSearchVisible(false);
                      setSearchQuery('');
                      router.push(`/product/${item.id}` as any);
                    }}
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: '#F9FAFB',
                      width: '48%',
                      marginBottom: 16,
                      padding: 12,
                      borderRadius: 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <View style={{ position: 'relative' }}>
                      <Image
                        source={item.image}
                        style={{ width: '100%', height: 140, borderRadius: 12, marginBottom: 8 }}
                        resizeMode="cover"
                      />
                      {/* Rating Badge */}
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 16,
                          left: 8,
                          backgroundColor: '#FFFFFF',
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 20,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.1,
                          shadowRadius: 2,
                          elevation: 2,
                        }}
                      >
                        <Image
                          source={require('../assets/images/star.png')}
                          style={{ width: 14, height: 14, marginRight: 4 }}
                          resizeMode="contain"
                        />
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#000000' }}>
                          {item.rating}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.name}</Text>
                        <Text style={{ color: '#6B7280', marginTop: 8, fontSize: 13 }}>
                          {item.quantity}, Price
                        </Text>
                        <Text style={{ color: '#000000', marginTop: 6, fontSize: 16, fontWeight: '600' }}>
                          {item.price}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={async (e) => {
                          e.stopPropagation();
                          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: '#FFBA3E',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft: 8,
                          marginTop: 23,
                        }}
                      >
                        <Image
                          source={require('../assets/images/plus.png')}
                          style={{ width: 16, height: 16 }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

    </ScrollView>
  );
}
