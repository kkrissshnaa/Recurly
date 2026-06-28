import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from '@/lib/utils'
import clsx from 'clsx'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const SubscriptionCard = ({name, price, currency, icon, billing, color, category, plan, renewalDate, expanded, onPress, paymentMethod, startDate, status}: SubscriptionCardProps) => {
  return (
    <Pressable onPress={onPress} className={clsx('sub-card', expanded ? 'sub-card-expanded': 'bg-card')} style={!expanded && color ? {backgroundColor : color} : undefined} >
        <View className='sub-head'>
            <View className='sub-main'>
                {typeof icon === 'string' ? (
                  <View className='sub-icon items-center justify-center bg-white rounded-lg' style={{ width: 48, height: 48 }}>
                    <MaterialCommunityIcons name={icon as any} size={28} color="#081126" />
                  </View>
                ) : (
                  <Image source={icon} className='sub-icon' style={{ width: 48, height: 48, borderRadius: 8 }}/>
                )}
                <View className='Sub-copy'>
                    <Text numberOfLines={1} className='sub-title'>
                        {name}
                    </Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' className='sub-meta'>
                        {category?.trim() || plan?.trim() || (renewalDate? formatSubscriptionDateTime(renewalDate): "")}
                    </Text>
                </View>
            </View>
            <View className='sub-price-box'>
                <Text className='sub-price'>{formatCurrency(price, currency)}</Text>
                <Text className='sub-billing'>{billing}</Text>
            </View>
        </View>
        {expanded && (
            <View className='sub-body'>
                <View className='sub-details'>
                    <View className='sub-row'>
                        <View className='sub-row-copy'>
                            <Text className='sub-label'>Payment:</Text>
                            <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>
                                {paymentMethod?.trim()}
                            </Text>
                        </View>
                    </View>
                    <View className='sub-row'>
                        <View className='sub-row-copy'>
                            <Text className='sub-label'>Started:</Text>
                            <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>
                                {formatSubscriptionDateTime(startDate)}
                            </Text>
                        </View>
                    </View>
                    <View className='sub-row'>
                        <View className='sub-row-copy'>
                            <Text className='sub-label'>Renewal:</Text>
                            <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>
                                {formatSubscriptionDateTime(renewalDate)}
                            </Text>
                        </View>
                    </View>
                    <View className='sub-row'>
                        <View className='sub-row-copy'>
                            <Text className='sub-label'>Status:</Text>
                            <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>
                                {formatStatusLabel(status)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )}
    </Pressable>
  )
}

export default SubscriptionCard