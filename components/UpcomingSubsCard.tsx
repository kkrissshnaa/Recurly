import { formatCurrency } from '@/lib/utils';
import React from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const UpcomingSubsCard = ({ name, price, daysLeft, icon, currency}:
  UpcomingSubscription) => {
  return (
    <View className='upcoming-card'>
      <View className='upcoming-row'>
        {typeof icon === 'string' ? (
          <View className='upcoming-icon items-center justify-center bg-white rounded-lg' style={{ width: 40, height: 40 }}>
            <MaterialCommunityIcons name={icon as any} size={24} color="#081126" />
          </View>
        ) : (
          <Image source={icon} className='upcoming-icon' style={{ width: 40, height: 40 }}/>
        )}
        <View>
          <Text className="upcoming-price">{formatCurrency(price, currency)}</Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            {daysLeft > 1 ? `${daysLeft} days left`: 'Last day'} 
          </Text>
        </View>
      </View>
      <Text className='upcoming-name' numberOfLines={1}>{name}</Text>
    </View>
  )
}

export default UpcomingSubsCard