import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { MyInput, MyGap, MyButton, MyPicker } from '../../components';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import LottieView from 'lottie-react-native';
import { urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';

export default function Register({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [open, setOpen] = useState(false);
  const [kota, setKota] = useState([]);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const validate = text => {
    // console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      // console.log('Email is Not Correct');
      setData({ ...data, email: text });
      setValid(false);
      return false;
    } else {
      setData({ ...data, email: text });
      setValid(true);
      // console.log('Email is Correct');
    }
  };

  const [data, setData] = useState({
    nama_lengkap: '',
    nip: '',
    email: '',
    password: '',
    telepon: '',
    kota: ''
  });

  const simpan = () => {
    if (
      data.nama_lengkap.length === 0 &&
      data.password.length === 0 &&
      data.telepon.length === 0
    ) {
      showMessage({
        message: 'Maaf Semua Field Harus Di isi !',
      });
    } else if (data.nama_lengkap.length === 0) {
      showMessage({
        message: 'Maaf Nama Lengkap masih kosong !',
      });
    } else if (data.telepon.length === 0) {
      showMessage({
        message: 'Maaf Telepon masih kosong !',
      });
    } else if (data.password.length === 0) {
      showMessage({
        message: 'Maaf Password masih kosong !',
      });
    } else {
      setLoading(true);
      console.log(data);
      axios
        .post(urlAPI + '/register.php', data)
        .then(res => {
          console.warn(res.data);
          let err = res.data.split('#');

          // console.log(err[0]);
          if (err[0] == 50) {
            setTimeout(() => {
              setLoading(false);
              showMessage({
                message: err[1],
                type: 'danger',
              });
            }, 1200);
          } else {
            setTimeout(() => {
              navigation.replace('Success', {
                messege: res.data,
              });
            }, 1200);
          }
        });
    }
  };




  return (
    <SafeAreaView style={{
      flex: 1,

    }}>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.page}>
        <View style={{
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',

        }}>
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>



        <View style={{
          padding: 10,
        }}>
          <MyGap jarak={10} />
          <MyInput
            label="Nama Lengkap"
            iconname="person"
            value={data.nama_lengkap}
            onChangeText={value =>
              setData({
                ...data,
                nama_lengkap: value,
              })
            }
          />






          <MyGap jarak={10} />
          <MyInput
            label="Telepon"
            iconname="call"
            keyboardType="phone-pad"
            value={data.telepon}
            onChangeText={value =>
              setData({
                ...data,
                telepon: value,
              })
            }
          />

          <MyGap jarak={10} />
          <MyInput
            label="Alamat"
            iconname="map"
            value={data.alamat}
            onChangeText={value =>
              setData({
                ...data,
                alamat: value,
              })
            }
          />




          <MyGap jarak={10} />
          <MyInput
            label="Password"
            iconname="key"
            secureTextEntry={show}
            value={data.password}
            onChangeText={value =>
              setData({
                ...data,
                password: value,
              })
            }
          />

          {!show && <TouchableOpacity onPress={() => {
            setShow(true)
          }} style={{
            paddingHorizontal: 5,
            paddingVertical: 10,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            flexDirection: 'row'
          }}>
            <Icon size={windowWidth / 25} color={colors.textPrimary} type='ionicon' name='eye-off-outline' />
            <Text style={{
              left: 5,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30,
              color: colors.textPrimary,
            }}>Hide Password</Text>
          </TouchableOpacity>}

          {show && <TouchableOpacity onPress={() => {
            setShow(false)
          }} style={{
            paddingHorizontal: 5,
            paddingVertical: 10,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            flexDirection: 'row'
          }}>
            <Icon size={windowWidth / 25} type='ionicon' color={colors.textPrimary} name='eye-outline' />
            <Text style={{
              left: 5,
              color: colors.textPrimary,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30
            }}>Show Password</Text>
          </TouchableOpacity>}
          <MyGap jarak={20} />

          <MyButton
            warna={colors.primary}
            title="REGISTER"
            Icons="log-in"
            onPress={simpan}
          />

          <MyGap jarak={20} />
        </View>
      </ScrollView>
      {loading && (
        <LottieView
          source={require('../../assets/animation.json')}
          autoPlay
          loop
          style={{
            flex: 1,
            backgroundColor: colors.primary,
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },

});
