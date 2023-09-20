import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import * as movininTypes from  '../miscellaneous/movininTypes'

import i18n from '../lang/i18n'
import * as UserService from '../services/UserService'
import Master from '../components/Master'
import BookingList from '../components/BookingList'
import * as Env from '../config/env.config'

const BookingScreen = ({ navigation, route }: NativeStackScreenProps<StackParams, 'Booking'>) => {
  const isFocused = useIsFocused()
  const [language, setLanguage] = useState(Env.DEFAULT_LANGUAGE)
  const [reload, setReload] = useState(false)
  const [visible, setVisible] = useState(false)
  const [user, setUser] = useState<movininTypes.User>()

  const _init = async () => {
    setVisible(false)
    const language = await UserService.getLanguage()
    setLanguage(language)
    i18n.locale = language

    const currentUser = await UserService.getCurrentUser()

    if (!currentUser || !currentUser._id) {
      await UserService.signout(navigation, false, true)
      return
    }

    const user = await UserService.getUser(currentUser._id)

    if (!user) {
      await UserService.signout(navigation, false, true)
      return
    }

    setUser(user)
    setVisible(true)
  }

  useEffect(() => {
    if (isFocused) {
      _init()
      setReload(true)
    } else {
      setVisible(false)
    }
  }, [route.params, isFocused]) // eslint-disable-line react-hooks/exhaustive-deps

  const onLoad = () => {
    setReload(false)
  }

  return (
    <Master style={styles.master} navigation={navigation} route={route} onLoad={onLoad} reload={reload} strict>
      {visible &&
        <BookingList
          user={user?._id as string}
          booking={route.params.id}
          language={language}
        />}
    </Master>
  )
}

const styles = StyleSheet.create({
  master: {
    flex: 1,
  },
})

export default BookingScreen