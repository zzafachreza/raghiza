import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList, Pressable,
  TouchableWithoutFeedback,
  Image,
  Linking,
  Modal,
  ActivityIndicator,
} from 'react-native';

import LottieView from 'lottie-react-native';
import { getData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyButton, MyInput, MyGap, MyPicker } from '../../components';
import { colors } from '../../utils/colors';
import { TouchableOpacity, Swipeable } from 'react-native-gesture-handler';
import { fonts, windowWidth } from '../../utils/fonts';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { showMessage } from 'react-native-flash-message';
import { color } from 'react-native-reanimated';

export default function Checkout({ navigation, route }) {
  const item = route.params;
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [company, setCompany] = useState({});
  const [paket, setPaket] = useState([]);

  const [kirim, setKirim] = useState(route.params);
  const [user, setUser] = useState({});
  const [kurir, setKurir] = useState([
    {
      nama_kirim: 'Antar',
    },
    {
      nama_kirim: 'Ambil Sendiri',
    }
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [comp, setComp] = useState({});
  useEffect(() => {

    axios.post(urlAPI + '/company.php').then(c => {
      console.log(c.data);
      setComp(c.data);
    })


    getData('user').then(res => {
      console.error(res)
      setUser(res);
      setKirim({
        ...kirim,
        catatan: '',
      })
    });



  }, []);



  const simpan = () => {
    setLoading(true)
    console.error('kirim', kirim);
    axios.post(urlAPI + '/1add_transaksi.php', kirim).then(rr => {
      // console.log('https://api.whatsapp.com/send?phone=' + comp.tlp + rr.data);
      setTimeout(() => {
        setLoading(false);
        showMessage({
          type: 'success',
          message: 'Transaksi kamu berhasil dikirim'
        });

        // Linking.openURL('https://api.whatsapp.com/send?phone=' + comp.tlp + rr.data)

        navigation.replace('ListData');
      }, 1500)
    })

  };


  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background1 }}>
        <ScrollView>

          {/* data penerima */}

          <View style={{
            backgroundColor: colors.zavalabs,
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.border_list,
          }}>
            <Text style={{
              color: colors.textPrimary,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30
            }}>Pesananmu siap diteruskan ke toko, silahkan tulis catatan apabila ada yang ingin di tanyakan</Text>
            {/* <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 30,
              color: colors.textPrimary,

            }}>{user.nama_lengkap}</Text>
            <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 30,
              color: colors.textPrimary
            }}>{user.telepon}</Text>
            <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 30,
              color: colors.textPrimary
            }}>{user.alamat}</Text> */}
          </View>









          <View style={{
            padding: 10,
          }}>
            <MyInput onChangeText={x => setKirim({
              ...kirim,
              catatan: x
            })} placeholder="Masukan catatan untuk pesanan" iconname="create" label="Catatan untuk Pesanan" />
          </View>



        </ScrollView>
        <Text style={{
          textAlign: 'center',
          fontFamily: fonts.secondary[600],
          fontSize: windowWidth / 15
        }}>
          Rp. {new Intl.NumberFormat().format(route.params.harga_total)}
        </Text>

        <View style={{ padding: 10, backgroundColor: colors.white, }}>
          <MyButton
            onPress={simpan}
            title="TERUSKAN ORDER KE TOKO"
            warna={colors.primary}
            Icons="cloud-upload"
            style={{
              justifyContent: 'flex-end',
            }}
          />
        </View>




      </SafeAreaView>
      {
        loading && (
          <LottieView
            source={require('../../assets/animation.json')}
            autoPlay
            loop
            style={{ backgroundColor: colors.primary }}
          />
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 0,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    flex: 1,
    marginBottom: 15,
    textAlign: "center"
  }
});
