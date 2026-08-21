import { createFileRoute } from '@tanstack/react-router';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { chats } from '../lib/data';

export const Route = createFileRoute('/chat/')({
  component: ChatList,
});

export default function ChatList() {
  const navigation = useNavigation<any>();
  const [chatsList, setChatsList] = React.useState<any[]>([]);

  React.useEffect(() => {
    const localChats = localStorage.getItem('chats_list');
    if (localChats) {
      setChatsList(JSON.parse(localChats));
    } else {
      setChatsList(chats);
      localStorage.setItem('chats_list', JSON.stringify(chats));
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <Text style={styles.title}>Messages</Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search color="#8C8797" size={20} style={styles.searchIcon} />
        <TextInput
          placeholder="Search conversations"
          placeholderTextColor="#8C8797"
          style={styles.searchInput}
        />
      </View>

      {/* Conversations List */}
      <View style={styles.chatList}>
        {chatsList.map((c) => (
          <TouchableOpacity
            key={c.id}
            onPress={() => navigation.navigate('ChatDetails', { id: c.id })}
            style={styles.chatCard}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: c.avatar }} style={styles.avatar} />
              {c.online && <View style={styles.statusDot} />}
            </View>

            <View style={styles.chatContent}>
              <View style={styles.row}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.time}>{c.time}</Text>
              </View>
              <View style={[styles.row, styles.messageRow]}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {c.last}
                </Text>
                {c.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{c.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 110,
    backgroundColor: '#FAF9FC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#342F3D',
    padding: 0,
  },
  chatList: {
    width: '100%',
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F3F0F6',
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  chatContent: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageRow: {
    marginTop: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  time: {
    fontSize: 10,
    color: '#8C8797',
  },
  lastMessage: {
    fontSize: 12,
    color: '#8C8797',
    flex: 1,
    paddingRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#8b5cf6',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
