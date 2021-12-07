import nodejs from 'nodejs-mobile-react-native'

import React, {
  useEffect,
  useState
} from 'react'

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View
} from 'react-native'

// const styles = StyleSheet.create({})

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const [statusText, setStatusText] = useState('')

  console.log('Rendering', { statusText, isDarkMode })

  useEffect(() => {
    nodejs.start('bundle.js')
    nodejs.channel.addListener('message', (msg) => {
      console.log('From node: ', msg)
      if (msg.event === 'createAccount') {
        setStatusText(JSON.stringify(msg.data))
      }
    })
  })

  async function createAccount () {
    nodejs.channel.send({
      type: 'createDrive'
    })
  }

  const statusElement = statusText ? <Text>{statusText}</Text> : null

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior='automatic'
      >
        <View>
          <Button title='Create' onPress={createAccount} />
          {statusElement}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default App
