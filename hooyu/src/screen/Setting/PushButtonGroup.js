import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, LogBox } from 'react-native'

const PushButtonGroup = ({ setPushRadius, currentRadius, isPushEnabled }) => {

  LogBox.ignoreAllLogs()

  const [selection, setSelection] = useState(currentRadius)
  
  useEffect(() => {
    setPushRadius(selection)
  }, [selection])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.btnGroup}>
        <TouchableOpacity
          style={[
            styles.btn,
            { borderBottomLeftRadius: 20, borderTopLeftRadius: 20, },
            selection === 20 ? { backgroundColor: `${isPushEnabled ? "#FF6A77" : "#c9c9c9"}` } : null
          ]}
          onPress={() => setSelection(20)}
          disabled={!isPushEnabled}
        >
          <Text style={[styles.btnText, selection === 20 ? { color: "white" } : { color: "#E5E5E5" }]}>20m</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, selection === 100 ? { backgroundColor: `${ isPushEnabled ? "#FF6A77" : "#c9c9c9"}`} : null]} onPress={() => setSelection(100)} disabled={!isPushEnabled}>
          <Text style={[styles.btnText, selection === 100 ? { color: "white" } : { color: "#E5E5E5" }]}>100m</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, selection === 500 ? { backgroundColor: `${ isPushEnabled ? "#FF6A77" : "#c9c9c9"}`} : null]} onPress={() => setSelection(500)} disabled={!isPushEnabled}>
          <Text style={[styles.btnText, selection === 500 ? { color: "white" } : { color: "#E5E5E5" }]}>500m</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btn,
            { borderBottomRightRadius: 20, borderTopRightRadius: 20, },
            selection === 30000 ? { backgroundColor: `${isPushEnabled ? "#FF6A77" : "#c9c9c9"}` } : null
          ]}
          onPress={() => setSelection(30000)}
          disabled={!isPushEnabled}
        >
          <Text style={[styles.btnText, selection === 30000 ? { color: "white" } : { color: "#E5E5E5" }]}>2km</Text>
        </TouchableOpacity>
      </View>
        
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    borderColor: '#6B7280'
  },
  btnGroup: {
    flexDirection: 'row',
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#6B7280',
    borderRadius: 20,
  },
  btnText: {
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
  },
  container: {
    flex: 1,
  },
})

export default PushButtonGroup