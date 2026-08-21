import { createFileRoute } from '@tanstack/react-router';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Alert, Modal, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Phone, Video, Smile, Paperclip, Mic, Send, PhoneOff, MicOff, MessageSquare, Calendar, Monitor, Volume2, X, Play, Pause, FileText, Image as ImageIcon, Camera, Trash2 } from 'lucide-react-native';
import { mentors, type Mentor } from '../lib/data';
import { fetchMentorById } from '../lib/api';

export const Route = createFileRoute('/chat/$id')({
  component: ChatRoom,
});

const initialMsgs = [
  { from: 'them', text: 'Hey! Excited about our session tomorrow 🚀', time: '10:24' },
  { from: 'me', text: 'Same here! Quick question — should I prep anything?', time: '10:25' },
  { from: 'them', text: "Just have a notebook ready. We'll build a tiny model together.", time: '10:26' },
  { from: 'me', text: 'Sounds perfect — see you then!', time: '10:27' },
];

function VoiceMessagePlayer({ duration }: { duration: string }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1.0) {
            setIsPlaying(false);
            clearInterval(timer);
            return 0;
          }
          return prev + 0.1;
        });
      }, 300);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  return (
    <View style={styles.voicePlayer}>
      <TouchableOpacity 
        style={styles.voicePlayBtn} 
        onPress={() => setIsPlaying(!isPlaying)}
        activeOpacity={0.7}
      >
        {isPlaying ? <Pause color="#8b5cf6" size={14} /> : <Play color="#8b5cf6" size={14} fill="#8b5cf6" />}
      </TouchableOpacity>
      
      <View style={styles.voiceWaveContainer}>
        {[20, 35, 15, 50, 30, 40, 25, 35, 20, 30].map((h, idx) => {
          const filled = progress > (idx / 10);
          return (
            <View 
              key={idx} 
              style={[
                styles.waveBar, 
                { height: h * 0.4, backgroundColor: filled ? '#8b5cf6' : '#c8c6cd' }
              ]} 
            />
          );
        })}
      </View>
      <Text style={styles.voiceDuration}>{duration}</Text>
    </View>
  );
}

function CodePlaygroundBlock({ 
  initialCode, 
  language, 
  msgIndex, 
  msgs, 
  setMsgs, 
  id 
}: { 
  initialCode: string; 
  language: string; 
  msgIndex: number; 
  msgs: any[]; 
  setMsgs: any; 
  id: string; 
}) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  const runCode = () => {
    setRunning(true);
    setOutput('Compiling and running code...');
    
    setTimeout(() => {
      setRunning(false);
      const lines = code.split('\n');
      let printLines: string[] = [];
      
      lines.forEach((line) => {
        const printMatch = line.match(/print\((['"])(.*?)\1\)/);
        if (printMatch) {
          printLines.push(printMatch[2]);
        }
        const printFMatch = line.match(/print\(f(['"])(.*?)\1\)/);
        if (printFMatch) {
          let cleanStr = printFMatch[2]
            .replace('{skill1}', 'Python')
            .replace('{skill2}', 'React Design');
          printLines.push(cleanStr);
        }
      });
      
      if (printLines.length > 0) {
        setOutput(printLines.join('\n') + '\n\n>>> Process finished with exit code 0');
      } else {
        setOutput('>>> Running main.py\nSwapping Python for React Design...\nMatch Success!\n\n>>> Process finished with exit code 0');
      }
    }, 1200);
  };

  return (
    <View style={styles.playgroundCard}>
      <View style={styles.playgroundHeader}>
        <View style={styles.playgroundEditorDots}>
          <View style={[styles.playgroundEditorDot, { backgroundColor: '#ef4444' }]} />
          <View style={[styles.playgroundEditorDot, { backgroundColor: '#f59e0b' }]} />
          <View style={[styles.playgroundEditorDot, { backgroundColor: '#22c55e' }]} />
        </View>
        <Text style={styles.playgroundLang}>{language.toUpperCase()} PLAYGROUND</Text>
      </View>
      
      <TextInput
        value={code}
        onChangeText={(newVal: string) => {
          setCode(newVal);
          const updated = [...msgs];
          updated[msgIndex] = { ...updated[msgIndex], code: newVal };
          setMsgs(updated);
          localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
        }}
        multiline
        style={styles.playgroundInput}
      />
      
      <TouchableOpacity 
        style={[styles.playgroundRunBtn, running && { opacity: 0.7 }]} 
        onPress={runCode}
        disabled={running}
        activeOpacity={0.8}
      >
        <Text style={styles.playgroundRunText}>{running ? 'Running...' : 'Run Code ▶'}</Text>
      </TouchableOpacity>
      
      {output ? (
        <View style={styles.consoleContainer}>
          <Text style={styles.consoleTitle}>Console Output:</Text>
          <Text style={styles.consoleOutput}>{output}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function ChatRoom() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id = route.params?.id;
  const [m, setM] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    fetchMentorById(id)
      .then((data) => {
        if (active) {
          setM(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) {
          const fallback = mentors.find((x) => x.id === id) || mentors[0];
          setM(fallback);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  const [msgs, setMsgs] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);

  // Calling / Screen Sharing states
  const [activeCallMode, setActiveCallMode] = useState<'none' | 'voice' | 'screenshare'>('none');
  const [showCallChat, setShowCallChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Attachment Actions Panel state
  const [showAttachmentActions, setShowAttachmentActions] = useState(false);

  // Incoming Call state
  const [incomingCall, setIncomingCall] = useState<{ type: 'voice' | 'video' | 'screenshare'; mentorId: string } | null>(null);

  const [outgoingCall, setOutgoingCall] = useState<{ type: 'voice' | 'video'; mentorId: string } | null>(null);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  const sendVoiceMessage = () => {
    const durationStr = `0:${recSeconds.toString().padStart(2, '0')}`;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      from: 'me',
      type: 'voice',
      duration: durationStr,
      time: timeNow
    };
    const updated = [...msgs, newMsg];
    setMsgs(updated);
    localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
    setIsRecording(false);
  };

  const sendMockImage = (url: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      from: 'me',
      type: 'image',
      mediaUrl: url,
      time: timeNow
    };
    const updated = [...msgs, newMsg];
    setMsgs(updated);
    localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
    setShowAttachmentActions(false);
  };

  const sendMockFile = (name: string, size: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      from: 'me',
      type: 'file',
      fileName: name,
      fileSize: size,
      time: timeNow
    };
    const updated = [...msgs, newMsg];
    setMsgs(updated);
    localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
    setShowAttachmentActions(false);
  };

  const sendCodePlaygroundMessage = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      from: 'me',
      type: 'code_playground',
      code: `def double_swap(skill1, skill2):\n    print(f"Swapping {skill1} for {skill2}...")\n    return "Match Success!"\n\ndouble_swap("Python", "React Design")`,
      language: 'python',
      consoleOutput: '',
      time: timeNow
    };
    const updated = [...msgs, newMsg];
    setMsgs(updated);
    localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
  };

  const isSessionBooked = () => {
    if (!m || !m.name) return false;
    try {
      const bookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
      return bookings.some((b: any) => {
        const matchName = b.with && b.with.toLowerCase() === m.name.toLowerCase();
        const matchId = b.mentorId && m.id && b.mentorId === m.id;
        return !!(matchName || matchId);
      });
    } catch (e) {
      return false;
    }
  };

  const handleCallPress = (type: 'voice' | 'video' | 'screenshare') => {
    if (!isSessionBooked()) {
      Alert.alert(
        'Swap Session Required',
        `You can only place calls, video calls, or screen sharing after booking a swap session with ${m?.name || 'this mentor'}. Please schedule a session first.`
      );
      return;
    }
    
    if (type === 'voice') {
      initiateVoiceCall();
    } else if (type === 'video') {
      initiateVideoCall();
    } else {
      setActiveCallMode('screenshare');
    }
  };

  const initiateVoiceCall = () => {
    setOutgoingCall({ type: 'voice', mentorId: id });
    localStorage.setItem('incoming_call', JSON.stringify({ type: 'voice', mentorId: id, callerName: 'You' }));
    
    // Simulate other user accepting call after 3 seconds
    setTimeout(() => {
      setOutgoingCall(null);
      setActiveCallMode('voice');
    }, 3000);
  };

  const initiateVideoCall = () => {
    setOutgoingCall({ type: 'video', mentorId: id });
    localStorage.setItem('incoming_call', JSON.stringify({ type: 'video', mentorId: id, callerName: 'You' }));
    
    // Simulate other user accepting video call after 3 seconds
    setTimeout(() => {
      setOutgoingCall(null);
      navigation.navigate('VideoDetails', { id });
    }, 3000);
  };

  // 1-second auto live polling from localStorage
  useEffect(() => {
    const poll = setInterval(() => {
      if (id) {
        // Poll messages
        const localMsgs = localStorage.getItem(`chat_msgs_${id}`);
        if (localMsgs) {
          const parsed = JSON.parse(localMsgs);
          if (JSON.stringify(parsed) !== JSON.stringify(msgs)) {
            setMsgs(parsed);
          }
        }
        
        // Poll incoming call status
        const callData = localStorage.getItem('incoming_call');
        if (callData) {
          try {
            const parsedCall = JSON.parse(callData);
            if (parsedCall.mentorId === id) {
              setIncomingCall(parsedCall);
            }
          } catch (e) {
            console.error(e);
          }
        } else {
          setIncomingCall(null);
        }
      }
    }, 1000);

    return () => clearInterval(poll);
  }, [id, msgs]);

  // Scheduler for mock responses and calls
  const [secondsSinceLastMsg, setSecondsSinceLastMsg] = useState(-1);
  const [incomingCallScheduled, setIncomingCallScheduled] = useState(false);

  useEffect(() => {
    if (msgs.length === 0) return;
    const lastMsg = msgs[msgs.length - 1];
    if (lastMsg.from === 'me') {
      setSecondsSinceLastMsg(0);
    } else {
      setSecondsSinceLastMsg(-1);
    }
  }, [msgs]);

  useEffect(() => {
    let timer: any;
    if (secondsSinceLastMsg >= 0) {
      timer = setInterval(() => {
        setSecondsSinceLastMsg((prev) => {
          const next = prev + 1;
          if (next === 2) {
            setTyping(true);
          }
          if (next === 4) {
            setTyping(false);
            const userMsg = msgs[msgs.length - 1]?.text || '';
            let replyText = "I'd love to help you with that! Let's make sure we have a session scheduled. You can book one by tapping the Calendar icon at the top.";
            let isBooking = false;
            
            const lowerMsg = userMsg.toLowerCase();
            const booked = isSessionBooked();
            
            if (booked) {
              if (lowerMsg.includes('python') || lowerMsg.includes('coding') || lowerMsg.includes('code')) {
                replyText = "Python is a fantastic choice! We can discuss core syntax, machine learning integration, or backend framework options. I'm ready for our call!";
              } else if (lowerMsg.includes('figma') || lowerMsg.includes('design') || lowerMsg.includes('ui') || lowerMsg.includes('ux')) {
                replyText = "Figma is perfect for real-time swap sessions. We can collaborate on component variants, design systems, and advanced prototyping.";
              } else if (lowerMsg.includes('spanish') || lowerMsg.includes('languages') || lowerMsg.includes('english')) {
                replyText = "Great! Conversational practice is the fastest way to learn. We can structure our swap to split time between speaking both languages.";
              } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
                replyText = "Thanks for booking a session!";
              } else if (lowerMsg.includes('video') || lowerMsg.includes('call') || lowerMsg.includes('screenshare')) {
                replyText = "Sure, let's jump on a quick voice/video call! Placing the call now...";
                isBooking = true;
              } else {
                replyText = "That sounds perfect. Let's start our voice/video call session now to discuss these topics in detail!";
              }
            } else {
              if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
                replyText = "Hi!";
              } else if (lowerMsg.includes('book') || lowerMsg.includes('session')) {
                replyText = "Awesome! Simply click the '+' attachment menu or the calendar icon above to choose a day and time slot to confirm.";
              } else {
                replyText = `To access voice/video calls or receive personalized mentorship, please book a swap session first. Tap the Calendar icon above or in the '+' attachment menu.`;
              }
            }

            const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const replyMsg = { from: 'them', text: replyText, time: timeNow };
            const updated = [...msgs, replyMsg];
            setMsgs(updated);
            localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));

            const chatsList = JSON.parse(localStorage.getItem('chats_list') || '[]');
            const chatIdx = chatsList.findIndex((c: any) => c.id === id);
            if (chatIdx > -1) {
              chatsList[chatIdx].last = replyText;
              chatsList[chatIdx].time = 'now';
              localStorage.setItem('chats_list', JSON.stringify(chatsList));
            }

            if (isBooking && booked) {
              setIncomingCallScheduled(true);
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [secondsSinceLastMsg, msgs, id]);

  useEffect(() => {
    let timer: any;
    if (incomingCallScheduled) {
      timer = setTimeout(() => {
        const type = Math.random() > 0.5 ? 'video' : 'voice';
        const callObj = { type, mentorId: id };
        localStorage.setItem('incoming_call', JSON.stringify(callObj));
        setIncomingCall(callObj as any);
        setIncomingCallScheduled(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [incomingCallScheduled, id]);

  // Call duration timer
  useEffect(() => {
    let timer: any;
    if (activeCallMode !== 'none') {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeCallMode]);

  const [screenStream, setScreenStream] = useState<any>(null);

  useEffect(() => {
    if (activeCallMode === 'screenshare') {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true })
          .then((stream) => {
            setScreenStream(stream);
            stream.getVideoTracks()[0].onended = () => {
              setActiveCallMode('none');
              setScreenStream(null);
            };
          })
          .catch((err) => {
            console.warn('Display media capture error:', err);
            setActiveCallMode('none');
          });
      } else {
        alert('Screensharing is not supported by this browser.');
        setActiveCallMode('none');
      }
    } else {
      if (screenStream) {
        screenStream.getTracks().forEach((track: any) => track.stop());
        setScreenStream(null);
      }
    }
  }, [activeCallMode]);

  useEffect(() => {
    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, [screenStream]);

  const send = () => {
    if (!text.trim()) return;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { from: 'me', text, time: timeNow };
    const updated = [...msgs, newMsg];
    setMsgs(updated);
    localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
    setText('');

    // Update last message in chat list
    const chatsList = JSON.parse(localStorage.getItem('chats_list') || '[]');
    const chatIdx = chatsList.findIndex((c: any) => c.id === id);
    if (chatIdx > -1) {
      chatsList[chatIdx].last = text;
      chatsList[chatIdx].time = 'now';
      localStorage.setItem('chats_list', JSON.stringify(chatsList));
    }
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const renderCallChatDrawer = () => {
    return (
      <View style={styles.callChatDrawer}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>In-call Chat</Text>
          <TouchableOpacity onPress={() => setShowCallChat(false)} style={styles.drawerClose}>
            <X color="#342F3D" size={20} />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.drawerScrollContent} showsVerticalScrollIndicator={false}>
          {msgs.map((msg, i) => {
            const me = msg.from === 'me';
            return (
              <View key={i} style={[styles.msgWrapper, me ? styles.msgRight : styles.msgLeft]}>
                <View style={[styles.msgBubble, me ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.msgText, me ? styles.textMe : styles.textThem]}>{msg.text}</Text>
                  <Text style={[styles.msgTime, me ? styles.timeMe : styles.timeThem]}>{msg.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.drawerInputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={send}
            placeholder="Message..."
            placeholderTextColor="#8C8797"
            style={styles.drawerTextInput}
          />
          <TouchableOpacity onPress={send} style={styles.drawerSendBtn} activeOpacity={0.7}>
            <Send color="#ffffff" size={14} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderIncomingCallOverlay = () => {
    if (!incomingCall) return null;
    const isVideo = incomingCall.type === 'video';
    const isShare = incomingCall.type === 'screenshare';
    
    return (
      <View style={styles.incomingCallOverlay}>
        <View style={styles.incomingCallCard}>
          <Text style={styles.ringingLabel}>🔔 Ringing...</Text>
          <Image source={{ uri: m?.avatar }} style={styles.incomingAvatar} />
          <Text style={styles.incomingName}>{m?.name}</Text>
          <Text style={styles.incomingType}>
            Incoming {isVideo ? 'Video Call' : isShare ? 'Screen Share Session' : 'Voice Call'}...
          </Text>
          
          <View style={styles.incomingActions}>
            <TouchableOpacity 
              style={[styles.incomingBtn, styles.declineBtn]}
              onPress={() => {
                localStorage.removeItem('incoming_call');
                setIncomingCall(null);
              }}
              activeOpacity={0.8}
            >
              <PhoneOff color="#ffffff" size={20} />
              <Text style={styles.incomingBtnText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.incomingBtn, styles.acceptBtn]}
              onPress={() => {
                localStorage.removeItem('incoming_call');
                setIncomingCall(null);
                if (isVideo) {
                  navigation.navigate('VideoDetails', { id: m?.id });
                } else if (isShare) {
                  setActiveCallMode('screenshare');
                } else {
                  setActiveCallMode('voice');
                }
              }}
              activeOpacity={0.8}
            >
              <Phone color="#ffffff" size={20} />
              <Text style={styles.incomingBtnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderOutgoingCallOverlay = () => {
    if (!outgoingCall) return null;
    const isVideo = outgoingCall.type === 'video';
    return (
      <View style={styles.incomingCallOverlay}>
        <View style={styles.incomingCallCard}>
          <Text style={styles.ringingLabel}>📞 Calling...</Text>
          <Image source={{ uri: m?.avatar }} style={styles.incomingAvatar} />
          <Text style={styles.incomingName}>{m?.name}</Text>
          <Text style={styles.incomingType}>
            Placing {isVideo ? 'Video' : 'Voice'} Call...
          </Text>
          
          <TouchableOpacity 
            style={[styles.incomingBtn, styles.declineBtn, { width: '80%', marginTop: 12 }]}
            onPress={() => {
              localStorage.removeItem('incoming_call');
              setOutgoingCall(null);
            }}
            activeOpacity={0.8}
          >
            <PhoneOff color="#ffffff" size={20} />
            <Text style={styles.incomingBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAttachmentPanel = () => {
    if (!showAttachmentActions) return null;
    return (
      <View style={styles.attachmentPanel}>
        <Text style={styles.attachmentTitle}>WhatsApp Options & Calls</Text>
        <View style={styles.attachmentRow}>
          <TouchableOpacity 
            style={styles.attachmentActionCard} 
            onPress={() => {
              setShowAttachmentActions(false);
              sendMockFile('SkillSwap_Syllabus.pdf', '2.4 MB');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.attachmentIconBox, { backgroundColor: '#e0f2fe' }]}>
              <FileText color="#0284c7" size={20} />
            </View>
            <Text style={styles.attachmentLabel}>Document</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.attachmentActionCard} 
            onPress={() => {
              setShowAttachmentActions(false);
              sendCodePlaygroundMessage();
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.attachmentIconBox, { backgroundColor: '#f0fdf4' }]}>
              <Monitor color="#16a34a" size={20} />
            </View>
            <Text style={styles.attachmentLabel}>Playground</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.attachmentActionCard} 
            onPress={() => {
              setShowAttachmentActions(false);
              sendMockImage('https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=80');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.attachmentIconBox, { backgroundColor: '#fdf2f8' }]}>
              <Camera color="#db2777" size={20} />
            </View>
            <Text style={styles.attachmentLabel}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.attachmentActionCard} 
            onPress={() => {
              setShowAttachmentActions(false);
              handleCallPress('voice');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.attachmentIconBox, { backgroundColor: '#e0e7ff' }]}>
              <Phone color="#4f46e5" size={20} />
            </View>
            <Text style={styles.attachmentLabel}>Voice Call</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.attachmentActionCard} 
            onPress={() => {
              setShowAttachmentActions(false);
              handleCallPress('video');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.attachmentIconBox, { backgroundColor: '#f3e8ff' }]}>
              <Video color="#9333ea" size={20} />
            </View>
            <Text style={styles.attachmentLabel}>Video Call</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.attachmentActionCard} 
            onPress={() => {
              setShowAttachmentActions(false);
              navigation.navigate('Book', { id: m?.id });
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.attachmentIconBox, { backgroundColor: '#fff7ed' }]}>
              <Calendar color="#ea580c" size={20} />
            </View>
            <Text style={styles.attachmentLabel}>Book Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading || !m) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#342F3D" size={20} />
        </TouchableOpacity>
        <Image source={{ uri: m.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{m.name}</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.actionIconBtn} 
          onPress={() => handleCallPress('voice')}
          activeOpacity={0.7}
        >
          <Phone color="#342F3D" size={16} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionIconBtn} 
          onPress={() => handleCallPress('screenshare')}
          activeOpacity={0.7}
        >
          <Monitor color="#342F3D" size={16} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionIconBtn, styles.videoBtn]} 
          onPress={() => handleCallPress('video')}
          activeOpacity={0.7}
        >
          <Video color="#ffffff" size={16} />
        </TouchableOpacity>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {msgs.map((msg, i) => {
          const me = msg.from === 'me';
          return (
            <View key={i} style={[styles.msgWrapper, me ? styles.msgRight : styles.msgLeft]}>
              <View
                style={[
                  styles.msgBubble,
                  me ? styles.bubbleMe : styles.bubbleThem,
                  msg.type === 'image' && styles.bubbleImage,
                ]}
              >
                {msg.type === 'voice' ? (
                  <VoiceMessagePlayer duration={msg.duration} />
                ) : msg.type === 'image' ? (
                  <View style={styles.imageMsgContainer}>
                    <Image source={{ uri: msg.mediaUrl }} style={styles.imageMsg} />
                    <View style={styles.imageLabelRow}>
                      <Text style={[styles.imageLabel, me ? styles.textMe : styles.textThem]}>Sent an image</Text>
                    </View>
                  </View>
                ) : msg.type === 'file' ? (
                  <View style={styles.fileMsgContainer}>
                    <FileText color={me ? "#ffffff" : "#8b5cf6"} size={28} />
                    <View style={styles.fileMsgInfo}>
                      <Text style={[styles.fileMsgName, me ? styles.textMe : styles.textThem]} numberOfLines={1}>
                        {msg.fileName}
                      </Text>
                      <Text style={styles.fileMsgSize}>{msg.fileSize}</Text>
                    </View>
                  </View>
                ) : msg.type === 'code_playground' ? (
                  <CodePlaygroundBlock 
                    initialCode={msg.code} 
                    language={msg.language} 
                    msgIndex={i}
                    msgs={msgs}
                    setMsgs={setMsgs}
                    id={id}
                  />
                ) : (
                  <Text style={[styles.msgText, me ? styles.textMe : styles.textThem]}>{msg.text}</Text>
                )}
                <Text style={[styles.msgTime, me ? styles.timeMe : styles.timeThem]}>{msg.time}</Text>
              </View>
            </View>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <View style={[styles.msgWrapper, styles.msgLeft]}>
            <View style={[styles.msgBubble, styles.bubbleThem, styles.typingBubble]}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Attachment panel drawer options */}
      {renderAttachmentPanel()}

      {/* Input area */}
      <View style={styles.inputStickyWrapper}>
        {isRecording ? (
          <View style={styles.inputContainer}>
            <TouchableOpacity 
              style={styles.utilityBtn} 
              onPress={() => setIsRecording(false)}
              activeOpacity={0.7}
            >
              <Trash2 color="#ef4444" size={20} />
            </TouchableOpacity>
            
            <View style={styles.recordingContainer}>
              <View style={styles.recordingTimerRow}>
                <View style={styles.pulseRedDot} />
                <Text style={styles.recordingText}>Recording 0:{recSeconds.toString().padStart(2, '0')}</Text>
              </View>
              <Text style={{ color: '#8C8797', fontSize: 12 }}>Slide to cancel</Text>
            </View>

            <TouchableOpacity onPress={sendVoiceMessage} style={styles.sendBtn} activeOpacity={0.7}>
              <Send color="#ffffff" size={16} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <TouchableOpacity 
              style={styles.utilityBtn} 
              onPress={() => {
                const emojis = ['👍', '🙌', '🔥', '💡', '💯', '🤔'];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                setText(prev => prev + randomEmoji);
              }}
              activeOpacity={0.7}
            >
              <Smile color="#8C8797" size={20} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.utilityBtn, showAttachmentActions && styles.utilityBtnActive]} 
              onPress={() => setShowAttachmentActions(!showAttachmentActions)}
              activeOpacity={0.7}
            >
              <Paperclip color={showAttachmentActions ? "#8b5cf6" : "#8C8797"} size={20} />
            </TouchableOpacity>

            <TextInput
              value={text}
              onChangeText={setText}
              onSubmitEditing={send}
              placeholder="Message..."
              placeholderTextColor="#8C8797"
              style={styles.textInput}
            />

            {text.trim() ? (
              <TouchableOpacity onPress={send} style={styles.sendBtn} activeOpacity={0.7}>
                <Send color="#ffffff" size={16} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                onPress={() => setIsRecording(true)} 
                style={styles.sendBtn} 
                activeOpacity={0.7}
              >
                <Mic color="#ffffff" size={16} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Incoming Call alert ringing dialog overlay */}
      {renderIncomingCallOverlay()}

      {/* Outgoing Call ringing dialog overlay */}
      {renderOutgoingCallOverlay()}

      {/* Voice Call Overlay Modal */}
      <Modal visible={activeCallMode === 'voice'} animationType="slide">
        <View style={styles.callOverlay}>
          <View style={styles.callContainer}>
            <View style={styles.callHeader}>
              <TouchableOpacity 
                onPress={() => {
                  setActiveCallMode('none');
                  setShowCallChat(false);
                }}
                style={styles.overlayBackButton}
                activeOpacity={0.7}
              >
                <ArrowLeft color="#8C8797" size={14} />
                <Text style={styles.overlayBackText}>Back to Chat</Text>
              </TouchableOpacity>
              
              <Text style={styles.callStateText}>Secure Voice Call</Text>
              <Text style={styles.callTimer}>{formatDuration(callDuration)}</Text>
            </View>

            <View style={styles.callAvatarSection}>
              <View style={styles.pulseContainer}>
                <View style={[styles.pulseRing, styles.pulse1]} />
                <View style={[styles.pulseRing, styles.pulse2]} />
                <Image source={{ uri: m.avatar }} style={styles.callAvatar} />
              </View>
              <Text style={styles.callName}>{m.name}</Text>
              <Text style={styles.callStatus}>Connected</Text>
            </View>

            <View style={styles.callControls}>
              <TouchableOpacity 
                style={[styles.controlCircle, isMuted ? styles.controlCircleActive : styles.controlCircleInactive]}
                onPress={() => setIsMuted(!isMuted)}
                activeOpacity={0.7}
              >
                <MicOff color={isMuted ? '#ffffff' : '#5E5470'} size={22} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlCircle, showCallChat ? styles.controlCircleActive : styles.controlCircleInactive]}
                onPress={() => setShowCallChat(!showCallChat)}
                activeOpacity={0.7}
              >
                <MessageSquare color={showCallChat ? '#ffffff' : '#5E5470'} size={22} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlCircle, isSpeakerOn ? styles.controlCircleActive : styles.controlCircleInactive]}
                onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                activeOpacity={0.7}
              >
                <Volume2 color={isSpeakerOn ? '#ffffff' : '#5E5470'} size={22} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlCircle, styles.callHangup]}
                onPress={() => {
                  setActiveCallMode('none');
                  setShowCallChat(false);
                }}
                activeOpacity={0.7}
              >
                <PhoneOff color="#ffffff" size={22} />
              </TouchableOpacity>
            </View>
          </View>

          {showCallChat && renderCallChatDrawer()}
        </View>
      </Modal>

      {/* Screenshare Overlay Modal */}
      <Modal visible={activeCallMode === 'screenshare'} animationType="slide">
        <View style={styles.callOverlay}>
          <View style={styles.callContainer}>
            <View style={styles.callHeader}>
              <TouchableOpacity 
                onPress={() => {
                  setActiveCallMode('none');
                  setShowCallChat(false);
                }}
                style={styles.overlayBackButton}
                activeOpacity={0.7}
              >
                <ArrowLeft color="#8C8797" size={14} />
                <Text style={styles.overlayBackText}>Back to Chat</Text>
              </TouchableOpacity>
              
              <Text style={styles.callStateText}>Screen Sharing Session</Text>
              <Text style={styles.callTimer}>{formatDuration(callDuration)}</Text>
              
              <TouchableOpacity 
                onPress={() => {
                  setActiveCallMode('none');
                  setShowCallChat(false);
                }}
                style={styles.topEndShareBtn}
                activeOpacity={0.8}
              >
                <PhoneOff color="#ffffff" size={12} style={{ marginRight: 6 }} />
                <Text style={styles.topEndShareText}>End Screen Share</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sharedScreenContainer}>
              {Platform.OS === 'web' && screenStream ? (
                <video
                  ref={(ref) => {
                    if (ref) {
                      ref.srcObject = screenStream;
                      ref.play().catch(e => console.warn(e));
                    }
                  }}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#1E1E2F'
                  }}
                />
              ) : (
                <View style={[styles.sharedScreenMock, { justifyContent: 'center', alignItems: 'center' }]}>
                  <ActivityIndicator size="large" color="#8b5cf6" />
                  <Text style={{ color: '#8C8797', marginTop: 12 }}>
                    {Platform.OS === 'web' ? 'Starting screen capture...' : 'Screenshare is only available on Web'}
                  </Text>
                </View>
              )}

              <View style={styles.pipVideo}>
                <Image source={{ uri: m.avatar }} style={styles.pipAvatar} />
                <View style={styles.pipNameBadge}>
                  <Text style={styles.pipNameText}>{m.name}</Text>
                </View>
              </View>
            </View>

            <View style={styles.callControls}>
              <TouchableOpacity 
                style={[styles.controlCircle, isMuted ? styles.controlCircleActive : styles.controlCircleInactive]}
                onPress={() => setIsMuted(!isMuted)}
                activeOpacity={0.7}
              >
                <MicOff color={isMuted ? '#ffffff' : '#5E5470'} size={22} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlCircle, showCallChat ? styles.controlCircleActive : styles.controlCircleInactive]}
                onPress={() => setShowCallChat(!showCallChat)}
                activeOpacity={0.7}
              >
                <MessageSquare color={showCallChat ? '#ffffff' : '#5E5470'} size={22} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlCircle, styles.callHangup]}
                onPress={() => {
                  setActiveCallMode('none');
                  setShowCallChat(false);
                }}
                activeOpacity={0.7}
              >
                <PhoneOff color="#ffffff" size={22} />
              </TouchableOpacity>
            </View>
          </View>

          {showCallChat && renderCallChatDrawer()}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    zIndex: 20,
  },
  backButton: {
    padding: 6,
    marginRight: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F0F6',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  headerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#22C55E',
    fontWeight: '500',
  },
  actionIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  videoBtn: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  msgWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
  },
  msgLeft: {
    justifyContent: 'flex-start',
  },
  msgRight: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bubbleMe: {
    backgroundColor: '#8b5cf6',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomLeftRadius: 4,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8C8797',
  },
  msgText: {
    fontSize: 14,
  },
  textMe: {
    color: '#ffffff',
  },
  textThem: {
    color: '#342F3D',
  },
  msgTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeThem: {
    color: '#8C8797',
  },
  inputStickyWrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 6,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  utilityBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#342F3D',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FAF9FC',
    flexDirection: 'row',
  },
  callContainer: {
    flex: 1,
    height: '100%',
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF9FC',
  },
  callHeader: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    position: 'relative',
  },
  callStateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8C8797',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  callTimer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginTop: 8,
  },
  callAvatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  pulse1: {
    transform: [{ scale: 0.9 }],
  },
  pulse2: {
    transform: [{ scale: 0.7 }],
  },
  callAvatar: {
    width: 110,
    height: 110,
    borderRadius: 36,
    backgroundColor: '#F3F0F6',
  },
  callName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 6,
  },
  callStatus: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  callControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  controlCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  controlCircleInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  controlCircleActive: {
    backgroundColor: '#8b5cf6',
  },
  callHangup: {
    backgroundColor: '#ef4444',
  },
  sharedScreenContainer: {
    width: '100%',
    flex: 1,
    marginVertical: 20,
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1E1E2F',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(94, 84, 112, 0.12)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
  },
  sharedScreenMock: {
    flex: 1,
    padding: 16,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
    marginBottom: 12,
  },
  editorDotRow: {
    flexDirection: 'row',
    gap: 6,
  },
  editorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  editorFilename: {
    color: '#8C8797',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 16,
  },
  codeTextContainer: {
    flex: 1,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#D4D4D4',
    lineHeight: 18,
    textAlign: 'left',
  },
  codeKeyword: {
    color: '#C779D0',
    fontWeight: 'bold',
  },
  codeString: {
    color: '#98C379',
  },
  codeNumber: {
    color: '#D19A66',
  },
  codeComment: {
    color: '#5C6370',
    fontStyle: 'italic',
  },
  pipVideo: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 80,
    height: 110,
    borderRadius: 16,
    backgroundColor: '#342F3D',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  pipAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pipNameBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pipNameText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  callChatDrawer: {
    width: 320,
    height: '100%',
    backgroundColor: '#FAF9FC',
    borderLeftWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 12,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  drawerClose: {
    padding: 4,
  },
  drawerScrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  drawerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  drawerTextInput: {
    flex: 1,
    fontSize: 12,
    color: '#342F3D',
    padding: 0,
  },
  drawerSendBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomingCallOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(52, 47, 61, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  incomingCallCard: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: 'rgba(94, 84, 112, 0.25)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 48,
    elevation: 8,
  },
  ringingLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8b5cf6',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  incomingAvatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    marginBottom: 12,
  },
  incomingName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 4,
  },
  incomingType: {
    fontSize: 12,
    color: '#8C8797',
    marginBottom: 24,
    textAlign: 'center',
  },
  incomingActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  incomingBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
  },
  declineBtn: {
    backgroundColor: '#ef4444',
  },
  acceptBtn: {
    backgroundColor: '#22c55e',
  },
  incomingBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  attachmentPanel: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  attachmentTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8C8797',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  attachmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  attachmentActionCard: {
    flex: 1,
    alignItems: 'center',
  },
  attachmentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: 'rgba(0, 0, 0, 0.02)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  attachmentLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5E5470',
  },
  utilityBtnActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  voicePlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 12,
    width: 200,
  },
  voicePlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  voiceWaveContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    gap: 2,
  },
  waveBar: {
    flex: 1,
    borderRadius: 1,
    width: 3,
  },
  voiceDuration: {
    fontSize: 10,
    color: '#8C8797',
    fontWeight: '500',
  },
  bubbleImage: {
    padding: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageMsgContainer: {
    width: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageMsg: {
    width: '100%',
    height: 150,
    backgroundColor: '#FAF9FC',
  },
  imageLabelRow: {
    padding: 8,
  },
  imageLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  fileMsgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: 200,
    paddingVertical: 4,
  },
  fileMsgInfo: {
    flex: 1,
  },
  fileMsgName: {
    fontSize: 13,
    fontWeight: '600',
  },
  fileMsgSize: {
    fontSize: 10,
    color: '#8C8797',
    marginTop: 2,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  recordingTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  recordingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  playgroundCard: {
    width: 240,
    backgroundColor: '#1E1E2F',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  playgroundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
    marginBottom: 8,
  },
  playgroundEditorDots: {
    flexDirection: 'row',
    gap: 4,
  },
  playgroundEditorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  playgroundLang: {
    fontSize: 9,
    color: '#8C8797',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  playgroundInput: {
    fontSize: 11,
    color: '#A9B2C3',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 8,
    minHeight: 80,
  },
  playgroundRunBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  playgroundRunText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  consoleContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 8,
  },
  consoleTitle: {
    fontSize: 9,
    color: '#8c8797',
    fontWeight: '700',
    marginBottom: 4,
  },
  consoleOutput: {
    fontSize: 10,
    color: '#34d399',
    lineHeight: 14,
  },
  topEndShareBtn: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 99,
    marginTop: 8,
  },
  topEndShareText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  overlayBackButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  overlayBackText: {
    fontSize: 12,
    color: '#8C8797',
    fontWeight: '600',
  },
});
