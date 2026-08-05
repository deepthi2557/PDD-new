declare module '*.css?url' {
  const src: string;
  export default src;
}

declare module '*.css' {
  const src: string;
  export default src;
}

declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const StyleSheet: {
    create: (styles: any) => any;
    [key: string]: any;
  };
  export const TouchableOpacity: any;
  export const TextInput: any;
  export const ScrollView: any;
  export const Image: any;
  export const ActivityIndicator: any;
  export const Alert: any;
  export type ViewStyle = any;
  export type TextStyle = any;
  export type ImageStyle = any;
  const content: any;
  export default content;
}

declare module 'lucide-react-native' {
  export const Home: any;
  export const Calendar: any;
  export const MessageCircle: any;
  export const Trophy: any;
  export const User: any;
  export const Mail: any;
  export const Lock: any;
  export const ArrowRight: any;
  export const Sparkles: any;
  export const Search: any;
  export const Bell: any;
  export const ChevronDown: any;
  export const Star: any;
  export const CalendarPlus: any;
  export const ShieldCheck: any;
  export const Flame: any;
  export const Clock: any;
  export const CheckCircle2: any;
  export const AlertTriangle: any;
  export const Users: any;
  export const TrendingUp: any;
  export const Flag: any;
  export const MessageSquare: any;
  export const Activity: any;
  export const BarChart3: any;
  export const ArrowLeft: any;
  export const Phone: any;
  export const Video: any;
  export const Smile: any;
  export const Paperclip: any;
  export const Mic: any;
  export const Send: any;
  export const Heart: any;
  export const Plus: any;
  export const Crown: any;
  export const UserPlus: any;
  export const GraduationCap: any;
  export const BookOpen: any;
  export const Brain: any;
  export const Award: any;
}

declare module '@expo/vector-icons' {
  export const FontAwesome: any;
  export const Ionicons: any;
  export const MaterialIcons: any;
  export const Feather: any;
}

interface ImportMetaEnv {
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
