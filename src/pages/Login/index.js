import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  BackHandler,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { MyInput, MyGap, MyButton } from '../../components';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import { showMessage } from 'react-native-flash-message';
import { Icon } from 'react-native-elements';


export default function Login({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);
  const [show, setShow] = useState(true);
  const [token, setToken] = useState('');
  const [data, setData] = useState({
    telepon: '',
    password: '',
  });

  useEffect(() => {
    getData('token').then(res => {
      console.log('data token,', res);
      setToken(res.token);
    });

    const backAction = () => {
      Alert.alert("Raghiza", "Apakah kamu yakin akan keluar aplikasi ?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();


  }, []);



  // login ok
  const masuk = () => {
    if (data.telepon.length === 0 && data.password.length === 0) {
      showMessage({
        message: 'Maaf telepon dan Password masih kosong !',
      });
    } else if (data.telepon.length === 0) {
      showMessage({
        message: 'Maaf telepon masih kosong !',
      });
    } else if (data.password.length === 0) {
      showMessage({
        message: 'Maaf Password masih kosong !',
      });
    } else {
      setLoading(true);
      console.log(data);
      setTimeout(() => {
        axios
          .post(urlAPI + '/login.php', data)
          .then(res => {
            console.log(res.data);
            setLoading(false);
            if (res.data.kode == 50) {
              showMessage({
                type: 'danger',
                message: res.data.msg,
              });
            } else {
              storeData('user', res.data);
              axios
                .post(urlAPI + '/update_token.php', {
                  id_member: res.data.id,
                  token: token,
                })
                .then(res => {
                  console.log('update token', res);
                });

              navigation.replace('MainApp');
            }
          });
      }, 1200);
    }
  };
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.white,
    }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          padding: 10,
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: 250,
              height: 250,
              resizeMode: 'contain'
              // aspectRatio: 1,
            }}
          />
        </View>
        <View style={styles.page}>


          <MyGap jarak={20} />
          <MyInput
            label="Nomor Telepon"
            placeholder="Masukan nomor telepon anda"
            iconname="logo-whatsapp"
            value={data.telepon}
            keyboardType="phone-pad"
            onChangeText={value =>
              setData({
                ...data,
                telepon: value,
              })
            }
          />

          <MyGap jarak={20} />
          <MyInput
            label="Kata sandi"
            placeholder="Masukan kata sandi anda"
            iconname="lock-closed-outline"
            secureTextEntry={show}
            onChangeText={value =>
              setData({
                ...data,
                password: value,
              })
            }
          />


          <MyGap jarak={40} />
          {valid && (
            <MyButton
              warna={colors.primary}

              title="Masuk Sekarang"
              Icons="log-in-outline"
              onPress={masuk}
            />
          )}
          <Text
            style={{
              marginVertical: 20,
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 30,
              color: colors.textPrimary,
              // maxWidth: 230,
              textAlign: 'center',
            }}>
            Raghiza merupakan Usaha Bersama bergerak dalam jual beli sembako
          </Text>

        </View>
      </ScrollView>
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
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: colors.background1,
  },
  image: {
    aspectRatio: 1.5,
    resizeMode: 'contain',
  },
});
