import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { userShellSlice } from 'react-native-shell';
import {useEffect} from "react";


export default function App() {
    useEffect(() => {
        (async () => {
            try {
                var r=await userShellSlice(`whoami`)
                console.log(r)
            } catch (e:any) {
                console.log(e.toString())
            }
        })()
    }, []);

    return (
        <View style={styles.container}>
          <Text>aa</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
});
