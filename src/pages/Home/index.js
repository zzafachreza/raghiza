import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import 'intl';
import 'intl/locale-data/jsonp/en';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import { MyGap } from '../../components';
import MyHeader from '../../components/MyHeader';

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [kategori, setKategori] = useState([]);

  const [produk, setProduk] = useState([]);
  const [cart, setCart] = useState(0);
  const [token, setToken] = useState('');
  const [comp, setComp] = useState({});

  const isFocused = useIsFocused();

  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const json = JSON.stringify(remoteMessage);
      const obj = JSON.parse(json);

      // console.log(obj);

      // alert(obj.notification.title)



      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'raghiza', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        title: obj.notification.title, // (optional)
        message: obj.notification.body, // (required)
      });
    });


    getDataKategori();

    axios.post(urlAPI + '/company.php').then(c => {
      console.log(c.data);
      setComp(c.data);
    })

    if (isFocused) {
      __getDataUserInfo();
    }
    return unsubscribe;
  }, [isFocused]);




  const getDataKategori = () => {
    axios.post(urlAPI + '/1data_kategori.php').then(res => {
      console.log('kategori', res.data);

      setKategori(res.data);
    })
  }



  const __getDataUserInfo = () => {
    getData('user').then(users => {
      console.log(users);
      setUser(users);

      getData('token').then(res => {
        console.log('data token,', res);
        setToken(res.token);
        axios
          .post(urlAPI + '/update_token.php', {
            id: users.id,
            token: res.token,
          })
          .then(res => {
            console.error('update token', res.data);
          });
      });
    });
  }

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;

  const __renderItemKategori = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Barang', {
        key: item.id,
        id_user: user.id
      })} style={{
        backgroundColor: colors.secondary,
        marginHorizontal: 5,
        borderRadius: 5,
        overflow: 'hidden',
        flex: 0.5,
        marginVertical: 5,

      }}>

        <View style={{
          justifyContent: 'center',
          alignItems: 'center',

        }}>
          <Image style={{
            width: '100%',
            height: 80,

          }} source={{
            uri: item.image
          }} />
        </View>
        <Text style={{
          textAlign: 'left',
          padding: 7,
          color: colors.white,
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 32,
        }}>{item.nama_kategori}</Text>
      </TouchableOpacity>
    )
  }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <MyHeader telepon={comp.tlp} />
      <ScrollView style={{
        backgroundColor: colors.background1
      }}>
        <MyGap jarak={10} />
        <View style={{
          paddingHorizontal: 10
        }}>
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 28
          }}>Halo {user.nama_lengkap}</Text>
        </View>
        <MyGap jarak={10} />
        <MyCarouser />


        {/* list Kategoti */}
        <View>
          <View style={{
            flexDirection: 'row',
            flex: 1,
            paddingHorizontal: 10,
            padding: 10,
            alignItems: 'center'
          }}>
            <Icon type='ionicon' name="grid" color={colors.primary} />
            <Text style={{
              left: 10,
              color: colors.primary,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 25,
            }}>Kategori Produk Raghiza</Text>
          </View>
          <View style={{
            flex: 1,
          }}>
            <FlatList numColumns={2} data={kategori} renderItem={__renderItemKategori} />
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
