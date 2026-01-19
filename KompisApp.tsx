import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from './contexts/AuthContext';
import type {
  ActiveHelper,
  AppStage,
  Category,
  Helper,
  Job,
  JobCategory,
  TabType,
  User,
} from './types';

const { height } = Dimensions.get('window');

interface KompisAppProps {
  userData: User | null;
}

const KompisApp = ({ userData }: KompisAppProps) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('findHelp');
  const [stage, setStage] = useState<AppStage>('main');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showNewJob, setShowNewJob] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<JobCategory>('all');
  const slideAnim = useRef(new Animated.Value(height * 0.7)).current;

  const nearbyHelpers: Helper[] = [
    {
      id: 1,
      name: 'Erik A.',
      rating: 4.9,
      distance: '2 min',
      lat: 59.92,
      lng: 10.75,
      vehicle: 'varebil',
    },
    {
      id: 2,
      name: 'Sara M.',
      rating: 4.8,
      distance: '4 min',
      lat: 59.918,
      lng: 10.755,
      vehicle: 'personbil',
    },
    {
      id: 3,
      name: 'Thomas B.',
      rating: 4.7,
      distance: '6 min',
      lat: 59.922,
      lng: 10.748,
      vehicle: 'varebil',
    },
  ];

  const jobs: Job[] = [
    {
      id: 1,
      title: 'Sofa til resirkulering',
      description:
        'Stor 3-seters sofa i god stand som må leveres på Haraldrud gjenvinningsstasjon. Trenger hjelp med å få den ned fra 2. etasje (ingen heis).',
      location: 'Grünerløkka',
      from: 'Thorvald Meyers gate 42',
      to: 'Haraldrud gjenvinningsstasjon',
      price: '450',
      distance: '2.3 km',
      timeAgo: '15 min',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      category: 'furniture',
      postedBy: {
        name: 'Kari N.',
        rating: 4.8,
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
    },
    {
      id: 2,
      title: 'Flyttekasser - 10 stk',
      description:
        '10 flyttekasser og 2 små bokhyller. Alt er pakket og klart. Må fraktes fra Majorstuen til Frogner.',
      location: 'Majorstuen',
      from: 'Bogstadveien 15',
      to: 'Frognerveien 22',
      price: '600',
      distance: '1.8 km',
      timeAgo: '32 min',
      image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&q=80',
      category: 'moving',
      postedBy: {
        name: 'Lars P.',
        rating: 4.9,
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
    },
    {
      id: 3,
      title: 'Gammel komfyr',
      description:
        'Elektrisk komfyr som må til riktig gjenvinningsstasjon. Tung, trenger 2 personer eller en med utstyr.',
      location: 'Tøyen',
      from: 'Tøyengata 5',
      to: 'Haraldrud gjenvinningsstasjon',
      price: '350',
      distance: '3.1 km',
      timeAgo: '1 time',
      image: 'https://images.unsplash.com/photo-1556911073-38141963c3c8?w=600&q=80',
      category: 'recycling',
      postedBy: {
        name: 'Mette S.',
        rating: 4.7,
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
    },
    {
      id: 4,
      title: 'Hage-avfall og greiner',
      description: 'Ca. 8 store sekker med hageavfall og noen greiner. Må til Haraldrud.',
      location: 'Sagene',
      from: 'Maridalsveien 88',
      to: 'Haraldrud gjenvinningsstasjon',
      price: '400',
      distance: '2.7 km',
      timeAgo: '2 timer',
      image: 'https://images.unsplash.com/photo-1585938389612-070163b57f57?w=600&q=80',
      category: 'recycling',
      postedBy: {
        name: 'Per A.',
        rating: 4.6,
        avatar: 'https://i.pravatar.cc/150?img=8',
      },
    },
    {
      id: 5,
      title: 'Diverse møbler',
      description:
        'Liten kommode, 2 stoler og en hylle. Alt er lett å bære. Til Fretex på Torshov.',
      location: 'Frogner',
      from: 'Gabels gate 12',
      to: 'Fretex Torshov',
      price: '300',
      distance: '1.2 km',
      timeAgo: '3 timer',
      image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&q=80',
      category: 'furniture',
      postedBy: {
        name: 'Anne L.',
        rating: 4.9,
        avatar: 'https://i.pravatar.cc/150?img=9',
      },
    },
  ];

  const categories: Category[] = [
    { id: 'all', label: 'Alle', emoji: '📦', color: '#3B82F6' },
    { id: 'furniture', label: 'Møbler', emoji: '🛋️', color: '#EF4444' },
    { id: 'moving', label: 'Flytting', emoji: '🏠', color: '#F59E0B' },
    { id: 'recycling', label: 'Resirkulering', emoji: '♻️', color: '#10B981' },
  ];

  const activeHelper: ActiveHelper = {
    name: 'Erik A.',
    rating: 4.9,
    phone: '+47 123 45 678',
    vehicle: 'Toyota Hiace - EK 12345',
    eta: '3 min',
    distance: '850 m',
    photo: 'https://i.pravatar.cc/150?img=12',
  };

  const filteredJobs =
    activeFilter === 'all' ? jobs : jobs.filter((job) => job.category === activeFilter);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const slideUp = () => {
    Animated.spring(slideAnim, {
      toValue: height * 0.15,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const slideDown = () => {
    Animated.spring(slideAnim, {
      toValue: height * 0.7,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  // Job Detail Modal
  const JobModal = ({ job, onClose }: { job: Job; onClose: () => void }) => (
    <Modal visible={true} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            <Image source={{ uri: job.image }} style={styles.modalImage} />

            <View style={styles.modalBody}>
              <View style={styles.jobHeader}>
                <View style={styles.jobCategory}>
                  <Text style={styles.jobCategoryText}>
                    {categories.find((c) => c.id === job.category)?.emoji}{' '}
                    {categories.find((c) => c.id === job.category)?.label}
                  </Text>
                </View>
                <Text style={styles.jobTimeAgo}>{job.timeAgo} siden</Text>
              </View>

              <Text style={styles.modalTitle}>{job.title}</Text>
              <Text style={styles.modalDescription}>{job.description}</Text>

              <View style={styles.locationSection}>
                <View style={styles.locationRow}>
                  <View style={styles.locationDot} />
                  <View style={styles.locationTextContainer}>
                    <Text style={styles.locationLabel}>Henting</Text>
                    <Text style={styles.locationAddress}>{job.from}</Text>
                  </View>
                </View>
                <View style={styles.locationLine} />
                <View style={styles.locationRow}>
                  <View style={styles.locationDotEnd} />
                  <View style={styles.locationTextContainer}>
                    <Text style={styles.locationLabel}>Levering</Text>
                    <Text style={styles.locationAddress}>{job.to}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.distanceCard}>
                <Ionicons name="car-outline" size={20} color="#6B7280" />
                <Text style={styles.distanceText}>Ca. {job.distance} kjøring</Text>
              </View>

              <View style={styles.posterCard}>
                <Image source={{ uri: job.postedBy.avatar }} style={styles.posterAvatar} />
                <View style={styles.posterInfo}>
                  <Text style={styles.posterName}>{job.postedBy.name}</Text>
                  <View style={styles.posterRating}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.posterRatingText}>{job.postedBy.rating}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Betaling</Text>
              <Text style={styles.priceAmount}>{job.price} kr</Text>
            </View>
            <TouchableOpacity style={styles.acceptButton}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.acceptGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.acceptButtonText}>Ta oppdraget</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // New Job Modal
  const NewJobModal = () => (
    <Modal visible={showNewJob} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNewJob(false)}>
              <Text style={styles.cancelText}>Avbryt</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Nytt oppdrag</Text>
            <TouchableOpacity>
              <Text style={styles.publishText}>Publiser</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Hva trenger du hjelp med?</Text>
              <TextInput
                style={styles.formInput}
                placeholder="F.eks: Sofa til resirkulering"
                placeholderTextColor="#9CA3AF"
                multiline
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Kategori</Text>
              <View style={styles.categoryGrid}>
                {categories
                  .filter((c) => c.id !== 'all')
                  .map((cat) => (
                    <TouchableOpacity key={cat.id} style={styles.categoryOption}>
                      <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                      <Text style={styles.categoryLabel}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Fra (henting)</Text>
              <View style={styles.locationInput}>
                <Ionicons name="location" size={20} color="#10B981" />
                <TextInput
                  style={styles.locationTextInput}
                  placeholder="Din adresse"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Til (levering)</Text>
              <View style={styles.locationInput}>
                <Ionicons name="location-outline" size={20} color="#EF4444" />
                <TextInput
                  style={styles.locationTextInput}
                  placeholder="Leveringsadresse"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Pris du tilbyr</Text>
              <View style={styles.priceInput}>
                <TextInput
                  style={styles.priceTextInput}
                  placeholder="450"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.priceUnit}>kr</Text>
              </View>
              <Text style={styles.priceHint}>💡 Anbefalt: 350-500 kr for lignende oppdrag</Text>
            </View>

            <TouchableOpacity style={styles.photoButton}>
              <Ionicons name="camera-outline" size={24} color="#10B981" />
              <Text style={styles.photoButtonText}>Legg til bilde</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Profile Screen
  if (showProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => setShowProfile(false)}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.profileHeaderTitle}>Din profil</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.profileContent}>
          <View style={styles.profileTop}>
            {userData?.avatar ? (
              <Image source={{ uri: userData.avatar }} style={styles.profileAvatarImage} />
            ) : (
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>
                  {userData?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('') || 'TB'}
                </Text>
              </View>
            )}
            <Text style={styles.profileName}>{userData?.name || 'Thomas Berg'}</Text>
            <Text style={styles.profileEmail}>{userData?.email || 'thomas.b@email.com'}</Text>
            <View style={styles.profileRating}>
              <Ionicons name="star" size={20} color="#F59E0B" />
              <Text style={styles.profileRatingText}>{userData?.rating || 4.7}</Text>
              <Text style={styles.profileTrips}>
                · {userData?.completedJobs || 89} oppdrag fullført
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {userData?.totalEarned?.toLocaleString('nb-NO') || '12,450'} kr
              </Text>
              <Text style={styles.statLabel}>Totalt tjent</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{userData?.activeStreak || 14} dager</Text>
              <Text style={styles.statLabel}>Aktiv streak 🔥</Text>
            </View>
          </View>

          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="car-outline" size={24} color="#000" />
              <Text style={styles.menuItemText}>Kjøretøy</Text>
              <Text style={styles.menuItemValue}>{userData?.vehicle || 'Varebil'}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="card-outline" size={24} color="#000" />
              <Text style={styles.menuItemText}>Betaling og uttak</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="time-outline" size={24} color="#000" />
              <Text style={styles.menuItemText}>Oppdragshistorikk</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
              <Text style={styles.menuItemText}>Varsler</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="settings-outline" size={24} color="#000" />
              <Text style={styles.menuItemText}>Innstillinger</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={24} color="#000" />
              <Text style={styles.menuItemText}>Hjelp og support</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={() => {
                Alert.alert('Logg ut', 'Er du sikker på at du vil logge ut?', [
                  { text: 'Avbryt', style: 'cancel' },
                  {
                    text: 'Logg ut',
                    style: 'destructive',
                    onPress: logout,
                  },
                ]);
              }}
            >
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Logg ut</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Active Trip Screen
  if (stage === 'active') {
    return (
      <View style={styles.container}>
        {/* Map mockup */}
        <View style={styles.map}>
          <LinearGradient
            colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']}
            style={StyleSheet.absoluteFill}
          />

          {/* User location */}
          <View style={[styles.userMarker, { top: '60%', left: '50%' }]}>
            <View style={styles.userDot} />
          </View>

          {/* Helper location */}
          <View style={[styles.helperMarker, { top: '30%', left: '45%' }]}>
            <View style={styles.carIcon}>
              <Ionicons name="car" size={20} color="#fff" />
            </View>
          </View>

          {/* Route line */}
          <View style={styles.routeLine} />
        </View>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => setStage('main')}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Bottom sheet */}
        <View style={styles.activeBottomSheet}>
          <View style={styles.handle} />

          <View style={styles.etaBar}>
            <Ionicons name="time" size={24} color="#10B981" />
            <View style={styles.etaInfo}>
              <Text style={styles.etaText}>{activeHelper.eta}</Text>
              <Text style={styles.etaLabel}>Estimert ankomst</Text>
            </View>
          </View>

          <View style={styles.helperCard}>
            <Image source={{ uri: activeHelper.photo }} style={styles.helperPhoto} />
            <View style={styles.helperInfo}>
              <Text style={styles.helperName}>{activeHelper.name}</Text>
              <View style={styles.helperRating}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.helperRatingText}>{activeHelper.rating}</Text>
              </View>
              <Text style={styles.helperVehicle}>{activeHelper.vehicle}</Text>
            </View>
            <View style={styles.helperActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="call" size={24} color="#10B981" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble" size={24} color="#10B981" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.tripRow}>
              <View style={styles.tripDot} />
              <View style={styles.tripLocation}>
                <Text style={styles.tripLabel}>Henting</Text>
                <Text style={styles.tripAddress}>Thorvald Meyers gate 42</Text>
              </View>
            </View>
            <View style={styles.tripLine} />
            <View style={styles.tripRow}>
              <View style={styles.tripDotEnd} />
              <View style={styles.tripLocation}>
                <Text style={styles.tripLabel}>Levering</Text>
                <Text style={styles.tripAddress}>Haraldrud gjenvinningsstasjon</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Avbryt oppdrag</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Searching Screen
  if (stage === 'searching') {
    return (
      <View style={styles.container}>
        {/* Map */}
        <View style={styles.map}>
          <LinearGradient
            colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']}
            style={StyleSheet.absoluteFill}
          />

          {nearbyHelpers.map((helper, index) => (
            <View
              key={helper.id}
              style={[
                styles.helperMarker,
                {
                  top: `${30 + index * 15}%`,
                  left: `${40 + index * 10}%`,
                },
              ]}
            >
              <View style={styles.carIcon}>
                <Ionicons name="car" size={16} color="#fff" />
              </View>
            </View>
          ))}
        </View>

        {/* Searching overlay */}
        <View style={styles.searchingOverlay}>
          <View style={styles.searchingCard}>
            <View style={styles.ripple}>
              <View style={styles.rippleCircle1} />
              <View style={styles.rippleCircle2} />
              <View style={styles.rippleCircle3} />
              <View style={styles.searchingIcon}>
                <Ionicons name="search" size={32} color="#10B981" />
              </View>
            </View>
            <Text style={styles.searchingTitle}>Søker etter hjelper...</Text>
            <Text style={styles.searchingSubtitle}>3 hjelpere i nærheten</Text>

            <TouchableOpacity style={styles.foundButton} onPress={() => setStage('active')}>
              <Text style={styles.foundButtonText}>Simuler match →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelSearchButton} onPress={() => setStage('main')}>
              <Text style={styles.cancelSearchText}>Avbryt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Main Screen with Tabs
  return (
    <View style={styles.container}>
      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      {showNewJob && <NewJobModal />}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.appTitle}>Kompis</Text>
          <TouchableOpacity onPress={() => setShowProfile(true)}>
            <Ionicons name="person-circle-outline" size={32} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'findHelp' && styles.tabActive]}
            onPress={() => setActiveTab('findHelp')}
          >
            <Text style={[styles.tabText, activeTab === 'findHelp' && styles.tabTextActive]}>
              Finn hjelp
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'marketplace' && styles.tabActive]}
            onPress={() => setActiveTab('marketplace')}
          >
            <Text style={[styles.tabText, activeTab === 'marketplace' && styles.tabTextActive]}>
              Oppdrag
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'findHelp' ? (
        // Find Help Tab (original PoC 2 content)
        <>
          <View style={styles.map}>
            <LinearGradient
              colors={['#E3F2FD', '#BBDEFB', '#90CAF9']}
              style={StyleSheet.absoluteFill}
            />

            {nearbyHelpers.map((helper, index) => (
              <View
                key={helper.id}
                style={[
                  styles.helperMarker,
                  {
                    top: `${25 + index * 20}%`,
                    left: `${35 + index * 15}%`,
                  },
                ]}
              >
                <View style={styles.carIcon}>
                  <Ionicons name="car" size={16} color="#fff" />
                </View>
                <View style={styles.helperBubble}>
                  <Text style={styles.helperBubbleText}>{helper.distance}</Text>
                </View>
              </View>
            ))}

            <View style={[styles.userMarker, { top: '50%', left: '50%' }]}>
              <View style={styles.userDot} />
              <View style={styles.userPulse} />
            </View>
          </View>

          <View style={styles.topMapBar}>
            <View style={styles.locationBar}>
              <Ionicons name="location" size={20} color="#10B981" />
              <Text style={styles.locationText}>Oslo sentrum</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </View>
          </View>

          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity
              style={styles.handle}
              onPress={() => {
                // Toggle sheet position
                slideUp();
              }}
            />

            <ScrollView style={styles.bottomContent}>
              <Text style={styles.bottomTitle}>Hva trenger du hjelp med?</Text>

              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickAction}>
                  <View style={[styles.quickIcon, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={styles.quickEmoji}>🛋️</Text>
                  </View>
                  <Text style={styles.quickText}>Møbler</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickAction}>
                  <View style={[styles.quickIcon, { backgroundColor: '#DBEAFE' }]}>
                    <Text style={styles.quickEmoji}>📦</Text>
                  </View>
                  <Text style={styles.quickText}>Pakker</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickAction}>
                  <View style={[styles.quickIcon, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={styles.quickEmoji}>♻️</Text>
                  </View>
                  <Text style={styles.quickText}>Resirkulering</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickAction}>
                  <View style={[styles.quickIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={styles.quickEmoji}>🏠</Text>
                  </View>
                  <Text style={styles.quickText}>Flytting</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputSection}>
                <View style={styles.inputRow}>
                  <View style={styles.inputDot} />
                  <TextInput
                    style={styles.input}
                    placeholder="Hentested"
                    placeholderTextColor="#999"
                    value="Thorvald Meyers gate 42"
                  />
                </View>

                <View style={styles.inputLine} />

                <View style={styles.inputRow}>
                  <View style={styles.inputDotEnd} />
                  <TextInput
                    style={styles.input}
                    placeholder="Leveringssted"
                    placeholderTextColor="#999"
                    value="Haraldrud gjenvinningsstasjon"
                  />
                </View>
              </View>

              <View style={styles.priceEstimate}>
                <Text style={styles.priceLabel}>Estimert pris</Text>
                <Text style={styles.priceAmount}>450 kr</Text>
              </View>

              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => {
                  slideDown();
                  setTimeout(() => setStage('searching'), 300);
                }}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.requestGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.requestButtonText}>Be om hjelp</Text>
                  <Ionicons name="arrow-forward" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.helpersNearby}>{nearbyHelpers.length} hjelpere i nærheten</Text>
            </ScrollView>
          </Animated.View>
        </>
      ) : (
        // Marketplace Tab (from the document you provided)
        <>
          <View style={styles.marketplaceHeader}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Søk etter oppdrag..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.quickActionsMarket}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.quickScroll}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.quickActionMarket,
                      activeFilter === cat.id && {
                        backgroundColor: cat.color,
                        borderColor: cat.color,
                      },
                    ]}
                    onPress={() => setActiveFilter(cat.id)}
                  >
                    <Text
                      style={[
                        styles.quickEmojiMarket,
                        activeFilter === cat.id && { transform: [{ scale: 1.2 }] },
                      ]}
                    >
                      {cat.emoji}
                    </Text>
                    <Text
                      style={[
                        styles.quickTextMarket,
                        activeFilter === cat.id && { color: '#fff', fontWeight: '600' },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <View style={styles.jobsList}>
              {filteredJobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  style={styles.jobCard}
                  onPress={() => setSelectedJob(job)}
                >
                  <Image source={{ uri: job.image }} style={styles.jobImage} />
                  <View style={styles.jobContent}>
                    <View style={styles.jobTop}>
                      <View style={styles.jobCategoryBadge}>
                        <Text style={styles.jobCategoryBadgeText}>
                          {categories.find((c) => c.id === job.category)?.emoji}
                        </Text>
                      </View>
                      <Text style={styles.jobTime}>{job.timeAgo}</Text>
                    </View>

                    <Text style={styles.jobTitle} numberOfLines={1}>
                      {job.title}
                    </Text>
                    <Text style={styles.jobDescription} numberOfLines={2}>
                      {job.description}
                    </Text>

                    <View style={styles.jobFooter}>
                      <View style={styles.jobLocation}>
                        <Ionicons name="location-outline" size={14} color="#6B7280" />
                        <Text style={styles.jobLocationText}>{job.location}</Text>
                        <Text style={styles.jobDistance}>· {job.distance}</Text>
                      </View>
                      <View style={styles.jobPrice}>
                        <Text style={styles.jobPriceAmount}>{job.price} kr</Text>
                      </View>
                    </View>

                    <View style={styles.jobPoster}>
                      <Image source={{ uri: job.postedBy.avatar }} style={styles.jobPosterAvatar} />
                      <Text style={styles.jobPosterName}>{job.postedBy.name}</Text>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.jobPosterRating}>{job.postedBy.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.fabButton} onPress={() => setShowNewJob(true)}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.fabGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.fabText}>Legg ut oppdrag</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  map: {
    flex: 1,
    position: 'relative',
  },
  userMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    marginLeft: -10,
    marginTop: -10,
  },
  userDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    top: -10,
    left: -10,
  },
  helperMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  carIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  helperBubble: {
    marginTop: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  helperBubbleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topMapBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationBar: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  bottomContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bottomTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
  },
  quickIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickEmoji: {
    fontSize: 32,
  },
  quickText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  inputSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  inputDotEnd: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#EF4444',
  },
  inputLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginLeft: 5,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
  priceEstimate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '500',
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  requestButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  requestGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  requestButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  helpersNearby: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  searchingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchingCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  ripple: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  rippleCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  rippleCircle2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  rippleCircle3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
  },
  searchingIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  searchingSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  foundButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  foundButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelSearchButton: {
    paddingVertical: 12,
  },
  cancelSearchText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  activeBottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  etaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
  },
  etaInfo: {
    flex: 1,
  },
  etaText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  etaLabel: {
    fontSize: 14,
    color: '#059669',
  },
  helperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
  },
  helperPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  helperInfo: {
    flex: 1,
  },
  helperName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  helperRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  helperRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  helperVehicle: {
    fontSize: 12,
    color: '#666',
  },
  helperActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripDetails: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tripDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  tripDotEnd: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#EF4444',
  },
  tripLine: {
    width: 2,
    height: 32,
    backgroundColor: '#E5E7EB',
    marginLeft: 5,
    marginVertical: 8,
  },
  tripLocation: {
    flex: 1,
  },
  tripLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  tripAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cancelButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  routeLine: {
    position: 'absolute',
    top: '30%',
    left: '45%',
    width: 100,
    height: 200,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    borderStyle: 'dashed',
    transform: [{ rotate: '45deg' }],
  },
  // Marketplace styles
  marketplaceHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  quickActionsMarket: {
    marginHorizontal: -20,
  },
  quickScroll: {
    paddingHorizontal: 20,
  },
  quickActionMarket: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    gap: 6,
  },
  quickEmojiMarket: {
    fontSize: 18,
  },
  quickTextMarket: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  content: {
    flex: 1,
  },
  jobsList: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  jobImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#E5E7EB',
  },
  jobContent: {
    padding: 16,
  },
  jobTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobCategoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  jobCategoryBadgeText: {
    fontSize: 16,
  },
  jobTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  jobLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  jobLocationText: {
    fontSize: 13,
    color: '#6B7280',
  },
  jobDistance: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  jobPrice: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  jobPriceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  jobPoster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobPosterAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  jobPosterName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  jobPosterRating: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  publishText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  modalScroll: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#E5E7EB',
  },
  modalBody: {
    padding: 20,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobCategory: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  jobCategoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  jobTimeAgo: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  locationSection: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    marginTop: 4,
  },
  locationDotEnd: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#EF4444',
    marginTop: 4,
  },
  locationLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginLeft: 5,
    marginVertical: 8,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  distanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  distanceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  posterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  posterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  posterRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  posterRatingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  acceptButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  acceptGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  formSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  locationTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  priceTextInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  priceUnit: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
  },
  priceHint: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    margin: 20,
    padding: 20,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  profileContent: {
    flex: 1,
  },
  profileTop: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 32,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileAvatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileAvatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  profileRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileRatingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  profileTrips: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  menuList: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default KompisApp;
